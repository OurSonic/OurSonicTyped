import {RotationMode} from '../../common/enums';
import {Help} from '../../common/help';
import {Point} from '../../common/utils';
import {SonicEngine} from '../sonicEngine';
import {SonicLevel} from '../sonicLevel';
import {SonicManager} from '../sonicManager';
import {SensorResult, SensorManager, OldSensorManager} from './sensorManager';

export class PositionTestSonic {
  x = 0;
  y = 0;
  angle = 0;
  mode = RotationMode.floor;
  facing = false;
  spriteState: string;
  private sensorManager: SensorManager;
  private inAir: boolean;

  constructor(private sonicManager: SonicManager) {
    this.x = 0;
    this.y = 0;
    this.sensorManager = new SensorManager(sonicManager);
    this.spriteState = 'normal';
  }

  updateMode(): void {
    if (this.angle <= 0x22 || this.angle >= 0xe0) {
      this.mode = RotationMode.floor;
    } else if (this.angle > 0x22 && this.angle < 0x59) {
      this.mode = RotationMode.leftWall;
    } else if (this.angle >= 0x59 && this.angle < 0xa1) {
      this.mode = RotationMode.ceiling;
    } else if (this.angle > 0xa1 && this.angle < 0xe0) {
      this.mode = RotationMode.rightWall;
    }
  }

  tick(): void {
    this.updateMode();
    this.updateSprite();
    const left = this.sensorManager.getHorizontal('left', this.x, this.y, this.mode);
    const right = this.sensorManager.getHorizontal('right', this.x, this.y, this.mode);
    const bestHorizontal = left ?? right;
    if (bestHorizontal !== null) {
      switch (this.mode) {
        case RotationMode.floor:
          this.x = bestHorizontal;
          break;
        case RotationMode.leftWall:
          this.y = bestHorizontal;
          break;
        case RotationMode.ceiling:
          this.x = bestHorizontal;
          break;
        case RotationMode.rightWall:
          this.y = bestHorizontal;
          break;
      }
    }

    const sensorA = this.sensorManager.getFloor('left', this.x, this.y, this.mode, false);
    const sensorB = this.sensorManager.getFloor('right', this.x, this.y, this.mode, false);
    const best = this.getBestSensor(sensorA, sensorB, this.mode);
    this.inAir = false;
    if (best === null) {
      this.inAir = true;
    } else {
      console.log(best.letter);
      switch (this.mode) {
        case RotationMode.floor:
          best.chosen = true;
          this.angle = best.angle;
          this.y = best.value;
          break;
        case RotationMode.leftWall:
          best.chosen = true;
          this.angle = best.angle;
          this.x = best.value;
          break;
        case RotationMode.ceiling:
          best.chosen = true;
          this.angle = best.angle;
          this.y = best.value;
          break;
        case RotationMode.rightWall:
          best.chosen = true;
          this.angle = best.angle;
          this.x = best.value;
          break;
      }
    }
    this.updateMode();
  }

  private getBestSensor(sensor1: SensorResult, sensor2: SensorResult, mode: RotationMode): SensorResult {
    if (sensor1 === null && sensor2 === null) {
      return null;
    }
    if (sensor1 === null) {
      return sensor2;
    }
    if (sensor2 === null) {
      return sensor1;
    }
    switch (mode) {
      case RotationMode.floor:
        return sensor1.value < sensor2.value ? sensor1 : sensor2;
      case RotationMode.leftWall:
        return sensor1.value > sensor2.value ? sensor1 : sensor2;
      case RotationMode.ceiling:
        return sensor1.value > sensor2.value ? sensor1 : sensor2;
      case RotationMode.rightWall:
        return sensor1.value < sensor2.value ? sensor1 : sensor2;
    }
    return null;
  }

  private offsetFromImage: Point = new Point(0, 0);

  private getOffsetFromImage(): Point {
    const cur = SonicEngine.instance.spriteCache.sonicSprites[this.spriteState];
    let xOffset = 0;
    let yOffset = 0;
    if (cur.height !== 40) {
      let n: number;
      switch (this.mode) {
        case RotationMode.floor:
          n = 0;
          yOffset = (40 - (cur.height + n)) / 2;
          break;
        case RotationMode.leftWall:
          n = 15;
          xOffset = -(40 - (cur.height + n)) / 2;
          break;
        case RotationMode.ceiling:
          n = 8;
          yOffset = -(40 - (cur.height + n)) / 2;
          break;
        case RotationMode.rightWall:
          n = 9;
          xOffset = (40 - (cur.height + n)) / 2;
          break;
      }
    }
    this.offsetFromImage.x = xOffset;
    this.offsetFromImage.y = yOffset;
    return this.offsetFromImage;
  }

  private updateSprite(): void {
    this.spriteState = 'fastrunning0';
  }

  draw(context: CanvasRenderingContext2D): void {
    const fx = this.x | 0;
    const fy = this.y | 0;
    const cur = SonicEngine.instance.spriteCache.sonicSprites[this.spriteState];
    if (Help.isLoaded(cur)) {
      context.save();
      const offset = this.getOffsetFromImage();
      context.translate(
        fx - this.sonicManager.windowLocation.x + offset.x,
        fy - this.sonicManager.windowLocation.y + offset.y
      );
      context.rotate(Help.fixAngle(this.angle));
      let offsetX = 0;
      if (this.spriteState === 'duck0') {
        offsetX = 6;
      } else if (this.spriteState === 'duck1') {
        offsetX = 6;
      }
      if (this.spriteState === 'lookingup0') {
        offsetX = -1;
      } else if (this.spriteState === 'lookingup1') {
        offsetX = -3;
      }

      if (this.inAir) {
        context.globalAlpha = 0.1;
      }
      context.drawImage(cur, -cur.width / 2 + offsetX, -cur.height / 2);
      context.restore();
    }
  }
}
