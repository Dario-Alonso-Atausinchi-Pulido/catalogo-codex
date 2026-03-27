import {
  GUITARRERO_LANE_COLORS,
  GUITARRERO_LANE_COUNT,
  GUITARRERO_LANE_KEYS,
  GUITARRERO_STAGE_CONFIG,
  GUITARRERO_TIMING_WINDOWS
} from '../config/guitarrero-stage.config';
import { GuitarreroSceneSnapshot } from '../models/guitarrero-runtime-state.model';

export class GuitarreroRendererScene {
  render(context: CanvasRenderingContext2D, snapshot: GuitarreroSceneSnapshot): void {
    const { width, height } = GUITARRERO_STAGE_CONFIG;
    const laneGap = 16;
    const playfield = {
      x: 262,
      y: 104,
      width: 756,
      height: 540
    };
    const laneWidth = (playfield.width - laneGap * (GUITARRERO_LANE_COUNT - 1)) / GUITARRERO_LANE_COUNT;
    const impactLineY = 590;
    const progressBar = {
      x: 84,
      y: 28,
      width: 1112,
      height: 42
    };
    const feverMeter = {
      x: 154,
      y: 178,
      width: 58,
      height: 312
    };

    context.clearRect(0, 0, width, height);

    const backgroundGradient = context.createLinearGradient(0, 0, 0, height);
    backgroundGradient.addColorStop(0, '#13071b');
    backgroundGradient.addColorStop(0.46, '#081223');
    backgroundGradient.addColorStop(1, '#02040a');
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, width, height);

    this.drawAmbientGlow(context, snapshot, width, height);
    this.drawSpeakerStacks(context, snapshot, width, height);
    this.drawTopProgressBar(context, snapshot, progressBar);
    this.drawPlayfieldShell(context, snapshot, playfield);
    this.drawFeverMeter(context, snapshot, feverMeter);

    for (let lane = 0; lane < GUITARRERO_LANE_COUNT; lane += 1) {
      const x = playfield.x + lane * (laneWidth + laneGap);
      const lanePressed = snapshot.pressedLanes[lane];
      const laneGradient = context.createLinearGradient(0, playfield.y, 0, playfield.y + playfield.height);
      laneGradient.addColorStop(0, lanePressed ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)');
      laneGradient.addColorStop(1, 'rgba(5, 10, 18, 0.9)');

      context.save();
      context.fillStyle = laneGradient;
      context.strokeStyle = snapshot.fever.active
        ? 'rgba(216, 109, 255, 0.46)'
        : lanePressed
          ? `${GUITARRERO_LANE_COLORS[lane]}dd`
          : 'rgba(115, 223, 255, 0.1)';
      context.lineWidth = lanePressed ? 3 : 1.5;
      context.beginPath();
      context.roundRect(x, playfield.y + 12, laneWidth, playfield.height - 24, 22);
      context.fill();
      context.stroke();
      context.restore();
    }

    context.save();
    context.strokeStyle = snapshot.fever.active
      ? 'rgba(226, 145, 255, 0.96)'
      : 'rgba(255, 238, 170, 0.88)';
    context.lineWidth = 6;
    context.shadowBlur = snapshot.fever.active ? 30 : 22;
    context.shadowColor = snapshot.fever.active
      ? 'rgba(216, 109, 255, 0.68)'
      : 'rgba(255, 206, 96, 0.58)';
    context.beginPath();
    context.moveTo(playfield.x + 14, impactLineY);
    context.lineTo(playfield.x + playfield.width - 14, impactLineY);
    context.stroke();
    context.restore();

    for (const note of snapshot.visibleNotes) {
      const laneX = playfield.x + note.lane * (laneWidth + laneGap);
      const travelProgress = 1 - (note.timeMs - snapshot.elapsedMs) / GUITARRERO_TIMING_WINDOWS.approachMs;
      const clampedProgress = Math.min(Math.max(travelProgress, 0), 1.16);
      const y = playfield.y + 24 + clampedProgress * (impactLineY - playfield.y - 36);
      const noteColor = snapshot.fever.active ? '#d86dff' : GUITARRERO_LANE_COLORS[note.lane];
      const innerColor = snapshot.fever.active ? 'rgba(255, 225, 255, 0.38)' : 'rgba(255,255,255,0.22)';

      context.save();
      context.translate(laneX + laneWidth / 2, y);
      context.fillStyle = noteColor;
      context.shadowBlur = snapshot.fever.active ? 28 : 18;
      context.shadowColor = snapshot.fever.active ? 'rgba(216, 109, 255, 0.95)' : `${noteColor}aa`;
      context.beginPath();
      context.moveTo(0, -20);
      context.lineTo(30, 0);
      context.lineTo(0, 20);
      context.lineTo(-30, 0);
      context.closePath();
      context.fill();

      context.fillStyle = innerColor;
      context.beginPath();
      context.moveTo(0, -11);
      context.lineTo(16, 0);
      context.lineTo(0, 11);
      context.lineTo(-16, 0);
      context.closePath();
      context.fill();
      context.restore();
    }

