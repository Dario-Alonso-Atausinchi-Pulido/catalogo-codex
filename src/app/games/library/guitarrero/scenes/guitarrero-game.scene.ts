import { GUITARRERO_FEVER_CONFIG, GUITARRERO_TIMING_WINDOWS } from '../config/guitarrero-stage.config';
import {
  GuitarreroFeedbackState,
  GuitarreroJudgementCounts,
  GuitarreroJudgementEvent,
  GuitarreroResultState,
  GuitarreroRuntimeNote,
  GuitarreroSceneSnapshot
} from '../models/guitarrero-runtime-state.model';
import {
  GuitarreroJudgement,
  GuitarreroLane,
  GuitarreroPlayerMood,
  GuitarreroSong
} from '../models/guitarrero-song.model';

const JUDGEMENT_SCORES: Record<GuitarreroJudgement, number> = {
  perfect: 100,
  good: 60,
  miss: 0
};

const MOOD_WEIGHTS: Record<GuitarreroJudgement, number> = {
  perfect: 1,
  good: 0.62,
  miss: 0
};

export class GuitarreroGameScene {
  private readonly notes: GuitarreroRuntimeNote[];
  private readonly counts: GuitarreroJudgementCounts = {
    perfect: 0,
    good: 0,
    miss: 0
  };
  private readonly recentJudgements: GuitarreroJudgement[] = [];
  private readonly pendingEvents: GuitarreroJudgementEvent[] = [];

  private feedback: GuitarreroFeedbackState | null = null;
  private elapsedMs = 0;
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private hitStreak = 0;
  private feverCharge = 0;
  private feverActive = false;
  private finished = false;

  constructor(private readonly song: GuitarreroSong) {
    this.notes = song.notes.map((note, index) => ({
      id: `${song.id}-${index}`,
      lane: note.lane,
      timeMs: note.timeMs,
      judgement: null,
      resolvedAtMs: null,
      deltaMs: null
    }));
  }

  update(deltaMs: number): void {
    if (this.finished) {
      return;
    }

    const safeDeltaMs = Math.max(0, deltaMs);
    this.elapsedMs += safeDeltaMs;
    this.updateFever(safeDeltaMs);
    this.resolveMissedNotes();

    if (
      this.elapsedMs >= this.song.durationMs + GUITARRERO_TIMING_WINDOWS.finishGraceMs &&
      this.notes.every((note) => note.judgement !== null)
    ) {
      this.finished = true;
    }
  }

  pressLane(lane: GuitarreroLane): void {
    if (this.finished) {
      return;
    }

    const candidate = this.notes
      .filter((note) => note.lane === lane && note.judgement === null)
      .filter((note) => Math.abs(note.timeMs - this.elapsedMs) <= GUITARRERO_TIMING_WINDOWS.goodMs)
      .sort((left, right) => Math.abs(left.timeMs - this.elapsedMs) - Math.abs(right.timeMs - this.elapsedMs))
      .at(0);

    if (!candidate) {
      return;
    }

    const deltaMs = Math.abs(candidate.timeMs - this.elapsedMs);

    if (deltaMs <= GUITARRERO_TIMING_WINDOWS.perfectMs) {
      this.resolveNote(candidate, 'perfect', deltaMs);
      return;
    }

    if (deltaMs <= GUITARRERO_TIMING_WINDOWS.goodMs) {
      this.resolveNote(candidate, 'good', deltaMs);
    }
  }

  drainEvents(): GuitarreroJudgementEvent[] {
    const events = [...this.pendingEvents];
    this.pendingEvents.length = 0;
    return events;
  }

