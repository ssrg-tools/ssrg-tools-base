
export interface SongInfo
{
  length_display: string;
  length_seconds: string;
  length_nominal: number;
  dalcom_song_id: string;
  dalcom_song_filename: string;
  date_processed: string;
  beatmap_fingerprint: string;
  bydifficulties: {
    [difficulty: string]: {
      difficulty: string,
      difficulty_id: string,
      dalcom_beatmap_filename: string,
      beatmap_fingerprint: string,
      index_beat_min: number,
      index_beat_max: number,
      count_notes_total: number,
      count_notes_nocombo: number,
      count_taps: number,
      count_sliders_nocombo: number,
      count_sliders_total: number,
      date_processed: string,
      guid: string,
    },
  };
}
