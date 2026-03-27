import {
  GuitarreroJudgement,
  GuitarreroLane,
  GuitarreroPlayerMood,
  GuitarreroSong
} from './guitarrero-song.model';

export interface GuitarreroRuntimeNote {
  id: string;
  lane: GuitarreroLane;
  timeMs: number;
  judgement: GuitarreroJudgement | null;
  resolvedAtMs: number | null;
  deltaMs: number | null;
}

export interface GuitarreroJudgementEvent {
  judgement: GuitarreroJudgement;
  lane: GuitarreroLane;
  timeMs: number;
}

export interface GuitarreroFeedbackState extends GuitarreroJudgementEvent {
  expiresAtMs: number;
}

export interface GuitarreroJudgementCounts {
  perfect: number;
  good: number;
  miss: number;
}

export interface GuitarreroFeverSnapshot {
  charge: number;
  active: boolean;
  ready: boolean;
  streak: number;
  multiplier: number;
}

export interface GuitarreroSceneSnapshot {
  song: GuitarreroSong;
  elapsedMs: number;
  progress: number;
  score: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  counts: GuitarreroJudgementCounts;
  mood: GuitarreroPlayerMood;
  fever: GuitarreroFeverSnapshot;
  feedback: GuitarreroFeedbackState | null;
  visibleNotes: ReadonlyArray<GuitarreroRuntimeNote>;
  pressedLanes: ReadonlyArray<boolean>;
  isPaused: boolean;
}

export interface GuitarreroResultState {
  song: GuitarreroSong;
  score: number;
  maxCombo: number;
  hits: number;
  misses: number;
  counts: GuitarreroJudgementCounts;
  accuracy: number;
  mood: GuitarreroPlayerMood;
}
