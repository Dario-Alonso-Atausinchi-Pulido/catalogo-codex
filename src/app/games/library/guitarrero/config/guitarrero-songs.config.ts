import { GuitarreroLane, GuitarreroSong } from '../models/guitarrero-song.model';

const AUDIO_BASE_PATH = 'assets/games/guitarrero/audio';
const ALBUM_BASE_PATH = 'assets/games/guitarrero/albums';
const SONG_LEAD_IN_MS = 1800;
const SONG_OUTRO_MS = 1600;

interface BeatNoteBlueprint {
  beat: number;
  lane: GuitarreroLane;
}

interface SongBlueprint {
  id: string;
  title: string;
  preview: string;
  difficultyLabel: string;
  accentColor: string;
  audioFile: string;
  albumArtFile: string;
  audioDurationMs: number;
  bpm: number;
  finalBeat: number;
  notes: ReadonlyArray<BeatNoteBlueprint>;
}

function beatToMs(beat: number, bpm: number): number {
  return Math.round((60000 / bpm) * beat);
}

function durationMsToBeats(durationMs: number, bpm: number): number {
  return (durationMs / 60000) * bpm;
}

function run(startBeat: number, lanes: ReadonlyArray<GuitarreroLane>, step = 0.5): BeatNoteBlueprint[] {
  return lanes.map((lane, index) => ({
    beat: startBeat + index * step,
    lane
  }));
}

function note(beat: number, lane: GuitarreroLane): BeatNoteBlueprint {
  return { beat, lane };
}

function extendChart(
  notes: ReadonlyArray<BeatNoteBlueprint>,
  baseFinalBeat: number,
  targetFinalBeat: number
): BeatNoteBlueprint[] {
  const loops = Math.max(1, Math.ceil(targetFinalBeat / baseFinalBeat));
  const chart: BeatNoteBlueprint[] = [];

  for (let loop = 0; loop < loops; loop += 1) {
    const beatOffset = loop * baseFinalBeat;

    for (const current of notes) {
      const beat = current.beat + beatOffset;

      if (beat > targetFinalBeat) {
        continue;
      }

      chart.push({
        beat,
        lane: current.lane
      });
    }
  }

  return chart;
}

function createSong(blueprint: SongBlueprint): GuitarreroSong {
  const playableDurationMs = Math.max(
    blueprint.audioDurationMs - SONG_LEAD_IN_MS - SONG_OUTRO_MS,
    1000
  );
  const targetFinalBeat = Math.max(
    blueprint.finalBeat,
    durationMsToBeats(playableDurationMs, blueprint.bpm)
  );
  const chart = extendChart(blueprint.notes, blueprint.finalBeat, targetFinalBeat);

  return {
    id: blueprint.id,
    title: blueprint.title,
    preview: blueprint.preview,
    difficultyLabel: blueprint.difficultyLabel,
    accentColor: blueprint.accentColor,
    albumArtSrc: `${ALBUM_BASE_PATH}/${blueprint.albumArtFile}`,
    audioSrc: `${AUDIO_BASE_PATH}/${blueprint.audioFile}`,
    bpm: blueprint.bpm,
    durationMs: blueprint.audioDurationMs,
    notes: chart.map((current) => ({
      lane: current.lane,
      timeMs: SONG_LEAD_IN_MS + beatToMs(current.beat, blueprint.bpm)
    }))
  };
}

