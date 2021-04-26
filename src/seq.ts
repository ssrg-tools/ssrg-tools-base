import { readFile } from 'fs/promises';
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

/**
 * Header information for beatmaps.
 *
 * The data core also represents the start of the beatmap files. For v2 with padding of four bytes after tickPerBeat and type, respectively.
 */
interface SeqDataCore {
  layoutVersion: BeatmapTypes;
  tickLength: number;
  secLength: number;
  tickPerBeat: number;
  beatPerTick: number;
  tempoCount: number;
  objectCount: number;
  channelCount: number;
  noteCount: number;
  measureCount: number;
  beatCount: number;
  difficultyId: Difficulty;
}

interface BeatmapOffsets {
  difficultyId: number;
  noteCount: number;
  songName: number[];
  songNameNullBytes: number;
  noteDataLength: number;
  noteDataStartOffset: number;
}

enum BeatmapTypes {
  // older SM beatmaps
  Legacy = 0x65,
  // newer SM beatmaps and all other SSRGs
  Normal = 0x66,
}

const beatmapTypes: BeatmapTypes[] = [0x65, 0x66];

function validBeatmapType(input: number): input is BeatmapTypes {
  return beatmapTypes.includes(input);
}

interface BeatmapTypeInfo {
  layoutVersion: BeatmapTypes;
  dataCoreLength: number;
  hasPadding: boolean;
  noteDataLength: number;
  tempoDataLength: number;
  filenameOffset: number;
}

const beatmapTypesInfo: Dictionary<BeatmapTypeInfo> = {
  [BeatmapTypes.Legacy]: {
    layoutVersion: BeatmapTypes.Legacy,
    dataCoreLength: 0x3c,
    hasPadding: false,
    noteDataLength: 20,
    tempoDataLength: 0x68,
    filenameOffset: 4,
  },
  [BeatmapTypes.Normal]: {
    layoutVersion: BeatmapTypes.Normal,
    dataCoreLength: 0x40,
    hasPadding: true,
    noteDataLength: 24,
    tempoDataLength: 0x70,
    filenameOffset: 8,
  },
};

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

function readFilenameFromBeatmap(input: Buffer): null | { songName: string, remaining: Buffer } {
  const songNameLength = input.readUInt32LE(0);
  const songName = input.slice(4, songNameLength + 4).toString('utf8').replace(/\0+$/, '');

  if (songName.endsWith(audioSourceExtension)) {
    return {
      songName,
      remaining: input.slice(4 + songNameLength),
    };
  }

  return null;
}

function readDataCore(input: Buffer): {
  dataCore: SeqDataCore,
  remaining: Buffer,
  layoutInfo: BeatmapTypeInfo,
} {
  const layoutVersion = input.readInt32LE(0);
  if (!validBeatmapType(layoutVersion)) {
    throw new Error(`Beatmap type 0x${layoutVersion.toString(16)} is unknown.`);
  }

  const layoutInfo = beatmapTypesInfo[layoutVersion];
  if (input.length < layoutInfo.dataCoreLength) {
    throw new Error(`Beatmap file too short, expected at least ${layoutInfo.dataCoreLength} bytes but received ${input.length} bytes.`);
  }

  const skipPadOffset = layoutInfo.hasPadding ? 4 : 0;

  const dataCore: SeqDataCore = {
    layoutVersion,
    tickLength:   input.readInt32LE(  0x4),
    secLength:    input.readDoubleLE( 0x8),
    tickPerBeat:  input.readInt32LE( 0x10),
    beatPerTick:  input.readDoubleLE(0x14 + skipPadOffset),
    tempoCount:   input.readUInt32LE(0x1C + skipPadOffset),
    objectCount:  input.readUInt32LE(0x20 + skipPadOffset),
    channelCount: input.readUInt32LE(0x24 + skipPadOffset),
    noteCount:    input.readUInt32LE(0x28 + skipPadOffset),
    measureCount: input.readUInt32LE(0x2C + skipPadOffset),
    beatCount:    input.readUInt32LE(0x30 + skipPadOffset),
    difficultyId: input.readUInt32LE(0x34 + skipPadOffset) - 0x64,
  };

  if (!difficultyIds.includes(dataCore.difficultyId)) {
    throw new Error(`Difficulty ID ${dataCore.difficultyId} is unknown.`);
  }

  if (dataCore.noteCount <= 0) {
    throw new Error(`Invalid note count: ${dataCore.noteCount}.`);
  }

  return {
    dataCore,
    layoutInfo,
    remaining: input.slice(layoutInfo.dataCoreLength),
  };
}

