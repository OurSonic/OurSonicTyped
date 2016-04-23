import {Rectangle, Point, IntersectingRectangle } from "../../Common/Utils";
import {SensorManager, SensorM } from "./SensorManager";
import {SonicLevel, } from "../SonicLevel";
import {RotationMode } from "../../Common/Enums";
import {SonicManager } from "../SonicManager";
import {Help} from "../../Common/Help";
import {Ring } from "../Level/Ring";
import {SonicConstants } from "./SonicConstants";

export class Sonic {
    public myRec: Rectangle;
    public obtainedRing: { [key: number]: boolean } = {};
    private oldSign: number;
    private physicsVariables: SonicConstants;
    private runningTick: number;

    public SensorManager: SensorManager;
    public sonicLastHitTick: number;
    private sonicLevel: SonicLevel;

    public watcher: Watcher;
    public ticking: boolean=false;
    public x: number = 0;
    public y: number = 0;
    public rings: number = 0;
    public debugging: boolean=false;
    public jumping: boolean = false;
    public crouching: boolean = false;
    public holdingLeft: boolean = false;
    public holdingRight: boolean = false;
    public holdingUp: boolean = false;
    public xsp: number = 0;
    public ysp: number = 0;
    public gsp: number = 0;
    public rolling: boolean = false;
    public inAir: boolean = false;
    public wasInAir: boolean = false;
    public holdingJump: boolean = false;
    public justHit: boolean = false;
    public hLock: number = 0;
    public mode: RotationMode=RotationMode.Floor;
    public facing: boolean = false;
    public breaking: number = 0;
    public ducking: boolean = false;
    public spinDash: boolean = false;
    public spinDashSpeed: number = 0;
    public angle: number = 0;
    protected currentlyBall: boolean = false;
    protected spriteState: string;
    protected haltSmoke: Point[];

