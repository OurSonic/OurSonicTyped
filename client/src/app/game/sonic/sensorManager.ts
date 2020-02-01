import {RotationMode} from '../../common/enums';
import {Help} from '../../common/help';
import {Solidity} from '../../slData';
import {SonicManager} from '../sonicManager';
import {Sonic} from './sonic';

export class SensorManager {
  constructor(private sonicManager: SonicManager) {}

  getHorizontal(side: 'left' | 'right', x: number, y: number, mode: RotationMode) {
    const allowTopSolid = false; /*todo*/

    let minSolidity = 0;
    if (!allowTopSolid) {
      minSolidity = 1;
    }

    if ((mode as any) !== RotationMode.floor) {
      return null;
    }

    const levelWidth = this.sonicManager.sonicLevel.levelWidth * 128;
    switch (mode) {
      case RotationMode.floor:
        x += side === 'left' ? -12 : 13;
        break;
      case RotationMode.rightWall:
        y += side === 'left' ? -12 : 13;
        break;
      case RotationMode.ceiling:
        x -= side === 'left' ? -12 : 13;
        break;
      case RotationMode.leftWall:
        y -= side === 'left' ? -12 : 13;
        break;
    }

    if (x <= 0) {
      return 0;
    }
    if (x >= levelWidth) {
      return 0;
    }

    const tilePieceResult = this.sonicManager.sonicLevel.getTilePieceAt(x, y);
    if (!tilePieceResult) return null;

    const {
      solidity,
      collisionMap,
      interTileX,
      interTileY,
      tileAngle,
      tileLeftEdge,
      tileRightEdge,
      tileTopEdge,
      tileBottomEdge
    } = tilePieceResult;

    if (solidity > minSolidity && collisionMap[interTileX + interTileY * 16]) {
      switch (mode) {
        case RotationMode.floor:
          return side === 'left' ? tileRightEdge + 12 : tileLeftEdge - 13;
        case RotationMode.rightWall:
          return side === 'left' ? tileTopEdge - 13 : tileBottomEdge + 12;
        case RotationMode.ceiling:
          return side === 'left' ? tileLeftEdge - 13 : tileRightEdge + 12;
        case RotationMode.leftWall:
          return side === 'left' ? tileTopEdge + 12 : tileBottomEdge - 13;
      }
    }

    return null;
  }

  getFloor(side: 'left' | 'right', x: number, y: number, mode: RotationMode, doubleCheck = false): SensorResult {
    const allowTopSolid = true; /*todo*/

    let minSolidity = 0;
    if (!allowTopSolid) {
      minSolidity = 1;
    }

    const bodyWidthRadius = 9;
    const bodyWidthRadiusRight = 10;
    const bodyHeightRadius = 19;

    let testX = x;
    let testY = y;

    let extensionX = 0;
    let extensionY = 0;

    switch (mode) {
      case RotationMode.floor:
        testX += side === 'left' ? -bodyWidthRadius : bodyWidthRadiusRight;
        testY += bodyHeightRadius;
        extensionX = 0;
        extensionY = 16;
        break;
      case RotationMode.rightWall:
        testX += bodyHeightRadius;
        testY += side === 'left' ? bodyWidthRadiusRight : -bodyWidthRadius;
        extensionX = 16;
        extensionY = 0;
        break;
      case RotationMode.ceiling:
        testX += side === 'left' ? bodyWidthRadiusRight : -bodyWidthRadius;
        testY -= bodyHeightRadius;
        extensionX = 0;
        extensionY = -16;
        break;
      case RotationMode.leftWall:
        testX -= bodyHeightRadius;
        testY += side === 'left' ? -bodyWidthRadius : bodyWidthRadiusRight;
        extensionX = -16;
        extensionY = 0;
        break;
    }

    const tilePieceResult = this.sonicManager.sonicLevel.getTilePieceAt(testX, testY);
    if (!tilePieceResult) return null;

    const {
      solidity,
      collisionMap,
      interTileX,
      interTileY,
      tileAngle,
      tileLeftEdge,
      tileRightEdge,
      tileTopEdge,
      tileBottomEdge,
      heightMapValues
    } = tilePieceResult;

    if (solidity === Solidity.NotSolid && !doubleCheck) {
      console.log('extend', side);
      const floor = this.getFloor(side, x + extensionX, y + extensionY, mode, true);
      if (floor) return floor;
    }

    if (solidity === Solidity.AllSolid && !doubleCheck) {
      console.log('regress', side);
      const floor = this.getFloor(side, x - extensionX, y - extensionY, mode, true);
      if (floor) return floor;
    }

    console.log(side, heightMapValues[interTileX], solidity, minSolidity);
    if (solidity > minSolidity) {
      switch (mode) {
        case RotationMode.floor:
          return {
            solidity,
            letter: side === 'left' ? 'a' : 'b',
            chosen: false,
            angle: tileAngle,
            value: tileBottomEdge - heightMapValues[interTileX] - bodyHeightRadius
          };
        case RotationMode.rightWall:
          debugger;
          return {
            solidity,
            letter: side === 'left' ? 'a' : 'b',
            chosen: false,
            angle: tileAngle,
            value: tileRightEdge - heightMapValues[interTileX] - bodyHeightRadius
          };
        case RotationMode.ceiling:
          return {
            solidity,
            letter: side === 'left' ? 'a' : 'b',
            chosen: false,
            angle: tileAngle,
            value: tileTopEdge + heightMapValues[interTileX] + bodyHeightRadius
          };
        case RotationMode.leftWall:
          return {
            solidity,
            letter: side === 'left' ? 'a' : 'b',
            chosen: false,
            angle: tileAngle,
            value: tileLeftEdge + heightMapValues[interTileX] + bodyHeightRadius
          };
      }
    }

    return null;
  }
}