  getSnapshot(pressedLanes: ReadonlyArray<boolean>): GuitarreroSceneSnapshot {
    const activeFeedback =
      this.feedback && this.feedback.expiresAtMs >= this.elapsedMs ? this.feedback : null;
    const visibleNotes = this.notes.filter(
      (note) =>
        note.judgement === null &&
        note.timeMs >= this.elapsedMs - GUITARRERO_TIMING_WINDOWS.missMs &&
        note.timeMs <= this.elapsedMs + GUITARRERO_TIMING_WINDOWS.approachMs + 240
    );

    return {
      song: this.song,
      elapsedMs: this.elapsedMs,
      progress: Math.min(this.elapsedMs / this.song.durationMs, 1),
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      hits: this.counts.perfect + this.counts.good,
      misses: this.counts.miss,
      counts: { ...this.counts },
      mood: this.resolveMood(),
      fever: {
        charge: this.feverCharge,
        active: this.feverActive,
        ready:
          !this.feverActive && this.hitStreak >= GUITARRERO_FEVER_CONFIG.comboToUnlockCharge,
        streak: this.hitStreak,
        multiplier: this.feverActive ? GUITARRERO_FEVER_CONFIG.scoreMultiplier : 1
      },
      feedback: activeFeedback,
      visibleNotes,
      pressedLanes,
      isPaused: false
    };
  }

  buildResults(): GuitarreroResultState {
    const totalNotes = this.notes.length || 1;
    const weightedHits = this.counts.perfect + this.counts.good * 0.6;

    return {
      song: this.song,
      score: this.score,
      maxCombo: this.maxCombo,
      hits: this.counts.perfect + this.counts.good,
      misses: this.counts.miss,
      counts: { ...this.counts },
      accuracy: weightedHits / totalNotes,
      mood: this.resolveMood()
    };
  }

  isFinished(): boolean {
    return this.finished;
  }

  private resolveMissedNotes(): void {
    for (const note of this.notes) {
      if (note.judgement !== null) {
        continue;
      }

      if (this.elapsedMs - note.timeMs > GUITARRERO_TIMING_WINDOWS.missMs) {
        this.resolveNote(note, 'miss', null);
      }
    }
  }

  private resolveNote(
    note: GuitarreroRuntimeNote,
    judgement: GuitarreroJudgement,
    deltaMs: number | null
  ): void {
    note.judgement = judgement;
    note.resolvedAtMs = this.elapsedMs;
    note.deltaMs = deltaMs;

    this.counts[judgement] += 1;
    this.feedback = {
      judgement,
      lane: note.lane,
      timeMs: this.elapsedMs,
      expiresAtMs: this.elapsedMs + GUITARRERO_TIMING_WINDOWS.feedbackMs
    };
    this.pendingEvents.push({
      judgement,
      lane: note.lane,
      timeMs: this.elapsedMs
    });

    this.recentJudgements.push(judgement);

    if (this.recentJudgements.length > 8) {
      this.recentJudgements.shift();
    }

    if (judgement === 'miss') {
      this.combo = 0;
      this.hitStreak = 0;
      return;
    }

    this.hitStreak += 1;
    this.score +=
      JUDGEMENT_SCORES[judgement] *
      (this.feverActive ? GUITARRERO_FEVER_CONFIG.scoreMultiplier : 1);
    this.combo += 1;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.updateFeverCharge();
  }

  private updateFever(deltaMs: number): void {
    if (!this.feverActive) {
      return;
    }

    this.feverCharge = Math.max(
      0,
      this.feverCharge - deltaMs / GUITARRERO_FEVER_CONFIG.drainDurationMs
    );

    if (this.feverCharge === 0) {
      this.feverActive = false;
    }
  }

  private updateFeverCharge(): void {
    if (this.feverActive) {
      return;
    }

    if (this.hitStreak <= GUITARRERO_FEVER_CONFIG.comboToUnlockCharge) {
      return;
    }

    this.feverCharge = Math.min(
      1,
      this.feverCharge + 1 / GUITARRERO_FEVER_CONFIG.hitsToFill
    );

    if (this.feverCharge >= 1) {
      this.feverCharge = 1;
      this.feverActive = true;
    }
  }

  private resolveMood(): GuitarreroPlayerMood {
    if (!this.recentJudgements.length) {
      return 'mas-o-menos';
    }

    const average =
      this.recentJudgements.reduce((total, current) => total + MOOD_WEIGHTS[current], 0) /
      this.recentJudgements.length;

    if (average >= 0.82 || (this.combo >= 12 && average >= 0.68)) {
      return 'voy-bien';
    }

    if (average >= 0.42) {
      return 'mas-o-menos';
    }

    return 'voy-mal';
  }
}