export const GUITARRERO_SONGS: ReadonlyArray<GuitarreroSong> = [
  createSong({
    id: 'piedra-lunar',
    title: 'Piedra Lunar',
    preview: 'Riff denso para arrancar firme.',
    difficultyLabel: 'Calentar manos',
    accentColor: '#ffd166',
    albumArtFile: 'piedra-lunar.svg',
    audioFile: 'piedra-lunar.mp3',
    audioDurationMs: 127000,
    bpm: 112,
    finalBeat: 48,
    notes: [
      ...run(4, [0, 1, 2, 3], 1),
      ...run(8, [0, 0, 1, 2, 1, 3, 2, 3], 0.5),
      ...run(13, [3, 2, 1, 0, 1, 2, 3, 2], 0.5),
      ...run(18, [0, 2, 1, 3, 0, 2, 1, 3], 0.75),
      ...run(26, [0, 1, 0, 2, 1, 3, 2, 3], 0.5),
      ...run(31, [3, 2, 3, 1, 2, 0, 1, 0], 0.5),
      ...run(36, [0, 1, 2, 1, 3, 2, 3, 1], 0.5),
      ...run(41, [0, 2, 3, 1, 2, 0, 3, 1], 0.5),
      note(46, 0),
      note(46.5, 1),
      note(47, 2),
      note(47.5, 3)
    ]
  }),
  createSong({
    id: 'cobre-y-neon',
    title: 'Cobre y Neón',
    preview: 'Sube la mano derecha y castiga más.',
    difficultyLabel: 'Pulso medio',
    accentColor: '#ff5c8a',
    albumArtFile: 'cobre-y-neon.svg',
    audioFile: 'cobre-y-neon.mp3',
    audioDurationMs: 150000,
    bpm: 126,
    finalBeat: 56,
    notes: [
      ...run(4, [0, 1, 2, 3, 2, 1, 0, 1], 0.5),
      ...run(9, [2, 3, 2, 1, 0, 1, 2, 3], 0.5),
      ...run(14, [0, 2, 3, 2, 1, 3, 0, 1], 0.5),
      ...run(19, [1, 0, 1, 2, 3, 1, 2, 3], 0.5),
      ...run(24, [0, 3, 2, 1, 2, 3, 1, 0], 0.5),
      ...run(29, [0, 1, 3, 2, 3, 1, 2, 0], 0.5),
      ...run(34, [1, 2, 1, 3, 2, 0, 1, 3], 0.5),
      ...run(39, [3, 2, 0, 1, 2, 3, 1, 0], 0.5),
      ...run(44, [0, 2, 0, 3, 1, 3, 2, 1], 0.5),
      ...run(49, [3, 1, 2, 0, 1, 3, 2, 0], 0.5),
      note(54, 0),
      note(54.5, 2),
      note(55, 1),
      note(55.5, 3)
    ]
  }),
  createSong({
    id: 'metal-de-barrio',
    title: 'Metal de Barrio',
    preview: 'Más velocidad, menos perdón.',
    difficultyLabel: 'Apretar dientes',
    accentColor: '#5cf4ff',
    albumArtFile: 'metal-de-barrio.svg',
    audioFile: 'metal-de-barrio.mp3',
    audioDurationMs: 158000,
    bpm: 142,
    finalBeat: 64,
    notes: [
      ...run(4, [0, 1, 2, 3, 1, 2, 0, 3], 0.5),
      ...run(8.5, [3, 2, 1, 0, 2, 3, 1, 0], 0.5),
      ...run(13, [0, 2, 1, 3, 0, 1, 2, 3], 0.5),
      ...run(17.5, [1, 3, 2, 0, 1, 2, 3, 0], 0.5),
      ...run(22, [0, 1, 3, 2, 3, 1, 2, 0], 0.5),
      ...run(26.5, [2, 0, 1, 3, 2, 3, 1, 0], 0.5),
      ...run(31, [0, 2, 3, 1, 0, 1, 3, 2], 0.5),
      ...run(35.5, [3, 1, 0, 2, 1, 3, 2, 0], 0.5),
      ...run(40, [0, 1, 2, 1, 3, 2, 0, 3], 0.5),
      ...run(44.5, [3, 2, 1, 0, 1, 2, 3, 1], 0.5),
      ...run(49, [0, 3, 1, 2, 0, 2, 3, 1], 0.5),
      ...run(53.5, [1, 0, 2, 3, 1, 3, 0, 2], 0.5),
      ...run(58, [0, 1, 2, 3], 0.5),
      note(61, 3),
      note(61.5, 2),
      note(62, 1),
      note(62.5, 0),
      note(63, 2),
      note(63.5, 3)
    ]
  })
];