    for (let lane = 0; lane < GUITARRERO_LANE_COUNT; lane += 1) {
      const x = playfield.x + lane * (laneWidth + laneGap);
      const lanePressed = snapshot.pressedLanes[lane];

      context.save();
      context.fillStyle = lanePressed
        ? snapshot.fever.active
          ? '#d86dff'
          : GUITARRERO_LANE_COLORS[lane]
        : 'rgba(6, 13, 25, 0.88)';
      context.strokeStyle = lanePressed
        ? '#fff0c4'
        : snapshot.fever.active
          ? 'rgba(216, 109, 255, 0.22)'
          : 'rgba(255, 255, 255, 0.12)';
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(x + 16, impactLineY + 24, laneWidth - 32, 52, 18);
      context.fill();
      context.stroke();

      context.fillStyle = lanePressed ? '#04101d' : '#fff0c4';
      context.font = '700 28px Bahnschrift';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(GUITARRERO_LANE_KEYS[lane], x + laneWidth / 2, impactLineY + 50);
      context.restore();
    }

    if (snapshot.feedback) {
      const age = snapshot.elapsedMs - snapshot.feedback.timeMs;
      const alpha = Math.max(0, 1 - age / GUITARRERO_TIMING_WINDOWS.feedbackMs);
      const label = snapshot.feedback.judgement.toUpperCase();
      const color =
        snapshot.feedback.judgement === 'perfect'
          ? '#ffe28f'
          : snapshot.feedback.judgement === 'good'
            ? '#85f8ff'
            : '#ff7d8d';

      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.shadowBlur = 18;
      context.shadowColor = color;
      context.font = '400 54px Impact';
      context.textAlign = 'center';
      context.fillText(label, width / 2, 164);
      context.restore();
    }

