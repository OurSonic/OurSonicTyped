import {RotationMode} from '../../common/enums';
import {Help} from '../../common/help';
import {IntersectingRectangle, Point, Rectangle} from '../../common/utils';
import {Solidity} from '../../slData';
import {Ring} from '../level/ring';
import {SonicEngine} from '../sonicEngine';
import {SonicLevel} from '../sonicLevel';
import {SonicManager} from '../sonicManager';
import {SensorResult, SensorManager, OldSensorManager, NewSensorResult} from './sensorManager';
import {SonicConstants} from './sonicConstants';

export class Sonic {
  myRec: Rectangle;
  obtainedRing: {[key: number]: boolean} = {};
  private oldSign: number;
  private physicsVariables: SonicConstants;
  private runningTick: number;

  sonicLastHitTick: number;
  private sonicLevel: SonicLevel;

  watcher: Watcher;
  x: number = 0;
  y: number = 0;
  rings: number = 0;
  debugging: boolean = false;
  jumping: boolean = false;
  crouching: boolean = false;
  holdingLeft: boolean = false;
  holdingRight: boolean = false;
  holdingUp: boolean = false;
  xsp: number = 0;
  ysp: number = 0;
  gsp: number = 0;
  rolling: boolean = false;
  inAir: boolean = false;
  wasInAir: boolean = false;
  holdingJump: boolean = false;
  justHit: boolean = false;
  hLock: number = 0;
  mode: RotationMode = RotationMode.floor;
  facing: boolean = false;
  breaking: number = 0;
  ducking: boolean = false;
  spinDash: boolean = false;
  spinDashSpeed: number = 0;
  angle: number = 0;
  protected currentlyBall: boolean = false;
  protected spriteState: string;
  protected haltSmoke: Point[];

  wasJumping: boolean;
  private sensorManager: SensorManager;
  private oldSensorManager: OldSensorManager;

  constructor(private sonicManager: SonicManager) {
    this.watcher = new Watcher();
    this.physicsVariables = SonicConstants.sonic();
    this.sonicLevel = sonicManager.sonicLevel;
    this.x = this.sonicLevel.startPositions[0].x;
    this.y = this.sonicLevel.startPositions[0].y;
    this.sensorManager = new SensorManager(sonicManager);
    this.oldSensorManager = new OldSensorManager(sonicManager);

    this.oldSensorManager.createVerticalSensor('a', -9, 0, 36, '#F202F2');
    this.oldSensorManager.createVerticalSensor('b', 9, 0, 36, '#02C2F2');
    this.oldSensorManager.createVerticalSensor('c', -9, 0, -20, '#2D2C21');
    this.oldSensorManager.createVerticalSensor('d', 9, 0, -20, '#C24222');
    this.oldSensorManager.createHorizontalSensor('m1', 4, 0, -12, '#212C2E');
    this.oldSensorManager.createHorizontalSensor('m2', 4, 0, 13, '#22Ffc1');
    this.haltSmoke = [];
    this.rings = 7;
    this.spriteState = 'normal';
    this.myRec = new Rectangle(0, 0, 0, 0);
    this.sonicLastHitTick = -100000;
  }

  updateMode(): void {
    if (this.angle < 0x20 || this.angle >= 0xe0) {
      this.mode = RotationMode.floor;
    } else if (this.angle < 0x60 && this.angle >= 0x20) {
      this.mode = RotationMode.leftWall;
    } else if (this.angle < 0xa0 && this.angle >= 0x60) {
      this.mode = RotationMode.ceiling;
    } else if (this.angle < 0xe0 && this.angle >= 0xa0) {
      this.mode = RotationMode.rightWall;
    }

    this.myRec.x = (this.x - 10) | 0;
    this.myRec.y = (this.y - 20) | 0;
    this.myRec.width = 10 * 2;
    this.myRec.height = 20 * 2;
    if (this.inAir) {
      this.mode = RotationMode.floor;
    }
  }