type SensorLetters = 'a' | 'b' | 'c' | 'd' | 'm1' | 'm2';

export class Sensor {
  private cachedSensorResult: SensorResult = new SensorResult(0, 0);

  constructor(
    private sonicManager: SonicManager,
    public x1: number,
    public x2: number,
    public y1: number,
    public y2: number,
    public color: string,
    public letter: SensorLetters
  ) {}

  private checkCollisionLineWrap(
    startX: number,
    endX: number,
    startY: number,
    endY: number,
    allowTopSolid: boolean
  ): SensorResult {
    const xIncrease = startX === endX ? 0 : startX > endX ? -1 : 1;
    const yIncrease = startY === endY ? 0 : startY > endY ? -1 : 1;

    let minSolidity = 0;
    if (!allowTopSolid) {
      minSolidity = 1;
    }

    let oneTryX = startX === endX;
    const levelWidth = this.sonicManager.sonicLevel.levelWidth * 128;

    for (let testX = startX; oneTryX || Math.abs(testX - endX) !== 0; testX += xIncrease) {
      oneTryX = false;
      if (testX === 0) {
        this.cachedSensorResult.value = 0;
        this.cachedSensorResult.angle = 0;
        this.cachedSensorResult.solidity = Solidity.AllSolid;
        return this.cachedSensorResult;
      }
      if (testX === levelWidth) {
        this.cachedSensorResult.value = 0;
        this.cachedSensorResult.angle = 0;
        this.cachedSensorResult.solidity = Solidity.AllSolid;
        return this.cachedSensorResult;
      }

      let oneTryY = startY === endY;
      for (let testY = startY; oneTryY || Math.abs(testY - endY) !== 0; testY += yIncrease) {
        oneTryY = false;

        const tileChunkX = (testX / 128) | 0;
        const tileChunkY = (Help.mod(testY, this.sonicManager.sonicLevel.levelHeight * 128) / 128) | 0;

        const chunk = this.sonicManager.sonicLevel.getChunkAt(tileChunkX, tileChunkY);
        if (!chunk) {
          continue;
        }

        const interChunkX = testX - tileChunkX * 128;
        const interChunkY = testY - tileChunkY * 128;

        const tileX = (interChunkX / 16) | 0;
        const tileY = (interChunkY / 16) | 0;

        const interTileX = interChunkX - tileX * 16;
        const interTileY = interChunkY - tileY * 16;

        const tilePiece = chunk.getTilePieceAt(tileX, tileY, false);
        if (!tilePiece) {
          continue;
        }
        const tilePieceInfo = chunk.getTilePieceInfo(tileX, tileY, false);
        const solidity = this.sonicManager.sonicLevel.curHeightMap ? tilePieceInfo.solid1 : tilePieceInfo.solid2;

        const heightMap = this.sonicManager.sonicLevel.curHeightMap
          ? tilePiece.getLayer1HeightMap()
          : tilePiece.getLayer2HeightMap();
        let tileAngle = this.sonicManager.sonicLevel.curHeightMap
          ? tilePiece.getLayer1Angle()
          : tilePiece.getLayer2Angle();

        if (tilePieceInfo.xFlip) {
          if (tilePieceInfo.yFlip) {
            tileAngle = 192 - tileAngle + 192;
            tileAngle = 128 - tileAngle + 128;
          } else {
            tileAngle = 128 - tileAngle + 128;
          }
        } else {
          if (tilePieceInfo.yFlip) {
            tileAngle = 192 - tileAngle + 192;
          } else {
            tileAngle = tileAngle;
          }
        }

        let collisionMap: boolean[];
        if (tilePieceInfo.xFlip) {
          if (tilePieceInfo.yFlip) {
            collisionMap = heightMap.collisionBlockXFlipYFlip;
          } else {
            collisionMap = heightMap.collisionBlockXFlip;
          }
        } else {
          if (tilePieceInfo.yFlip) {
            collisionMap = heightMap.collisionBlockYFlip;
          } else {
            collisionMap = heightMap.collisionBlock;
          }
        }

        if (solidity > minSolidity && collisionMap[interTileX + interTileY * 16]) {
          this.cachedSensorResult.value = startY === endY ? testX : testY;
          this.cachedSensorResult.angle = tileAngle;
          this.cachedSensorResult.solidity = solidity;

          return this.cachedSensorResult;
        }
      }
    }
    return null;
  }
  private checkMSensors(x: number, y: number, allowTopSolid: boolean, regression: boolean = false): SensorResult {
    let minSolidity = 0;
    if (!allowTopSolid) {
      minSolidity = 1;
    }

    const levelWidth = this.sonicManager.sonicLevel.levelWidth * 128;

    if (x <= 0) {
      this.cachedSensorResult.value = 0;
      this.cachedSensorResult.angle = 0;
      this.cachedSensorResult.solidity = Solidity.AllSolid;
      return this.cachedSensorResult;
    }
    if (x >= levelWidth) {
      this.cachedSensorResult.value = 0;
      this.cachedSensorResult.angle = 0;
      this.cachedSensorResult.solidity = Solidity.AllSolid;
      return this.cachedSensorResult;
    }

    const tilePieceResult = this.sonicManager.sonicLevel.getTilePieceAt(x, y);
    if (!tilePieceResult) return null;

    const {solidity, collisionMap, interTileX, interTileY, tileAngle, tileLeftEdge, tileRightEdge} = tilePieceResult;

    if (solidity > minSolidity && collisionMap[interTileX + interTileY * 16]) {
      this.cachedSensorResult.value = this.letter === 'm1' ? tileRightEdge : tileLeftEdge;
      this.cachedSensorResult.angle = tileAngle;
      this.cachedSensorResult.solidity = solidity;

      return this.cachedSensorResult;
    }

    return null;
  }