    if (snapshot.isPaused) {
      this.drawPauseOverlay(context, playfield);
    }
  }

  private drawTopProgressBar(
    context: CanvasRenderingContext2D,
    snapshot: GuitarreroSceneSnapshot,
    bar: { x: number; y: number; width: number; height: number }
  ): void {
    const titleWidth = 250;
    const badgeWidth = 126;
    const railX = bar.x + titleWidth;
    const railWidth = bar.width - titleWidth - badgeWidth - 26;
    const fillWidth = railWidth * snapshot.progress;

    context.save();
    context.fillStyle = 'rgba(7, 12, 22, 0.82)';
    context.strokeStyle = 'rgba(115, 223, 255, 0.16)';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(bar.x, bar.y, bar.width, bar.height, 22);
    context.fill();
    context.stroke();

    context.fillStyle = '#fff0c4';
    context.font = '400 26px Impact';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(snapshot.song.title.toUpperCase(), bar.x + 20, bar.y + 18);

    context.fillStyle = 'rgba(126, 244, 255, 0.82)';
    context.font = '600 13px Consolas';
    context.fillText(`${snapshot.song.bpm} BPM`, bar.x + 20, bar.y + 34);

    context.fillStyle = 'rgba(255,255,255,0.08)';
    context.beginPath();
    context.roundRect(railX, bar.y + 11, railWidth, 20, 999);
    context.fill();

    if (fillWidth > 0) {
      const progressFill = context.createLinearGradient(railX, 0, railX + railWidth, 0);
      progressFill.addColorStop(0, '#5cf4ff');
      progressFill.addColorStop(0.5, '#ffd166');
      progressFill.addColorStop(1, snapshot.fever.active ? '#d86dff' : '#ff5c8a');
      context.fillStyle = progressFill;
      context.shadowBlur = 18;
      context.shadowColor = snapshot.fever.active
        ? 'rgba(216, 109, 255, 0.46)'
        : 'rgba(255, 92, 138, 0.26)';
      context.beginPath();
      context.roundRect(railX, bar.y + 11, fillWidth, 20, 999);
      context.fill();

      context.beginPath();
      context.fillStyle = '#fff7dd';
      context.arc(railX + fillWidth, bar.y + 21, 4.5, 0, Math.PI * 2);
      context.fill();
    }

    context.shadowBlur = 0;
    context.fillStyle = snapshot.fever.active ? '#f0b7ff' : '#fff0c4';
    context.font = '400 24px Impact';
    context.textAlign = 'center';
    context.fillText(`${Math.round(snapshot.progress * 100)}%`, railX + railWidth + 48, bar.y + 22);

    context.fillStyle = snapshot.fever.active
      ? 'rgba(52, 8, 74, 0.94)'
      : 'rgba(7, 12, 22, 0.9)';
    context.strokeStyle = snapshot.fever.active
      ? 'rgba(216, 109, 255, 0.44)'
      : 'rgba(255,255,255,0.08)';
    context.beginPath();
    context.roundRect(bar.x + bar.width - badgeWidth - 12, bar.y + 6, badgeWidth, 30, 16);
    context.fill();
    context.stroke();

    context.fillStyle = snapshot.fever.active ? '#f3c6ff' : '#9eefff';
    context.font = '700 14px Consolas';
    context.fillText(
      snapshot.fever.active ? 'BONUS X2' : 'BONUS X1',
      bar.x + bar.width - badgeWidth / 2 - 12,
      bar.y + 22
    );
    context.restore();
  }

  private drawPlayfieldShell(
    context: CanvasRenderingContext2D,
    snapshot: GuitarreroSceneSnapshot,
    playfield: { x: number; y: number; width: number; height: number }
  ): void {
    context.save();
    context.fillStyle = 'rgba(5, 10, 19, 0.92)';
    context.strokeStyle = snapshot.fever.active
      ? 'rgba(216, 109, 255, 0.28)'
      : 'rgba(115, 223, 255, 0.18)';
    context.lineWidth = 2;
    context.shadowBlur = snapshot.fever.active ? 22 : 0;
    context.shadowColor = snapshot.fever.active ? 'rgba(216, 109, 255, 0.18)' : 'transparent';
    context.beginPath();
    context.roundRect(playfield.x - 18, playfield.y - 18, playfield.width + 36, playfield.height + 36, 28);
    context.fill();
    context.stroke();
    context.restore();
  }

  private drawFeverMeter(
    context: CanvasRenderingContext2D,
    snapshot: GuitarreroSceneSnapshot,
    meter: { x: number; y: number; width: number; height: number }
  ): void {
    const wobble = snapshot.fever.active
      ? Math.sin(snapshot.elapsedMs / 34) * 3 + Math.cos(snapshot.elapsedMs / 47) * 2
      : snapshot.fever.ready
        ? Math.sin(snapshot.elapsedMs / 120) * 1.2
        : 0;
    const innerX = meter.x + 10;
    const innerY = meter.y + 14;
    const innerWidth = meter.width - 20;
    const innerHeight = meter.height - 28;
    const chargeHeight = innerHeight * snapshot.fever.charge;
    const segmentHeight = (innerHeight - 18) / 9;

    context.save();
    context.translate(wobble, 0);
    context.fillStyle = 'rgba(7, 12, 22, 0.88)';
    context.strokeStyle = snapshot.fever.active
      ? 'rgba(216, 109, 255, 0.55)'
      : snapshot.fever.ready
        ? 'rgba(255, 209, 102, 0.36)'
        : 'rgba(115, 223, 255, 0.16)';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(meter.x, meter.y, meter.width, meter.height, 24);
    context.fill();
    context.stroke();

    context.fillStyle = 'rgba(255,255,255,0.06)';
    context.beginPath();
    context.roundRect(innerX, innerY, innerWidth, innerHeight, 16);
    context.fill();

    for (let segment = 0; segment < 9; segment += 1) {
      const segmentY = innerY + innerHeight - (segment + 1) * segmentHeight - segment * 2;
      const segmentFill = Math.min(
        Math.max(chargeHeight - (segmentHeight + 2) * segment, 0),
        segmentHeight
      );

      context.fillStyle = 'rgba(255,255,255,0.04)';
      context.beginPath();
      context.roundRect(innerX + 4, segmentY, innerWidth - 8, segmentHeight, 10);
      context.fill();

      if (segmentFill > 0) {
        const fillGradient = context.createLinearGradient(0, segmentY + segmentHeight, 0, segmentY);
        fillGradient.addColorStop(0, snapshot.fever.active ? '#7d18ff' : '#ff7e57');
        fillGradient.addColorStop(1, snapshot.fever.active ? '#ee9dff' : '#ffd166');
        context.fillStyle = fillGradient;
        context.shadowBlur = snapshot.fever.active ? 20 : 10;
        context.shadowColor = snapshot.fever.active
          ? 'rgba(216, 109, 255, 0.85)'
          : 'rgba(255, 209, 102, 0.38)';
        context.beginPath();
        context.roundRect(
          innerX + 4,
          segmentY + segmentHeight - segmentFill,
          innerWidth - 8,
          segmentFill,
          10
        );
        context.fill();
      }
    }

    context.shadowBlur = 0;
    context.fillStyle = snapshot.fever.active ? '#f5c6ff' : 'rgba(255, 240, 188, 0.78)';
    context.beginPath();
    context.moveTo(meter.x + meter.width / 2 - 8, meter.y - 20);
    context.lineTo(meter.x + meter.width / 2 + 2, meter.y - 20);
    context.lineTo(meter.x + meter.width / 2 - 5, meter.y - 4);
    context.lineTo(meter.x + meter.width / 2 + 8, meter.y - 4);
    context.lineTo(meter.x + meter.width / 2 - 6, meter.y + 18);
    context.lineTo(meter.x + meter.width / 2 - 1, meter.y + 2);
    context.lineTo(meter.x + meter.width / 2 - 12, meter.y + 2);
    context.closePath();
    context.fill();

    if (snapshot.fever.active) {
      context.strokeStyle = 'rgba(216, 109, 255, 0.72)';
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(meter.x - 12, meter.y + 28);
      context.lineTo(meter.x - 28, meter.y + 44);
      context.moveTo(meter.x - 12, meter.y + meter.height - 28);
      context.lineTo(meter.x - 28, meter.y + meter.height - 12);
      context.moveTo(meter.x + meter.width + 12, meter.y + 56);
      context.lineTo(meter.x + meter.width + 28, meter.y + 72);
      context.moveTo(meter.x + meter.width + 12, meter.y + meter.height - 56);
      context.lineTo(meter.x + meter.width + 28, meter.y + meter.height - 40);
      context.stroke();
    }

    context.restore();
  }

  private drawPauseOverlay(
    context: CanvasRenderingContext2D,
    playfield: { x: number; y: number; width: number; height: number }
  ): void {
    context.save();
    context.fillStyle = 'rgba(6, 0, 10, 0.66)';
    context.beginPath();
    context.roundRect(playfield.x - 10, playfield.y - 10, playfield.width + 20, playfield.height + 20, 28);
    context.fill();

    context.fillStyle = '#ff394f';
    context.shadowBlur = 24;
    context.shadowColor = 'rgba(255, 57, 79, 0.72)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '400 88px Impact';
    context.fillText('PAUSA', playfield.x + playfield.width / 2, playfield.y + playfield.height / 2 - 24);

    context.shadowBlur = 0;
    context.fillStyle = 'rgba(255, 216, 188, 0.92)';
    context.font = '700 18px Consolas';
    context.fillText(
      'SPACE PARA VOLVER',
      playfield.x + playfield.width / 2,
      playfield.y + playfield.height / 2 + 42
    );
    context.restore();
  }

  private drawAmbientGlow(
    context: CanvasRenderingContext2D,
    snapshot: GuitarreroSceneSnapshot,
    width: number,
    height: number
  ): void {
    const offset = Math.sin(snapshot.elapsedMs / 640) * 24;
    const glow = context.createRadialGradient(width * 0.5, 140 + offset, 30, width * 0.5, 140, 340);
    glow.addColorStop(0, snapshot.fever.active ? 'rgba(216, 109, 255, 0.32)' : 'rgba(255, 90, 150, 0.24)');
    glow.addColorStop(0.45, 'rgba(92, 244, 255, 0.12)');
    glow.addColorStop(1, 'transparent');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  private drawSpeakerStacks(
    context: CanvasRenderingContext2D,
    snapshot: GuitarreroSceneSnapshot,
    width: number,
    height: number
  ): void {
    const drawStack = (x: number): void => {
      context.save();
      context.translate(x, 164);

      for (let speaker = 0; speaker < 3; speaker += 1) {
        const y = speaker * 144;
        context.fillStyle = 'rgba(7, 14, 27, 0.86)';
        context.strokeStyle = 'rgba(255,255,255,0.07)';
        context.lineWidth = 2;
        context.beginPath();
        context.roundRect(-58, y, 116, 118, 24);
        context.fill();
        context.stroke();

        const pulse = 1 + Math.sin(snapshot.elapsedMs / 190 + speaker) * 0.08;
        context.save();
        context.translate(0, y + 59);
        context.scale(pulse, pulse);
        context.fillStyle = snapshot.fever.active
          ? 'rgba(216, 109, 255, 0.18)'
          : 'rgba(255, 233, 141, 0.13)';
        context.beginPath();
        context.arc(0, 0, 24, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.strokeStyle = snapshot.fever.active
          ? 'rgba(216, 109, 255, 0.3)'
          : 'rgba(87, 232, 255, 0.18)';
        context.lineWidth = 6;
        context.beginPath();
        context.arc(0, y + 59, 28, 0, Math.PI * 2);
        context.stroke();

        context.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        context.lineWidth = 3;
        context.beginPath();
        context.arc(0, y + 59, 13, 0, Math.PI * 2);
        context.stroke();
      }

      context.restore();
    };

    drawStack(100);
    drawStack(width - 100);

  }
}