  tick(sonicLevel: SonicLevel): void {
    if (this.debugging) {
      const debugSpeed = this.watcher.Multiply(16);
      if (this.holdingRight) {
        this.x += debugSpeed;
      }
      if (this.holdingLeft) {
        this.x -= debugSpeed;
      }
      if (this.crouching) {
        this.y += debugSpeed;
      }
      if (this.holdingUp) {
        this.y -= debugSpeed;
      }

      this.x = (sonicLevel.levelWidth * 128 + this.x) % (sonicLevel.levelWidth * 128);
      this.y = (sonicLevel.levelHeight * 128 + this.y) % (sonicLevel.levelHeight * 128);
      return;
    }
    // this.gsp = 4;
    this.updateMode();
    if (this.inAir) {
      console.log('air');
    }
    if (this.hLock > 0) {
      this.hLock--;
      this.holdingRight = false;
      this.holdingLeft = false;
    }
    if (this.inAir) {
      if (this.angle !== 0xff) {
        this.angle = (0xff + (this.angle + (this.angle > 0xff / 2 ? 2 : -2))) % 0xff;
        if (this.angle >= 0xfd || this.angle <= 0x01) {
          this.angle = 0xff;
        }
      }
    }
    this.effectPhysics();
    this.checkCollisionWithRings();
    this.updateSprite();
    this.checkCollisionWithObjects(this.x, this.y, 'a');
    const left = this.sensorManager.getHorizontal('left', this.x, this.y, this.mode);
    const right = this.sensorManager.getHorizontal('right', this.x, this.y, this.mode);
    const bestHorizontal = left ?? right;
    if (bestHorizontal !== null) {
      switch (this.mode) {
        case RotationMode.floor:
          this.x = bestHorizontal;
          this.gsp = 0;
          if (this.inAir) {
            this.xsp = 0;
          }
          break;
        case RotationMode.leftWall:
          this.y = bestHorizontal;
          this.gsp = 0;
          if (this.inAir) {
            this.xsp = 0;
          }
          break;
        case RotationMode.ceiling:
          this.x = bestHorizontal;
          this.gsp = 0;
          if (this.inAir) {
            this.xsp = 0;
          }
          break;
        case RotationMode.rightWall:
          this.y = bestHorizontal;
          this.gsp = 0;
          if (this.inAir) {
            this.xsp = 0;
          }
          break;
      }
    }

    if (!this.inAir || (this.inAir && (this.ysp > 0 || Math.abs(this.xsp) > Math.abs(this.ysp)))) {
      const sensorA = this.sensorManager.getFloor('left', this.x, this.y, this.mode, 'start', this.rolling, this.inAir);
      const sensorB = this.sensorManager.getFloor(
        'right',
        this.x,
        this.y,
        this.mode,
        'start',
        this.rolling,
        this.inAir
      );
      const best = this.getBestNewSensor(sensorA, sensorB, this.mode);
      if (best === null) {
        console.log('got air');
        this.inAir = true;
      } else {
        // console.log('-----');
        // sensorA && console.log(sensorA.letter, this.fixAngle(sensorA.angle), sensorA.valueX, sensorA.valueY);
        // sensorB && console.log(sensorB.letter, this.fixAngle(sensorB.angle), sensorB.valueX, sensorB.valueY);
        this.justHit = false;

        this.angle = this.fixAngle(best.angle);

        if (!this.inAir) {
          switch (this.mode) {
            case RotationMode.floor:
              // this.x = best.valueX;
              // console.log(best.letter, best.angle, best.valueY, this.y | 0, this.mode);
              this.y = best.valueY;
              break;
            case RotationMode.rightWall:
              // console.log(best.letter, best.angle, best.valueX, this.x | 0, this.mode);
              this.x = best.valueX;
              // this.y = best.valueY;
              break;
            case RotationMode.ceiling:
              // console.log(best.letter, best.angle, best.valueY, this.y | 0, this.mode);
              // this.x = best.valueX;
              this.y = best.valueY;
              break;
            case RotationMode.leftWall:
              // console.log(best.letter, best.angle, best.valueX, this.x | 0, this.mode);
              this.x = best.valueX;
              // this.y = best.valueY;
              break;
          }
        } else {
          console.log('landed');

          this.y = best.valueY;
          this.rolling = this.currentlyBall = false;
          this.inAir = false;
        }
      }
      // console.log('-----');
      this.updateMode();
    } else {
      this.oldSensorManager.check(this);
      const sensorC = this.oldSensorManager.getResult('c');
      const sensorD = this.oldSensorManager.getResult('d');
      const halfHeight = 20;
      if (sensorC == null && sensorD == null) {
      } else {
        if (sensorD != null && sensorC != null && sensorC.value >= 0 && sensorD.value >= 0) {
          if (sensorC.value < sensorD.value) {
            if (this.y + halfHeight >= sensorC.value) {
              if (this.ysp < 0) {
                if (sensorC.angle > 0x40 && sensorC.angle < 0xc0) {
                  this.angle = sensorC.angle;
                  this.gsp = this.ysp;
                  this.inAir = false;
                  this.wasInAir = false;
                } else {
                  this.ysp = 0;
                }
                this.y = sensorC.value + halfHeight;
              }
            }
          } else {
            if (this.y + halfHeight >= sensorD.value) {
              if (this.ysp < 0) {
                if (sensorD.angle > 0x40 && sensorD.angle < 0xc0) {
                  this.angle = sensorD.angle;
                  this.gsp = -this.ysp;
                  this.inAir = false;
                  this.wasInAir = false;
                } else {
                  this.ysp = 0;
                }
                this.y = sensorD.value + halfHeight;
              }
            }
          }
        } else if (sensorC != null && sensorC.value > -1) {
          if (this.y + halfHeight >= sensorC.value) {
            if (this.ysp < 0) {
              if (sensorC.angle > 0x40 && sensorC.angle < 0xc0) {
                this.angle = sensorC.angle;
                this.gsp = this.ysp;
                this.inAir = false;
                this.wasInAir = false;
              } else {
                this.ysp = 0;
              }
              this.y = sensorC.value + halfHeight;
            }
          }
        } else if (sensorD != null && sensorD.value > -1) {
          if (this.y + halfHeight >= sensorD.value) {
            if (this.ysp < 0) {
              if (sensorD.angle > 0x40 && sensorD.angle < 0xc0) {
                this.angle = sensorD.angle;
                this.gsp = -this.ysp;
                this.inAir = false;
                this.wasInAir = false;
              } else {
                this.ysp = 0;
              }
              this.y = sensorD.value + halfHeight;
            }
          }
        }
        this.updateMode();
      }
    }
  }