  draw(canvas: CanvasRenderingContext2D, character: Sonic, sensorResult: SensorResult): void {
    const x = Help.floor(character.x) - this.sonicManager.windowLocation.x;
    const y = Help.floor(character.y) - this.sonicManager.windowLocation.y;
    canvas.beginPath();
    if (sensorResult && sensorResult.chosen) {
      canvas.strokeStyle = '#FFF76D';
      canvas.lineWidth = 4;
    } else {
      canvas.strokeStyle = this.color;
      canvas.lineWidth = 2;
    }
    switch (character.mode) {
      case RotationMode.floor:
        canvas.moveTo(x + this.x1, y + this.y1);
        canvas.lineTo(x + this.x2, y + this.y2);
        break;
      case RotationMode.leftWall:
        canvas.moveTo(x - this.y1, y + this.x1);
        canvas.lineTo(x - this.y2, y + this.x2);
        break;
      case RotationMode.ceiling:
        canvas.moveTo(x - this.x1, y - this.y1);
        canvas.lineTo(x - this.x2, y - this.y2);
        break;
      case RotationMode.rightWall:
        canvas.moveTo(x + this.y1, y - this.x1);
        canvas.lineTo(x + this.y2, y - this.x2);
        break;
    }
    canvas.closePath();
    canvas.stroke();
  }

