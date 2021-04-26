import _, { Dictionary } from 'lodash';
import { Difficulty, difficultyIds } from './types';

type NoteTap = 'tap';
type NoteSlider = 'slider';
type NoteType = NoteTap | NoteSlider;

const noteTypes: Dictionary<NoteType> = {
  0x00: 'tap',
  0x0B: 'slider',
  0x0C: 'slider',
  0x03: 'slider',
  0x15: 'slider',
  0x16: 'slider',
  0xE8: 'slider',
  0xE9: 'slider',
};

const noteTypeIDs: NoteTypeID[] = [
  0x00,
  0x0B,
  0x0C,
  0x03,
  0x15,
  0x16,
  0xE8,
  0xE9,
];

enum NoteTypeID {
  Tap = 0x00,
  Slider0B = 0x0B,
  Slider0C = 0x0C,
  Slider03 = 0x03,
  Slider15 = 0x15,
  Slider16 = 0x16,
  SliderE8 = 0xE8,
  SliderE9 = 0xE9,
}

function validNoteTypeID(input: number): input is NoteTypeID {
  return noteTypeIDs.includes(input);
}

const sliderGroups = {
  0x0B: 1,
  0x0C: 1,
  0x03: 1, // See Starship / YSW - Walk.ogg
  0x15: 2,
  0x16: 2,
  0xE8: 3,
  0xE9: 3,
};

/** These slider types are starting the slider */
const sliderStart = [0x0B, 0x15, 0xE8];

interface BeatmapOffsets {
  difficultyId: number;
  noteCount: number;
  songName: number[];
  songNameNullBytes: number;
  noteDataLength: number;
  noteDataStartOffset: number;
}

const beatmapTypes: BeatmapTypes[] = [0x65, 0x66];

enum BeatmapTypes {
  // older SM beatmaps
  Legacy = 0x65,
  // newer SM beatmaps and all other SSRGs
  Normal = 0x66,
}

const beatmapOffsets: Dictionary<BeatmapOffsets> = {
    [BeatmapTypes.Legacy]: {
        difficultyId: 0x34,
        noteCount: 0x28,
        songName: [0xAC],
        songNameNullBytes: 1,
        noteDataLength: 20,
        noteDataStartOffset: 2312, // 2048 + 264 (0x108)
    },
    [BeatmapTypes.Normal]: {
        difficultyId: 0x38,
        noteCount: 0x2C,
        songName: [0xBC, 0x19C],
        songNameNullBytes: 2,
        noteDataLength: 24,
        noteDataStartOffset: 2316, // 2048 + 268 (0x10C)
    },
};

const audioSourceExtension = '.ogg';

function readFilenameFromBeatmap(
  input: Buffer,
  songNames: number[],
  songNameNullBytes: number
): null | { songName: string, songNameOffset: number, songNameLength: number } {
  if (!songNames.length) {
    return null;
  }

  const songNameLength = input.readInt32LE(songNames[0] - 4);
  const songName = input.slice(songNames[0], songNames[0] + songNameLength - songNameNullBytes).toString('utf8');

  if (songName.endsWith(audioSourceExtension)) {
    return {
      songName,
      songNameOffset: songNames[0],
      songNameLength,
    };
  }

  return readFilenameFromBeatmap(input, songNames.slice(1), songNameNullBytes);
}

interface Beatmap {
  beatmapType: BeatmapTypes;
  difficultyId: Difficulty;
  /** source file name (not related to game assets) */
  filename: string;

  noteCount: number;
  noteCountRaw: number;
  notes: Note[];
}

export function parseBeatmapFile(input: Buffer): Beatmap {
  if (!input || input.length < 4) {
    throw new Error('Input buffer too small.');
  }
  const readInt32 = (offset: number) => input.readUInt32LE(offset);

  const beatmapType = readInt32(0);
  if (!beatmapTypes.includes(beatmapType)) {
    throw new Error(`Beatmap type 0x${beatmapType.toString(16)} is unknown.`);
  }
  const offsets = beatmapOffsets[beatmapType];

  const minLength = offsets.noteDataStartOffset + Math.max(...offsets.songName) + offsets.noteDataLength;
  if (input.length < minLength) {
    throw new Error(`Beatmap file too short, expected at least ${minLength} bytes but received ${input.length} bytes.`);
  }

  const difficultyId = readInt32(offsets.difficultyId) - 0x64;
  if (!difficultyIds.includes(difficultyId)) {
    throw new Error(`Difficulty ID ${difficultyId} is unknown.`);
  }

  const noteCount = readInt32(offsets.noteCount);
  if (noteCount <= 0) {
    throw new Error(`Invalid note count: ${noteCount}.`);
  }

  const songNameInfo = readFilenameFromBeatmap(input, offsets.songName, offsets.songNameNullBytes);
  if (_.isNull(songNameInfo)) {
    throw new Error(`Could not find filename in beatmap.`);
  }
  const filename = songNameInfo.songName;

  const noteData = input.slice(songNameInfo.songNameOffset + songNameInfo.songNameLength + offsets.noteDataStartOffset);

  const notes = readNoteData(noteData, offsets.noteDataLength);
  if (notes.notes.length !== (noteCount - 1)) {
    throw new Error(`Wrong note count, expected ${noteCount - 1} but got ${notes.notes.length};`);
  }

  return {
    beatmapType,
    difficultyId,
    noteCount,
    filename,
    notes: notes.notes,
    noteCountRaw: notes.noteCountRaw,
  };
}

interface Note {
  type: NoteType;
  typeID: NoteTypeID;
  // Original beat (y) and sub-beat (yy/256) combined
  beat: number;
  lane: number;
}

function readNoteData(noteData: Buffer, noteDataLength: number): { notes: Note[], noteCountRaw: number } {
  if ((noteData.length % noteDataLength) !== 0) {
    throw new Error(`Beatmap note data (${noteData.length} bytes) not divisible by ${noteDataLength} bytes.`);
  }
  const notes: Note[] = [];

  let currentOffset = 0;
  let line: Buffer;
  let noteCountRaw = 0;
  const maxOffset = noteData.length;

  const readInt32 = (offset: number) => line.readUInt32LE(offset);
  const readInt8 = (offset: number) => line.readUInt8(offset);

  while (currentOffset < maxOffset) {
    line = noteData.slice(currentOffset, currentOffset + noteDataLength);
    currentOffset += noteDataLength;

    const subBeat = readInt8(0);
    const beat = readInt32(1);
    const lane = readInt8(8);
    const typeID = readInt8(16);

    noteCountRaw++;
    if (lane > 13) {
      // Skip bullshit notes
      continue;
    }

    if (!validNoteTypeID(typeID)) {
      throw new Error(`Unknown note type ID: 0x${typeID.toString(16)}.`);
    }

    notes.push({
      beat: beat + subBeat / 256,
      lane,
      type: noteTypes[typeID],
      typeID,
    });
  }

  return {
    notes,
    noteCountRaw,
  };
}
