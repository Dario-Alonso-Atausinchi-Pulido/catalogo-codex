export type GuitarreroLane = 0 | 1 | 2 | 3;

export type GuitarreroJudgement = 'perfect' | 'good' | 'miss';

export type GuitarreroPlayerMood = 'voy-bien' | 'mas-o-menos' | 'voy-mal';

export interface GuitarreroChartNote {
  lane: GuitarreroLane;
  timeMs: number;
}

export interface GuitarreroSong {
  id: string;
  title: string;
  preview: string;
  difficultyLabel: string;
  accentColor: string;
  albumArtSrc: string;
  audioSrc: string;
  bpm: number;
  durationMs: number;
  notes: ReadonlyArray<GuitarreroChartNote>;
}