  check(sonic: Sonic): SensorResult {
    const _y2 = sonic.inAir ? this.y2 : this.y2;
    let sensor: SensorResult = null;
    const x = Help.floor(sonic.x);
    const y = Help.floor(sonic.y);
    let allowTopSolid = true;

    switch (sonic.mode) {
      case RotationMode.floor:
        switch (this.letter) {
          case 'a':
          case 'b':
            if (sonic.inAir && sonic.ysp < 0) {
              allowTopSolid = false;
            }
            sensor = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + _y2, allowTopSolid);
            break;
          case 'c':
          case 'd':
            allowTopSolid = false;
            sensor = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + _y2, allowTopSolid);
            break;
          case 'm1':
          case 'm2':
            if (sonic.inAir) {
              allowTopSolid = false;
            }
            sensor = this.checkMSensors(x + this.x2, y, !sonic.inAir);
            break;
        }

        break;
      case RotationMode.leftWall:
        switch (this.letter) {
          case 'a':
          case 'b':
            if (sonic.ysp < 0) {
              allowTopSolid = false;
            }
            break;
          case 'c':
          case 'd':
            allowTopSolid = false;
            break;
          case 'm1':
            allowTopSolid = false;
            break;
          case 'm2':
            if (sonic.ysp < 0) {
              allowTopSolid = false;
            }
            break;
        }
        sensor = this.checkCollisionLineWrap(x - this.y1, x - _y2, y + this.x1, y + this.x2, allowTopSolid);
        break;
      case RotationMode.ceiling:
        sensor = this.checkCollisionLineWrap(x - this.x1, x - this.x2, y - this.y1, y - _y2, allowTopSolid);
        break;
      case RotationMode.rightWall:
        switch (this.letter) {
          case 'a':
          case 'b':
            if (sonic.ysp < 0) {
              allowTopSolid = false;
            }
            break;
          case 'c':
          case 'd':
            allowTopSolid = false;
            break;
          case 'm1':
            if (sonic.ysp < 0) {
              allowTopSolid = false;
            }
            break;
          case 'm2':
            allowTopSolid = false;
            break;
        }
        sensor = this.checkCollisionLineWrap(x + this.y1, x + _y2, y - this.x1, y - this.x2, allowTopSolid);
        break;
    }
    if (sensor != null) {
      sensor.letter = this.letter;
      /*
      if (sensor.angle === 255 || sensor.angle === 0 || sensor.angle === 1) {
        switch (sonic.mode) {
          case RotationMode.floor:
            sensor.angle = 255;
            break;
          case RotationMode.leftWall:
            sensor.angle = 64;
            break;
          case RotationMode.ceiling:
            sensor.angle = 128;
            break;
          case RotationMode.rightWall:
            sensor.angle = 192;
            break;
        }
      }
*/

      if (sonic.mode === RotationMode.floor) {
        switch (this.letter) {
          case 'c':
          case 'd':
            if (sensor.angle < 160) {
              sensor.angle = 0;
            }
            break;
          case 'm1':
          case 'm2':
            if (sensor.angle < 160) {
              sensor.angle = 0;
            }
            break;
        }
      }
    }
    return sensor;
  }
}

export class SensorResult {
  value: number = 0;
  angle: number = 0;
  letter: string;
  chosen: boolean = false;
  solidity: Solidity = 0;

  constructor(value: number, angle: number) {
    this.value = value;
    this.angle = angle;
  }
}

export class OldSensorManager {
  protected sensors: {[sensorKey: string]: Sensor};

  sensorResults: {[sensorKey: string]: SensorResult};

  constructor(private sonicManager: SonicManager) {
    this.sensors = {};
    this.sensorResults = {};
  }

  addSensor(letter: string, sensor: Sensor): Sensor {
    this.sensors[letter] = sensor;
    this.sensorResults[letter] = null;
    return sensor;
  }

  createVerticalSensor(letter: SensorLetters, x: number, y1: number, y2: number, color: string): Sensor {
    return this.addSensor(letter, new Sensor(this.sonicManager, x, x, y1, y2, color, letter));
  }

  createHorizontalSensor(letter: SensorLetters, y: number, x1: number, x2: number, color: string): Sensor {
    return this.addSensor(letter, new Sensor(this.sonicManager, x1, x2, y, y, color, letter));
  }

  check(character: Sonic): boolean {
    let none = false;
    for (const sensorKey in this.sensors) {
      this.sensorResults[sensorKey] = this.sensors[sensorKey].check(character);
      none = none || this.sensorResults[sensorKey] != null;
    }
    return none;
  }

  getResult(mn: string): SensorResult {
    return this.sensorResults[mn];
  }

  draw(canvas: CanvasRenderingContext2D, sonic: Sonic): void {
    for (const sensor in this.sensors) {
      this.sensors[sensor].draw(canvas, sonic, this.sensorResults[sensor]);
    }
  }
}