  private getBestNewSensor(sensor1: NewSensorResult, sensor2: NewSensorResult, mode: RotationMode): NewSensorResult {
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
        return sensor1.valueY < sensor2.valueY ? sensor1 : sensor2;
      case RotationMode.rightWall:
        return sensor1.valueX < sensor2.valueX ? sensor1 : sensor2;
      case RotationMode.ceiling:
        return sensor1.valueY > sensor2.valueY ? sensor1 : sensor2;
      case RotationMode.leftWall:
        return sensor1.valueX > sensor2.valueX ? sensor1 : sensor2;
    }
    return null;
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

  invulnerable(): boolean {
    const mc = this.sonicManager.drawTickCount - this.sonicLastHitTick;
    if (mc < 120) {
      if (mc % 8 < 4) {
        return true;
      }
    }
    return false;
  }

  private updateSprite(): void {
    const absgsp = Math.abs(this.gsp);
    const word = this.spriteState.substring(0, this.spriteState.length - 1);
    const j = parseInt(this.spriteState.substring(this.spriteState.length - 1, this.spriteState.length));
    if (this.breaking > 0) {
      if (this.gsp > 0 || this.gsp === 0 || this.spriteState === 'breaking3') {
        this.facing = false;
        this.breaking = 0;
      }
    } else if (this.breaking < 0) {
      if (this.gsp < 0 || this.gsp === 0 || this.spriteState === 'breaking3') {
        this.breaking = 0;
        this.facing = true;
      }
    }
    const epsilon = 0.00001;
    if (this.justHit) {
      if (word !== 'hit') {
        this.spriteState = 'hit0';
        this.runningTick = 1;
      } else if (this.runningTick++ % (Math.floor(8 - absgsp) | 0) === 0) {
        this.spriteState = 'hit1';
      }
    } else if (this.spinDash) {
      if (word !== 'spindash') {
        this.spriteState = 'spindash0';
        this.runningTick = 1;
      } else if ((this.runningTick++ % Math.floor(2 - absgsp) | 0) === 0) {
        this.spriteState = 'spindash' + ((j + 1) % 6);
      }
    } else if (Math.abs(absgsp - 0) < epsilon && !this.inAir) {
      if (this.ducking) {
        if (word !== 'duck') {
          this.spriteState = 'duck0';
          this.runningTick = 1;
        } else if ((this.runningTick++ % Math.floor(4 - absgsp) | 0) === 0) {
          this.spriteState = 'duck1';
        }
      } else if (this.holdingUp) {
        if (word !== 'lookingup') {
          this.spriteState = 'lookingup0';
          this.runningTick = 1;
        } else if ((this.runningTick++ % Math.floor(4 - absgsp) | 0) === 0) {
          this.spriteState = 'lookingup1';
        }
      } else {
        this.spriteState = 'normal';
        this.currentlyBall = false;
        this.rolling = false;
        this.runningTick = 0;
      }
    } else if (this.breaking !== 0) {
      if (word !== 'breaking') {
        this.spriteState = 'breaking0';
        this.runningTick = 1;
      } else if (this.runningTick++ % 7 === 0) {
        this.spriteState = 'breaking' + ((j + 1) % 4);
        if (j === 0 && !this.inAir) {
          this.haltSmoke.push(new Point(this.x, this.y));
        }
      }
    } else if (this.currentlyBall) {
      if (word !== 'balls') {
        this.spriteState = 'balls0';
        this.runningTick = 1;
      } else if (this.runningTick++ % Math.floor(8 - absgsp) === 0 || 8 - absgsp < 1) {
        this.spriteState = 'balls' + ((j + 1) % 5);
      }
    } else if (absgsp < 6) {
      if (word !== 'running') {
        this.spriteState = 'running0';
        this.runningTick = 1;
      } else if (this.runningTick++ % (Math.floor(8 - absgsp) | 0) === 0 || 8 - absgsp < 1) {
        this.spriteState = 'running' + ((j + 1) % 8);
      }
    } else if (absgsp >= 6) {
      if (word !== 'fastrunning') {
        this.spriteState = 'fastrunning0';
        this.runningTick = 1;
      } else if (this.runningTick++ % (Math.floor(8 - absgsp) | 0) === 0 || 8 - absgsp < 1) {
        this.spriteState = 'fastrunning' + ((j + 1) % 4);
      }
    }
  }