export interface Beatmap {
  info: SeqDataCore;
  /** source file name (not related to game assets) */
  filename: string;

  /** count includes all the bullshit notes. notes are not included in notes. */
  noteCountRaw: number;
  notes: Note[];

  issues?: SeqIssue[];
}

export function parseBeatmap(input: Buffer): Beatmap {
  if (!input || input.length < 4) {
    throw new Error('Input buffer too small.');
  }

  const issues: SeqIssue[] = [];

  const {
    dataCore,
    layoutInfo,
    remaining,
  } = readDataCore(input);
  const offsets = beatmapOffsets[dataCore.layoutVersion];

  const minLength = offsets.noteDataStartOffset + Math.max(...offsets.songName) + offsets.noteDataLength;
  if (remaining.length < minLength) {
    throw new Error(`Beatmap file too short, expected at least ${minLength} bytes but received ${input.length} bytes.`);
  }

  const tempoDataBufferSize = dataCore.tempoCount * layoutInfo.tempoDataLength;
  // TODO: const tempoDataBuffer = remaining.slice(0, tempoDataBufferSize);

  const remainingAtFilename = remaining.slice(tempoDataBufferSize + layoutInfo.filenameOffset);
  const songNameInfo = readFilenameFromBeatmap(remainingAtFilename);
  if (_.isNull(songNameInfo)) {
    console.error(remainingAtFilename.slice(0, 60));
    throw new Error(`Could not find filename in beatmap.`);
  }
  const filename = songNameInfo.songName;
  const remaining3 = songNameInfo.remaining;

  const noteData = remaining3.slice(offsets.noteDataStartOffset);

  const notes = readNoteData(noteData, offsets.noteDataLength);
  if (notes.notes.length !== (dataCore.noteCount - 2)) {
    const wrongNoteError = new SeqWrongNoteCountError(
      `Wrong note count, expected ${dataCore.noteCount - 1} but got ${notes.notes.length}.`,
      dataCore,
    );
    issues.push(wrongNoteError);
  }
  notes.issues?.forEach(noteIssue => issues.push(noteIssue));

  return {
    info: dataCore,
    filename,
    notes: notes.notes,
    noteCountRaw: notes.noteCountRaw,
    issues,
  };
}

interface Note {
  type: NoteType;
  typeID: NoteTypeID;
  // Original beat (y) and sub-beat (yy/256) combined
  beat: number;
  lane: number;
}

function readNoteData(noteData: Buffer, noteDataLength: number): { notes: Note[], noteCountRaw: number, issues?: SeqIssue[] } {
  if ((noteData.length % noteDataLength) !== 0) {
    throw new Error(`Beatmap note data (${noteData.length} bytes) not divisible by ${noteDataLength} bytes.`);
  }
  const notes: Note[] = [];
  const issues: SeqIssue[] = [];

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
      issues.push(new Error(`Unknown note type ID: 0x${typeID.toString(16).padStart(2, '0')}.`));
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
    issues,
  };
}

export async function parseBeatmapFile(filepath: string) {
  const contents = await readFile(filepath);
  return parseBeatmap(contents);
}

export class SeqIssue extends Error {
  constructor(
    message: string,
    public readonly beatmapInfo?: SeqDataCore,
  ) {
    super(message);
  }
}

/** Issues that one may ignore. */
export class SeqSoftIssue extends SeqIssue {
  constructor(message: string, beatmapInfo?: SeqDataCore) {
    super(message, beatmapInfo);
  }
}

export class SeqWrongNoteCountError extends SeqSoftIssue {
  constructor(message: string, beatmapInfo?: SeqDataCore) {
    super(message, beatmapInfo);
  }
}