    public wasJumping: boolean;
    constructor() {
        this.watcher = new Watcher();
        this.physicsVariables = SonicConstants.Sonic();
        let sonicManager = SonicManager.instance;
        this.sonicLevel = sonicManager.sonicLevel;
        this.x = this.sonicLevel.StartPositions[0].X;
        this.y = this.sonicLevel.StartPositions[0].Y;
        this.SensorManager = new SensorManager();
        this.haltSmoke = new Array<Point>();
        this.rings = 7;
        this.SensorManager.CreateVerticalSensor("a", -9, 0, 36, "#F202F2");
        this.SensorManager.CreateVerticalSensor("b", 9, 0, 36, "#02C2F2");
        this.SensorManager.CreateVerticalSensor("c", -9, 0, -20, "#2D2C21");
        this.SensorManager.CreateVerticalSensor("d", 9, 0, -20, "#C24222");
        this.SensorManager.CreateHorizontalSensor("m1", 4, 0, -12, "#212C2E");
        this.SensorManager.CreateHorizontalSensor("m2", 4, 0, 13, "#22Ffc1");
        this.spriteState = "normal";
        this.myRec = new Rectangle(0, 0, 0, 0);
        this.sonicLastHitTick = -100000;
    }
    public UpdateMode(): void {
        if (this.angle <= 0x22 || this.angle >= 0xDE)
            this.mode = RotationMode.Floor;
        else if (this.angle > 0x22 && this.angle < 0x59)
            this.mode = RotationMode.LeftWall;
        else if (this.angle >= 0x59 && this.angle < 0xA1)
            this.mode = RotationMode.Ceiling;
        else if (this.angle > 0xA1 && this.angle < 0xDE)
            this.mode = RotationMode.RightWall;
        this.myRec.X = (this.x - 10) | 0;
        this.myRec.Y = (this.y - 20) | 0;
        this.myRec.Width = 10 * 2;
        this.myRec.Height = 20 * 2;
        if (this.inAir)
            this.mode = RotationMode.Floor;
    }
    public Tick(sonicLevel: SonicLevel): void {
        if (this.debugging) {
            let debugSpeed = this.watcher.Multiply(15);
            if (this.holdingRight)
                this.x += debugSpeed;
            if (this.holdingLeft)
                this.x -= debugSpeed;
            if (this.crouching)
                this.y += debugSpeed;
            if (this.holdingUp)
                this.y -= debugSpeed;
            this.x = ((sonicLevel.LevelWidth * 128) + (this.x)) % (sonicLevel.LevelWidth * 128);
            this.y = ((sonicLevel.LevelHeight * 128) + (this.y)) % (sonicLevel.LevelHeight * 128);
            return
        }
        this.UpdateMode();
        if (this.hLock > 0) {
            this.hLock--;
            this.holdingRight = false;
            this.holdingLeft = false;
        }
        if (this.inAir) {
            if (this.angle != 0xff) {
                this.angle = (0xff + (this.angle + ((this.angle > 0xff / 2) ? 2 : -2))) % 0xff;
                if (this.angle >= 0xfd || this.angle <= 0x01)
                    this.angle = 0xff;
            }
        }
        this.EffectPhysics();
        this.CheckCollisionWithRings();
        this.UpdateSprite();
        this.SensorManager.Check(this);
        let sensorM1 = this.SensorManager.GetResult("m1");
        let sensorM2 = this.SensorManager.GetResult("m2");
        let best = this.GetBestSensor(sensorM1, sensorM2, this.mode);
        if (best != null) {
            switch (this.mode) {
                case RotationMode.Floor:
                    this.x = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? 12 : -12)));
                    this.gsp = 0;
                    if (this.inAir)
                        this.xsp = 0;
                    break;
                case RotationMode.LeftWall:
                    this.y = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? 12 : -12)));
                    if (this.inAir)
                        this.xsp = 0;
                    break;
                case RotationMode.Ceiling:
                    this.x = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? -12 : 12)));
                    this.gsp = 0;
                    if (this.inAir)
                        this.xsp = 0;
                    break;
                case RotationMode.RightWall:
                    this.y = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? -12 : 12)));
                    this.gsp = 0;
                    if (this.inAir)
                        this.xsp = 0;
                    break;
            }
        }
        this.SensorManager.Check(this);
        let sensorA = this.SensorManager.GetResult("a");
        let sensorB = this.SensorManager.GetResult("b");
        let fy: number;
        let fx: number;
        let hSize = this.GetHalfImageSize();
        if (!this.inAir) {
            best = this.GetBestSensor(sensorA, sensorB, this.mode);
            if (best == null)
                this.inAir = true;
            else {
                this.justHit = false;
                switch (this.mode) {
                    case RotationMode.Floor:
                        best.Chosen = true;
                        this.angle = best.Angle;
                        this.y = fy = best.Value - hSize.Y;
                        break;
                    case RotationMode.LeftWall:
                        best.Chosen = true;
                        this.angle = best.Angle;
                        this.x = fx = best.Value + hSize.X;
                        break;
                    case RotationMode.Ceiling:
                        best.Chosen = true;
                        this.angle = best.Angle;
                        this.y = fy = best.Value + hSize.Y;
                        break;
                    case RotationMode.RightWall:
                        best.Chosen = true;
                        this.angle = best.Angle;
                        this.x = fx = best.Value - hSize.X;
                        break;
                }
            }
            this.UpdateMode();
        }
        else {
            if (sensorA == null && sensorB == null)
                this.inAir = true;
            else {
                if ((sensorA != null && sensorA.Value >= 0) && (sensorB != null && sensorB.Value >= 0)) {
                    if (sensorA.Value < sensorB.Value) {
                        if (this.y + (20) >= sensorA.Value) {
                            this.angle = sensorA.Angle;
                            this.y = fy = sensorA.Value - hSize.Y;
                            this.rolling = this.currentlyBall = false;
                            this.inAir = false;
                        }
                    }
                    else {
                        if (sensorB.Value > -1) {
                            if (this.y + (20) >= sensorB.Value) {
                                this.angle = sensorB.Angle;
                                this.y = fy = sensorB.Value - hSize.Y;
                                this.rolling = this.currentlyBall = false;
                                this.inAir = false;
                            }
                        }
                    }
                }
                else if ((sensorA != null) && sensorA.Value > -1) {
                    if (this.y + (20) >= sensorA.Value) {
                        this.angle = sensorA.Angle;
                        this.y = fy = sensorA.Value - hSize.Y;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                }
                else if (sensorB != null && sensorB.Value > -1) {
                    if (this.y + (20) >= sensorB.Value) {
                        this.angle = sensorB.Angle;
                        this.y = fy = sensorB.Value - hSize.Y;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                }
            }
            this.UpdateMode();
            let cur = SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
            let __h = cur.height / 2;
            this.SensorManager.Check(this);
            let sensorC = this.SensorManager.GetResult("c");
            let sensorD = this.SensorManager.GetResult("d");
            if ((sensorC == null && sensorD == null)) {

            }
            else {
                if (sensorD != null && (sensorC != null) && (sensorC.Value >= 0 && sensorD.Value >= 0)) {
                    if (sensorC.Value < sensorD.Value) {
                        if (this.y + (__h) >= sensorC.Value) {
                            if (this.ysp < 0) {
                                if (sensorC.Angle > 0x40 && sensorC.Angle < 0xC0) {
                                    this.angle = sensorC.Angle;
                                    this.gsp = this.ysp;
                                    this.inAir = false;
                                    this.wasInAir = false;
                                }
                                else this.ysp = 0;
                                this.y = fy = sensorC.Value + __h;
                            }
                        }
                    }
                    else {
                        if (this.y + (__h) >= sensorD.Value) {
                            if (this.ysp < 0) {
                                if (sensorD.Angle > 0x40 && sensorD.Angle < 0xC0) {
                                    this.angle = sensorD.Angle;
                                    this.gsp = -this.ysp;
                                    this.inAir = false;
                                    this.wasInAir = false;
                                }
                                else this.ysp = 0;
                                this.y = fy = sensorD.Value + __h;
                            }
                        }
                    }
                }
                else if (sensorC != null && sensorC.Value > -1) {
                    if (this.y + (__h) >= sensorC.Value) {
                        if (this.ysp < 0) {
                            if (sensorC.Angle > 0x40 && sensorC.Angle < 0xC0) {
                                this.angle = sensorC.Angle;
                                this.gsp = this.ysp;
                                this.inAir = false;
                                this.wasInAir = false;
                            }
                            else this.ysp = 0;
                            this.y = fy = sensorC.Value + __h;
                        }
                    }
                }
                else if (sensorD != null && sensorD.Value > -1) {
                    if (this.y + (__h) >= sensorD.Value) {
                        if (this.ysp < 0) {
                            if (sensorD.Angle > 0x40 && sensorD.Angle < 0xC0) {
                                this.angle = sensorD.Angle;
                                this.gsp = -this.ysp;
                                this.inAir = false;
                                this.wasInAir = false;
                            }
                            else this.ysp = 0;
                            this.y = fy = sensorD.Value + __h;
                        }
                    }
                }
                this.UpdateMode();
            }
        }
    }
    private GetBestSensor(sensor1: SensorM, sensor2: SensorM, mode: RotationMode): SensorM {
        if (sensor1 == null && sensor2 == null)
            return null;
        if (sensor1 == null)
            return sensor2;
        if (sensor2 == null)
            return sensor1;
        switch (mode) {
            case RotationMode.Floor:
                return sensor1.Value < sensor2.Value ? sensor1 : sensor2;
            case RotationMode.LeftWall:
                return sensor1.Value > sensor2.Value ? sensor1 : sensor2;
            case RotationMode.Ceiling:
                return sensor1.Value > sensor2.Value ? sensor1 : sensor2;
            case RotationMode.RightWall:
                return sensor1.Value < sensor2.Value ? sensor1 : sensor2;
        }
        return null;
    }
    public Invulnerable(): boolean {
        let mc = SonicManager.instance.drawTickCount - this.sonicLastHitTick;
        if (mc < 120) {
            if (mc % 8 < 4)
                return true;
        }
        return false;
    }
    private halfSize: Point = new Point(20, 20);
    private GetHalfImageSize(): Point {
        return this.halfSize;
    }
    private offsetFromImage: Point = new Point(0, 0);
    private GetOffsetFromImage(): Point {
        let cur = SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
        let xOffset = 0;
        let yOffset = 0;
        if (cur.height != 40) {
            let n: number;
            switch (this.mode) {
                case RotationMode.Floor:
                    n = 0;
                    yOffset = (40 - ((cur.height + n))) / 2;
                    break;
                case RotationMode.LeftWall:
                    n = 15;
                    xOffset = -(40 - ((cur.height + n))) / 2;
                    break;
                case RotationMode.Ceiling:
                    n = 8;
                    yOffset = -(40 - ((cur.height + n))) / 2;
                    break;
                case RotationMode.RightWall:
                    n = 9;
                    xOffset = (40 - ((cur.height + n))) / 2;
                    break;
            }
        }
        this.offsetFromImage.X = xOffset;
        this.offsetFromImage.Y = yOffset;
        return this.offsetFromImage;
    }
    private UpdateSprite(): void {
        let absgsp = Math.abs(this.gsp);
        let word = this.spriteState.substring(0, this.spriteState.length - 1);
        let j = parseInt(this.spriteState.substring(this.spriteState.length - 1, this.spriteState.length));
        if (this.breaking > 0) {
            if (this.gsp > 0 || this.gsp == 0 || this.spriteState == "breaking3") {
                this.facing = false;
                this.breaking = 0;
            }
        }
        else if (this.breaking < 0) {
            if (this.gsp < 0 || this.gsp == 0 || this.spriteState == "breaking3") {
                this.breaking = 0;
                this.facing = true;
            }
        }
        let epsilon = 0.00001;
        if (this.justHit) {
            if (word != "hit") {
                this.spriteState = "hit0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0))
                this.spriteState = "hit1";
        }
        else if (this.spinDash) {
            if (word != "spindash") {
                this.spriteState = "spindash0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % Math.floor(2 - absgsp) | 0) == 0)
                this.spriteState = "spindash" + ((j + 1) % 6);
        }
        else if (Math.abs(absgsp - 0) < epsilon && !this.inAir) {
            if (this.ducking) {
                if (word != "duck") {
                    this.spriteState = "duck0";
                    this.runningTick = 1;
                }
                else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                    this.spriteState = "duck1";
            }
            else if (this.holdingUp) {
                if (word != "lookingup") {
                    this.spriteState = "lookingup0";
                    this.runningTick = 1;
                }
                else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                    this.spriteState = "lookingup1";
            }
            else {
                this.spriteState = "normal";
                this.currentlyBall = false;
                this.rolling = false;
                this.runningTick = 0;
            }
        }
        else if (this.breaking != 0) {
            if (word != "breaking") {
                this.spriteState = "breaking0";
                this.runningTick = 1;
            }
            else if ((this.runningTick++) % (7) == 0) {
                this.spriteState = "breaking" + ((j + 1) % 4);
                if (j == 0)
                    this.haltSmoke.push(new Point(this.x, this.y));
            }
        }
        else if (this.currentlyBall) {
            if (word != "balls") {
                this.spriteState = "balls0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (<number>Math.floor(8 - absgsp)) == 0) || (8 - absgsp < 1))
                this.spriteState = "balls" + ((j + 1) % 5);
        }
        else if (absgsp < 6) {
            if (word != "running") {
                this.spriteState = "running0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                this.spriteState = "running" + ((j + 1) % 8);
        }
        else if (absgsp >= 6) {
            if (word != "fastrunning") {
                this.spriteState = "fastrunning0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                this.spriteState = "fastrunning" + ((j + 1) % 4);
        }
    }
    private EffectPhysics(): void {
        this.watcher.Tick();
        let physics = this.physicsVariables;
        let max = physics.TopSpeed;
        if (!this.jumping) {
            if (!this.inAir && this.wasJumping)
                this.wasJumping = false;
        }
        if (this.inAir && !this.wasInAir) {
            this.wasInAir = true;
            let offset = this.GetOffsetFromImage();
        }
        if (!this.inAir && this.wasInAir) {
            this.wasInAir = false;
            if ((this.angle >= 0xF0 || this.angle <= 0x0F))
                this.gsp = (this.xsp);
            else if ((this.angle > 0xE2 && this.angle <= 0xEF) || (this.angle >= 0x10 && this.angle <= 0x1F))
                this.gsp = (this.ysp);
            else if ((this.angle >= 0xC0 && this.angle <= 0xE2))
                this.gsp = (-this.ysp);
            else if ((this.angle >= 0x20 && this.angle <= 0x3F))
                this.gsp = (this.ysp);
            this.xsp = 0;
            this.ysp = 0;
        }
        if (!this.inAir && !this.rolling && !this.spinDash) {
            if (!this.holdingLeft && !this.holdingRight && !this.justHit) {
                this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.Frc)) * (this.gsp > 0 ? 1 : -1));
            }
            this.oldSign = Help.Sign(this.gsp);
            this.gsp += this.watcher.Multiply(physics.Slp) * -Help.Sin(this.angle);
            if (this.oldSign != Help.Sign(this.gsp) && this.oldSign != 0)
                this.hLock = 30;
            if (this.holdingRight && !this.holdingLeft && !this.justHit) {
                this.facing = true;
                if (this.gsp >= 0) {
                    this.gsp += this.watcher.Multiply(physics.Acc);
                    if (this.gsp > max)
                        this.gsp = max;
                }
                else {
                    this.gsp += this.watcher.Multiply(physics.Dec);
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
                    this.gsp -= this.watcher.Multiply(physics.Acc);
                    if (this.gsp < -max)
                        this.gsp = -max;
                }
                else {
                    this.gsp -= this.watcher.Multiply(physics.Dec);
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
            }
            else this.ducking = true;
        }
        else {
            if (this.spinDash) {
                this.gsp = (8 + Help.Floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
                this.spinDash = false;
                this.rolling = true;
                this.currentlyBall = true;
            }
        }
        if (!this.inAir && this.rolling) {
            if (this.holdingLeft && !this.justHit) {
                if (this.gsp > 0) {
                    if (this.rolling)
                        this.gsp = (Help.Max(0, this.gsp - this.watcher.Multiply(physics.Rdec)));
                }
            }
            if (this.holdingRight && !this.justHit) {
                if (this.gsp < 0) {
                    if (this.rolling)
                        this.gsp = (Help.Min(0, this.gsp + this.watcher.Multiply(physics.Rdec)));
                }
            }
            this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.Rfrc)) * (this.gsp > 0 ? 1 : -1));
            this.oldSign = Help.Sign(this.gsp);
            let ang = Help.Sin(this.angle);
            if ((ang > 0) == (this.gsp > 0))
                this.gsp += this.watcher.Multiply(-physics.SlpRollingUp) * ang;
            else this.gsp += this.watcher.Multiply(-physics.SlpRollingDown) * ang;
            if (this.gsp > max * 2.5)
                this.gsp = max * 2.5;
            if (this.gsp < -max * 2.5)
                this.gsp = -max * 2.5;
            if (this.oldSign != Help.Sign(this.gsp) && this.oldSign != 0)
                this.hLock = 30;
            if (Math.abs(this.gsp) < 0.53125) {
                this.rolling = false;
                this.currentlyBall = false;
            }
        }
        if (this.inAir) {
            if (this.holdingRight && !this.holdingLeft && !this.justHit) {
                this.facing = true;
                if (this.xsp >= 0) {
                    this.xsp += this.watcher.Multiply(physics.Air);
                    if (this.xsp > max)
                        this.xsp = max;
                }
                else {
                    this.xsp += this.watcher.Multiply(physics.Air);
                }
            }
            if (this.holdingLeft && !this.holdingRight && !this.justHit) {
                this.facing = false;
                if (this.xsp <= 0) {
                    this.xsp -= this.watcher.Multiply(physics.Air);
                    if (this.xsp < -max)
                        this.xsp = -max;
                }
                else {
//                    this.Xsp -= this.Watcher.Multiply(physics.Air);
                }
            }
            if (this.wasInAir)
                if (this.jumping) {

                }
                else {

                }
            this.ysp += this.justHit ? 0.1875 : physics.Grv;
            if (this.ysp < 0 && this.ysp > -4) {
                if (Math.abs(this.xsp) > 0.125)
                    this.xsp *= 0.96875;
            }
            if (this.ysp > 16)
                this.ysp = 16;
        }
        if (this.wasInAir && this.jumping) {

        }
        else if (this.jumping && !this.wasJumping) {
            this.wasJumping = true;
            if (this.ducking) {
                this.spinDash = true;
                this.spinDashSpeed += 2;
                if (this.spinDashSpeed > 8)
                    this.spinDashSpeed = 8;
                this.spriteState = "spindash0";
            }
            else {
                this.inAir = true;
                this.currentlyBall = true;
                this.xsp = physics.Jmp * Help.Sin(this.angle) + this.gsp * Help.Cos(this.angle);
                this.ysp = physics.Jmp * Help.Cos(this.angle);
                if (Math.abs(this.xsp) < .17)
                    this.xsp = 0;
            }
        }
        if (!this.inAir) {
            if (this.spinDash)
                this.gsp = 0;
            this.xsp = this.gsp * Help.Cos(this.angle);
            this.ysp = this.gsp * -Help.Sin(this.angle);
            if (Math.abs(this.gsp) < 2.5 && this.mode != RotationMode.Floor) {
                if (this.mode == RotationMode.RightWall)
                    this.x += 0;
                else if (this.mode == RotationMode.LeftWall)
                    this.x += 0;
                else if (this.mode == RotationMode.Ceiling)
                    this.y += 0;
                let oldMode = this.mode;
                this.UpdateMode();
                this.mode = RotationMode.Floor;
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
        this.x = ((this.sonicLevel.LevelWidth * 128) + (this.x + this.xsp)) % (this.sonicLevel.LevelWidth * 128);
        this.y = ((this.sonicLevel.LevelHeight * 128) + (this.y + this.ysp)) % (this.sonicLevel.LevelHeight * 128);
    }
    public Draw(canvas: CanvasRenderingContext2D): void {
        let fx = (this.x);
        let fy = (this.y);
        if (this.Invulnerable())
            return
        let cur = SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
        if (cur == null) {
        }
        if (Help.IsLoaded(cur)) {
            canvas.save();
            let offset = this.GetOffsetFromImage();
            canvas.translate((fx - SonicManager.instance.windowLocation.X + offset.X),
                ((fy - SonicManager.instance.windowLocation.Y + offset.Y)));
            if (SonicManager.instance.showHeightMap) {
                canvas.save();
                let mul = 6;
                let xj = this.xsp * mul;
                let yj = this.ysp * mul;
                canvas.beginPath();
                canvas.moveTo(0, 0);
                canvas.lineTo(xj, yj);
                canvas.fillStyle = "rgba(163,241,255,0.8)";
                canvas.arc(xj, yj, 5, 0, 2 * Math.PI, true);
                canvas.closePath();
                canvas.lineWidth = 6;
                canvas.strokeStyle = "white";
                canvas.stroke();
                canvas.lineWidth = 3;
                canvas.strokeStyle = "#2448D8";
                canvas.fill();
                canvas.stroke();
                canvas.restore();
            }
            if (!this.facing) {
                canvas.scale(-1, 1);
                if (!this.currentlyBall && !this.spinDash)
                    canvas.rotate(-Help.FixAngle(this.angle));
                canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                if (this.spinDash) {
                    canvas.drawImage(SonicManager.instance.spriteCache.SonicSprites[("spinsmoke" + ((SonicManager.instance.drawTickCount % 14) / 2 | 0))],
                        (-cur.width / 2) - 19,
                        -cur.height / 2 + (offset.Y) - 6,
                        cur.width,
                        cur.height);
                }
            }
            else {
                if (!this.currentlyBall && !this.spinDash)
                    canvas.rotate(Help.FixAngle(this.angle));
                canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                if (this.spinDash) {
                    canvas.drawImage(SonicManager.instance.spriteCache.SonicSprites[("spinsmoke" + ((SonicManager.instance.drawTickCount % 14) / 2 | 0))],
                        (-cur.width / 2) - 19,
                        -cur.height / 2 + (offset.Y) - 6,
                        cur.width,
                        cur.height);
                }
            }
            canvas.restore();
            if (SonicManager.instance.showHeightMap)
                this.SensorManager.Draw(canvas, this);
            for (let i = 0; i < this.haltSmoke.length; i++) {
                let lo = this.haltSmoke[i];
                canvas.drawImage(SonicManager.instance.spriteCache.SonicSprites[("haltsmoke" + ((SonicManager.instance.drawTickCount % (4 * 6)) / 6 | 0))],
                    ((lo.X - SonicManager.instance.windowLocation.X - 15)),
                    ((lo.Y + 12 - SonicManager.instance.windowLocation.Y + offset.Y)));
                if ((((SonicManager.instance.drawTickCount + 6) % (4 * 6)) / 6 | 0) == 0) {
                     this.haltSmoke.splice(i, 1);
                }
            }
        }
    }
    public DrawUI(canvas: CanvasRenderingContext2D, pos: Point): void {
        canvas.save();
        {
            if (canvas.font != "13pt Arial bold")
                canvas.font = "13pt Arial bold";
            canvas.fillStyle = "White";
            canvas.fillText("Rings: " + this.rings, pos.X + 90, pos.Y + 45);
            canvas.fillText("Angle: " + this.angle.toString(16), pos.X + 90, pos.Y + 75);
            canvas.fillText("Position: " + (this.x) + ", " + (this.y), pos.X + 90, pos.Y + 105);
            canvas.fillText("Speed: g: " + this.gsp.toFixed(3) + " x:" + this.xsp.toFixed(3) + " y:" + this.ysp.toFixed(3), pos.X + 90, pos.Y + 135);
            canvas.fillText("Mode: " + this.mode.toString(), pos.X + 90, pos.Y + 165);
            canvas.fillText("Multiplier: " + this.watcher.mult, pos.X + 90, pos.Y + 195);
            if (this.inAir)
                canvas.fillText("Air ", pos.X + 220, pos.Y + 45);
            if (this.hLock > 0)
                canvas.fillText("HLock: " + this.hLock, pos.X + 90, pos.Y + 195);
        }
        canvas.restore();
    }
    public Hit(x: number, y: number): void {
        if (SonicManager.instance.drawTickCount - this.sonicLastHitTick < 120)
            return
        this.justHit = true;
        this.ysp = -4;
        this.xsp = 2 * ((this.x - x) < 0 ? -1 : 1);
        this.sonicLastHitTick = SonicManager.instance.drawTickCount;
        let t = 0;
        let angle = 101.25;
        let n = false;
        let speed = 4;
        while (t < this.rings) {
            let ring = new Ring(true);
            SonicManager.instance.activeRings.push(ring);
            ring.X = this.x | 0;
            ring.Y = this.y - 10 | 0;
            ring.Ysp = -Math.sin(angle) * speed;
            ring.Xsp = Math.cos(angle) * speed;
            if (n) {
                ring.Ysp *= -1;
                angle += 22.5;
            }
            n = !n;
            t++;
            if (t == 16) {
                speed = 2;
                angle = 101.25;
            }
        }
        this.rings = 0;
    }
    public Debug(): void {
        this.debugging = !this.debugging;
        this.xsp = 0;
        this.gsp = 0;
        this.ysp = 0;
        this.spriteState = "normal";
    }
    public PressUp(): void {
        this.holdingUp = true;
    }
    public ReleaseUp(): void {
        this.holdingUp = false;
    }
    public PressCrouch(): void {
        this.crouching = true;
    }
    public ReleaseCrouch(): void {
        this.crouching = false;
    }
    public PressLeft(): void {
        this.holdingLeft = true;
    }
    public ReleaseLeft(): void {
        this.holdingLeft = false;
    }
    public PressRight(): void {
        this.holdingRight = true;
    }
    public ReleaseRight(): void {
        this.holdingRight = false;
    }
    public PressJump(): void {
        this.jumping = true;
    }
    public ReleaseJump(): void {
        this.jumping = false;
    }
    private objectCollision: Point = new Point(0, 0);
    public CheckCollisionWithObjects(x: number, y: number, letter: string): boolean {
        this.objectCollision.X = x;
        this.objectCollision.Y = y;
        let me = this.objectCollision;
        let levelObjectInfos = SonicManager.instance.inFocusObjects;
        for (let ob of levelObjectInfos) {
            let dj = ob.Collides(me);
            let dj2 = ob.HurtsSonic(me);
            if (dj)
                return ob.Collide(this, letter, dj);
            if (dj2)
                return ob.HurtSonic(this, letter, dj2);
        }
        return false;
    }
    private ringCollisionRect: Rectangle = new Rectangle(0, 0, 0, 0);
    public CheckCollisionWithRings(): void {
        let me = this.myRec;
        this.ringCollisionRect.X = 0;
        this.ringCollisionRect.Y = 0;
        this.ringCollisionRect.Width = 8 * 2;
        this.ringCollisionRect.Height = 8 * 2;
        let rings: Ring[] = SonicManager.instance.sonicLevel.Rings;
        for (let index: number = 0; index < rings.length; index++) {
            let ring = rings[index];
            let pos = ring;
            if (this.obtainedRing[index])
                continue;
            this.ringCollisionRect.X = pos.X;
            this.ringCollisionRect.Y = pos.Y;
            if (IntersectingRectangle.IntersectRect(me, this.ringCollisionRect)) {
                this.rings++;
                this.obtainedRing[index] = true;
            }
        }
    }
    public CheckCollisionLine(p0: number, p1: number, p2: number, p3: number): SensorM {
        return null;
    }
}
export class Watcher {
    private lastTick: number = 0;
    public mult: number = 1;
    public Tick(): void {
        if (true || SonicManager.instance.inHaltMode) {
            this.mult = 1;
            return
        }
        let ticks = new Date().getTime();
        let offset: number = 0;
        if (this.lastTick == 0)
            offset = 16;
        else offset = ticks - this.lastTick;
        this.lastTick = ticks;
        this.mult = (offset / 16) | 0;
    }
    public Multiply(v: number): number {
        return this.mult * v;
    }
}