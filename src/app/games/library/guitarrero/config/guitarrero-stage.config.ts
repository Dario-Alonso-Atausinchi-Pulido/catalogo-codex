import { CanvasStageConfig } from '../../../engine/models/canvas-stage-config.model';
import { GuitarreroLane, GuitarreroPlayerMood } from '../models/guitarrero-song.model';

export const GUITARRERO_STAGE_CONFIG: CanvasStageConfig = {
  width: 1280,
  height: 720
};

export const GUITARRERO_LANE_COUNT = 4;
export const GUITARRERO_LANE_KEYS = ['A', 'S', 'K', 'L'] as const;
export const GUITARRERO_LANE_COLORS = ['#ffd166', '#ff5c8a', '#5cf4ff', '#7bff7a'] as const;
export const GUITARRERO_KEY_TO_LANE: Record<string, GuitarreroLane> = {
  a: 0,
  s: 1,
  k: 2,
  l: 3
};

export const GUITARRERO_TIMING_WINDOWS = {
  perfectMs: 90,
  goodMs: 170,
  missMs: 210,
  approachMs: 1800,
  feedbackMs: 520,
  finishGraceMs: 950
} as const;

export const GUITARRERO_AUDIO_CONFIG = {
  baseVolume: 0.48,
  missVolume: 0.08,
  duckDurationMs: 220
} as const;

export const GUITARRERO_FEVER_CONFIG = {
  comboToUnlockCharge: 10,
  hitsToFill: 20,
  drainDurationMs: 5000,
  scoreMultiplier: 2
} as const;

export const GUITARRERO_MOOD_META: Record<
  GuitarreroPlayerMood,
  { label: string; tone: string; hint: string }
> = {
  'voy-bien': {
    label: 'Voy bien',
    tone: 'great',
    hint: 'Mantienes el ritmo afilado.'
  },
  'mas-o-menos': {
    label: 'Mas o menos',
    tone: 'steady',
    hint: 'Todavia sigues en la cancion.'
  },
  'voy-mal': {
    label: 'Voy mal',
    tone: 'danger',
    hint: 'El castigo musical ya se siente.'
  }
};