  private effectPhysics(): void {
    this.watcher.Tick();
    const physics = this.physicsVariables;
    const max = physics.topSpeed;
    if (!this.jumping) {
      if (!this.inAir && this.wasJumping) {
        this.wasJumping = false;
      }
    }
    if (this.inAir && !this.wasInAir) {
      this.wasInAir = true;
    }
    if (!this.inAir && this.wasInAir) {
      this.wasInAir = false;
      if (this.angle >= 0xf0 || this.angle <= 0x0f) {
        this.gsp = this.xsp;
      } else if ((this.angle > 0xe2 && this.angle <= 0xef) || (this.angle >= 0x10 && this.angle <= 0x1f)) {
        this.gsp = this.ysp;
      } else if (this.angle >= 0xc0 && this.angle <= 0xe2) {
        this.gsp = -this.ysp;
      } else if (this.angle >= 0x20 && this.angle <= 0x3f) {
        this.gsp = this.ysp;
      }
      this.xsp = 0;
      this.ysp = 0;
    }
    if (!this.inAir && !this.rolling && !this.spinDash) {
      if (!this.holdingLeft && !this.holdingRight && !this.justHit) {
        this.gsp -= Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.frc)) * (this.gsp > 0 ? 1 : -1);
      }
      this.oldSign = Help.sign(this.gsp);
      this.gsp += this.watcher.Multiply(physics.slp) * -Help.sin(this.angle);
      if (this.oldSign !== Help.sign(this.gsp) && this.oldSign !== 0) {
        this.hLock = 30;
      }
      if (this.holdingRight && !this.holdingLeft && !this.justHit) {
        this.facing = true;
        if (this.gsp >= 0) {
          this.gsp += this.watcher.Multiply(physics.acc);
          if (this.gsp > max) {
            this.gsp = max;
          }
        } else {
          this.gsp += this.watcher.Multiply(physics.dec);
          if (Math.abs(this.gsp) > 4.5) {
            this.facing = false;
            this.breaking = 1;
            this.runningTick = 0;
          }
        }
      }
      if (this.holdingLeft && !this.holdingRight && !this.justHit) {
        this.facing = false;
        if (this.gsp <= 0) {
          this.gsp -= this.watcher.Multiply(physics.acc);
          if (this.gsp < -max) {
            this.gsp = -max;
          }
        } else {
          this.gsp -= this.watcher.Multiply(physics.dec);
          if (Math.abs(this.gsp) > 4.5) {
            this.facing = true;
            this.breaking = -1;
            this.runningTick = 0;
          }
        }
      }
    }
    this.ducking = false;
    if (this.crouching) {
      if (Math.abs(this.gsp) > 1.03125) {
        this.rolling = true;
        this.currentlyBall = true;
      } else {
        this.ducking = true;
      }
    } else {
      if (this.spinDash) {
        this.gsp = (8 + Help.floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
        this.spinDash = false;
        this.rolling = true;
        this.currentlyBall = true;
      }
    }
    if (!this.inAir && this.rolling) {
      if (this.holdingLeft && !this.justHit) {
        if (this.gsp > 0) {
          if (this.rolling) {
            this.gsp = Help.max(0, this.gsp - this.watcher.Multiply(physics.rdec));
          }
        }
      }
      if (this.holdingRight && !this.justHit) {
        if (this.gsp < 0) {
          if (this.rolling) {
            this.gsp = Help.min(0, this.gsp + this.watcher.Multiply(physics.rdec));
          }
        }
      }
      this.gsp -= Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.rfrc)) * (this.gsp > 0 ? 1 : -1);
      this.oldSign = Help.sign(this.gsp);
      const ang = Help.sin(this.angle);
      if (ang > 0 === this.gsp > 0) {
        this.gsp += this.watcher.Multiply(-physics.slpRollingUp) * ang;
      } else {
        this.gsp += this.watcher.Multiply(-physics.slpRollingDown) * ang;
      }
      if (this.gsp > max * 2.5) {
        this.gsp = max * 2.5;
      }
      if (this.gsp < -max * 2.5) {
        this.gsp = -max * 2.5;
      }
      if (this.oldSign !== Help.sign(this.gsp) && this.oldSign !== 0) {
        this.hLock = 30;
      }
      if (Math.abs(this.gsp) < 0.53125) {
        this.rolling = false;
        this.currentlyBall = false;
      }
    }
    if (this.inAir) {
      if (this.holdingRight && !this.holdingLeft && !this.justHit) {
        this.facing = true;
        if (this.xsp >= 0) {
          this.xsp += this.watcher.Multiply(physics.air);
          if (this.xsp > max) {
            this.xsp = max;
          }
        } else {
          this.xsp += this.watcher.Multiply(physics.air);
        }
      }
      if (this.holdingLeft && !this.holdingRight && !this.justHit) {
        this.facing = false;
        if (this.xsp <= 0) {
          this.xsp -= this.watcher.Multiply(physics.air);
          if (this.xsp < -max) {
            this.xsp = -max;
          }
        } else {
          //                    this.xsp -= this.Watcher.Multiply(physics.Air);
        }
      }
      if (this.wasInAir) {
        if (this.jumping) {
        } else {
        }
      }
      this.ysp += this.justHit ? 0.1875 : physics.grv;
      if (this.ysp < 0 && this.ysp > -4) {
        if (Math.abs(this.xsp) > 0.125) {
          this.xsp *= 0.96875;
        }
      }
      if (this.ysp > 16) {
        this.ysp = 16;
      }
    }
    if (this.wasInAir && this.jumping) {
    } else if (this.jumping && !this.wasJumping) {
      this.wasJumping = true;
      if (this.ducking) {
        this.spinDash = true;
        this.spinDashSpeed += 2;
        if (this.spinDashSpeed > 8) {
          this.spinDashSpeed = 8;
        }
        this.spriteState = 'spindash0';
      } else {
        this.inAir = true;
        this.currentlyBall = true;
        this.xsp = physics.jmp * Help.sin(this.angle) + this.gsp * Help.cos(this.angle);
        this.ysp = physics.jmp * Help.cos(this.angle);
        if (Math.abs(this.xsp) < 0.17) {
          this.xsp = 0;
        }
      }
    }
    if (!this.inAir) {
      if (this.spinDash) {
        this.gsp = 0;
      }
      this.xsp = this.gsp * Help.cos(this.angle);
      this.ysp = this.gsp * -Help.sin(this.angle);
      if (Math.abs(this.gsp) < 2.5 && this.mode !== RotationMode.floor) {
        if (this.mode === RotationMode.rightWall) {
          this.x += 0;
        } else if (this.mode === RotationMode.leftWall) {
          this.x += 0;
        } else if (this.mode === RotationMode.ceiling) {
          this.y += 0;
        }
        const oldMode = this.mode;
        this.updateMode();
        this.mode = RotationMode.floor;
        this.hLock = 30;
        this.inAir = true;
      }
    }
    if (this.xsp > 0 && this.xsp < 0.008) {
      this.gsp = 0;
      this.xsp = 0;
    }
    if (this.xsp < 0 && this.xsp > -0.008) {
      this.gsp = 0;
      this.xsp = 0;
    }
    this.x = (this.sonicLevel.levelWidth * 128 + (this.x + this.xsp)) % (this.sonicLevel.levelWidth * 128);
    this.y = (this.sonicLevel.levelHeight * 128 + (this.y + this.ysp)) % (this.sonicLevel.levelHeight * 128);
  }

  draw(context: CanvasRenderingContext2D): void {
    const fx = this.x | 0;
    const fy = this.y | 0;
    if (this.invulnerable()) {
      return;
    }
    const cur = SonicEngine.instance.spriteCache.sonicSprites[this.spriteState];
    if (cur == null) {
    }
    if (Help.isLoaded(cur)) {
      context.save();
      context.translate(fx - this.sonicManager.windowLocation.x, fy - this.sonicManager.windowLocation.y);
      if (this.sonicManager.showHeightMap) {
        const mul = 10;
        const xj = this.xsp * mul;
        const yj = this.ysp * mul;

        const distance = Math.sqrt(yj * yj + xj * xj);

        context.save();
        context.moveTo(xj, yj);
        context.beginPath();
        context.fillStyle = 'rgba(163,241,255,1)';
        context.strokeStyle = 'rgba(163,241,255,1)';
        context.arc(xj, yj, distance / 8, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
      }
      if (!this.facing) {
        context.scale(-1, 1);
        if (!this.currentlyBall && !this.spinDash) {
          context.rotate(-Help.fixAngle(this.angle));
        }

        let offsetX = 0;
        if (this.spriteState === 'duck0') {
          offsetX = 6;
        } else if (this.spriteState === 'duck1') {
          offsetX = 7;
        }
        if (this.spriteState === 'lookingup0') {
          offsetX = -1;
        } else if (this.spriteState === 'lookingup1') {
          offsetX = -2;
        }

        context.drawImage(cur, -cur.width / 2 + offsetX, -cur.height / 2);
        if (this.spinDash) {
          context.drawImage(
            SonicEngine.instance.spriteCache.sonicSprites[
              'spinsmoke' + (((this.sonicManager.drawTickCount % 14) / 2) | 0)
            ],
            -cur.width / 2 - 20,
            -cur.height / 2,
            cur.width,
            cur.height
          );
        }
      } else {
        if (!this.currentlyBall && !this.spinDash) {
          context.rotate(Help.fixAngle(this.angle));
        }

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

        context.drawImage(cur, -cur.width / 2 + offsetX, -cur.height / 2);
        if (this.spinDash) {
          context.drawImage(
            SonicEngine.instance.spriteCache.sonicSprites[
              'spinsmoke' + (((this.sonicManager.drawTickCount % 14) / 2) | 0)
            ],
            -cur.width / 2 - 20,
            -cur.height / 2,
            cur.width,
            cur.height
          );
        }
      }
      context.restore();
      if (this.sonicManager.showHeightMap) {
        this.oldSensorManager.draw(context, this);
      }
      for (let i = 0; i < this.haltSmoke.length; i++) {
        const lo = this.haltSmoke[i];
        context.drawImage(
          SonicEngine.instance.spriteCache.sonicSprites[
            'haltsmoke' + (((this.sonicManager.drawTickCount % (4 * 6)) / 6) | 0)
          ],
          lo.x - this.sonicManager.windowLocation.x - 15,
          lo.y + 12 - this.sonicManager.windowLocation.y
        );
        if (((((this.sonicManager.drawTickCount + 6) % (4 * 6)) / 6) | 0) === 0) {
          this.haltSmoke.splice(i, 1);
        }
      }
    }
  }

  drawUI(canvas: CanvasRenderingContext2D, pos: Point): void {
    /*
         canvas.save();
         {
         if (canvas.font != "13pt Arial bold")
         canvas.font = "13pt Arial bold";
         canvas.fillStyle = "White";
         canvas.fillText("Rings: " + this.rings, pos.x + 90, pos.y + 45);
         canvas.fillText("Angle: " + this.angle.toString(16), pos.x + 90, pos.y + 75);
         canvas.fillText("Position: " + (this.x) + ", " + (this.y), pos.x + 90, pos.y + 105);
         canvas.fillText("Speed: g: " + this.gsp.toFixed(3) + " x:" + this.xsp.toFixed(3) + " y:" + this.ysp.toFixed(3), pos.x + 90, pos.y + 135);
         canvas.fillText("Mode: " + (<number>this.mode).toString(), pos.x + 90, pos.y + 165);
         canvas.fillText("Multiplier: " + this.watcher.mult, pos.x + 90, pos.y + 195);
         if (this.inAir)
         canvas.fillText("air ", pos.x + 220, pos.y + 45);
         if (this.hLock > 0)
         canvas.fillText("HLock: " + this.hLock, pos.x + 90, pos.y + 195);
         }
         canvas.restore();
         */
  }

  hit(x: number, y: number): void {
    if (this.sonicManager.drawTickCount - this.sonicLastHitTick < 120) {
      return;
    }
    this.justHit = true;
    this.ysp = -4;
    this.xsp = 2 * (this.x - x < 0 ? -1 : 1);
    this.sonicLastHitTick = this.sonicManager.drawTickCount;
    let t = 0;
    let angle = 101.25;
    let n = false;
    let speed = 4;
    while (t < this.rings) {
      const ring = new Ring(this.sonicManager, true);
      this.sonicManager.activeRings.push(ring);
      ring.x = this.x | 0;
      ring.y = (this.y - 10) | 0;
      ring.ysp = -Math.sin(angle) * speed;
      ring.xsp = Math.cos(angle) * speed;
      if (n) {
        ring.ysp *= -1;
        angle += 22.5;
      }
      n = !n;
      t++;
      if (t === 16) {
        speed = 2;
        angle = 101.25;
      }
    }
    this.rings = 0;
  }

  debug(): void {
    this.debugging = !this.debugging;
    this.xsp = 0;
    this.gsp = 0;
    this.ysp = 0;
    this.spriteState = 'normal';
  }

  pressUp(): void {
    this.holdingUp = true;
  }

  releaseUp(): void {
    this.holdingUp = false;
  }

  pressCrouch(): void {
    // if (this.holdingLeft || this.holdingRight)return;
    this.crouching = true;
  }

  releaseCrouch(): void {
    this.crouching = false;
  }

  pressLeft(): void {
    // if (this.crouching)return;
    this.holdingLeft = true;
  }

  releaseLeft(): void {
    this.holdingLeft = false;
  }

  pressRight(): void {
    // if (this.crouching)return;
    this.holdingRight = true;
  }

  releaseRight(): void {
    this.holdingRight = false;
  }

  pressJump(): void {
    this.jumping = true;
  }

  releaseJump(): void {
    this.jumping = false;
  }

  private objectCollision: Point = new Point(0, 0);

  checkCollisionWithObjects(x: number, y: number, letter: string): boolean {
    this.objectCollision.x = x;
    this.objectCollision.y = y;
    const me = this.objectCollision;
    const levelObjectInfos = this.sonicManager.inFocusObjects;
    for (const ob of levelObjectInfos) {
      const dj = ob.collides(me);
      const dj2 = ob.hurtsSonic(me);
      if (dj) {
        return ob.collide(this, letter, dj);
      }
      if (dj2) {
        return ob.hurtSonic(this, letter, dj2);
      }
    }
    return false;
  }

  private ringCollisionRect: Rectangle = new Rectangle(0, 0, 0, 0);

  checkCollisionWithRings(): void {
    const me = this.myRec;
    this.ringCollisionRect.x = 0;
    this.ringCollisionRect.y = 0;
    this.ringCollisionRect.width = 8 * 2;
    this.ringCollisionRect.height = 8 * 2;
    const rings: Ring[] = this.sonicManager.sonicLevel.rings;
    for (let index: number = 0; index < rings.length; index++) {
      const ring = rings[index];
      const pos = ring;
      if (this.obtainedRing[index]) {
        continue;
      }
      this.ringCollisionRect.x = pos.x;
      this.ringCollisionRect.y = pos.y;
      if (IntersectingRectangle.intersectRect(me, this.ringCollisionRect)) {
        this.rings++;
        this.obtainedRing[index] = true;
      }
    }
  }

  checkCollisionLine(p0: number, p1: number, p2: number, p3: number): SensorResult {
    return null;
  }

  private fixAngle(angle: number) {
    if (angle === 255 || angle === 0 || angle === 1) {
      if (this.mode === RotationMode.floor) {
        angle = 255;
      }
      if (this.mode === RotationMode.leftWall) {
        angle = 64;
      }
      if (this.mode === RotationMode.ceiling) {
        angle = 128;
      }
      if (this.mode === RotationMode.rightWall) {
        angle = 192;
      }
    }
    return angle;
  }
}

export class Watcher {
  private lastTick: number = 0;
  mult: number = 1;

  Tick(): void {
    this.mult = 1;
    /*     let ticks = new Date().getTime();
             let offset: number = 0;
             if (this.lastTick===0)
                 offset = 16;
             else offset = ticks - this.lastTick;
             this.lastTick = ticks;
             this.mult = (offset / 16) | 0;*/
  }

  Multiply(v: number): number {
    return this.mult * v;
  }
}
