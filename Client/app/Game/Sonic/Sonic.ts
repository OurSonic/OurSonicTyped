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

    public Watcher: Watcher;
    public Ticking: boolean=false;
    public X: number = 0;
    public Y: number = 0;
    public Rings: number = 0;
    public Debugging: boolean=false;
    public Jumping: boolean = false;
    public Crouching: boolean = false;
    public HoldingLeft: boolean = false;
    public HoldingRight: boolean = false;
    public HoldingUp: boolean = false;
    public Xsp: number = 0;
    public Ysp: number = 0;
    public Gsp: number = 0;
    public Rolling: boolean = false;
    public InAir: boolean = false;
    public WasInAir: boolean = false;
    public HoldingJump: boolean = false;
    public JustHit: boolean = false;
    public HLock: number = 0;
    public Mode: RotationMode=RotationMode.Floor;
    public Facing: boolean = false;
    public Breaking: number = 0;
    public Ducking: boolean = false;
    public SpinDash: boolean = false;
    public SpinDashSpeed: number = 0;
    public Angle: number = 0;
    protected CurrentlyBall: boolean = false;
    protected SpriteState: string;
    protected HaltSmoke: Point[];

    public WasJumping: boolean;
    constructor() {
        this.Watcher = new Watcher();
        this.physicsVariables = SonicConstants.Sonic();
        let sonicManager = SonicManager.Instance;
        this.sonicLevel = sonicManager.SonicLevel;
        this.X = this.sonicLevel.StartPositions[0].X;
        this.Y = this.sonicLevel.StartPositions[0].Y;
        this.SensorManager = new SensorManager();
        this.HaltSmoke = new Array<Point>();
        this.Rings = 7;
        this.SensorManager.CreateVerticalSensor("a", -9, 0, 36, "#F202F2");
        this.SensorManager.CreateVerticalSensor("b", 9, 0, 36, "#02C2F2");
        this.SensorManager.CreateVerticalSensor("c", -9, 0, -20, "#2D2C21");
        this.SensorManager.CreateVerticalSensor("d", 9, 0, -20, "#C24222");
        this.SensorManager.CreateHorizontalSensor("m1", 4, 0, -12, "#212C2E");
        this.SensorManager.CreateHorizontalSensor("m2", 4, 0, 13, "#22Ffc1");
        this.SpriteState = "normal";
        this.myRec = new Rectangle(0, 0, 0, 0);
        this.sonicLastHitTick = -100000;
    }
    public UpdateMode(): void {
        if (this.Angle <= 0x22 || this.Angle >= 0xDE)
            this.Mode = RotationMode.Floor;
        else if (this.Angle > 0x22 && this.Angle < 0x59)
            this.Mode = RotationMode.LeftWall;
        else if (this.Angle >= 0x59 && this.Angle < 0xA1)
            this.Mode = RotationMode.Ceiling;
        else if (this.Angle > 0xA1 && this.Angle < 0xDE)
            this.Mode = RotationMode.RightWall;
        this.myRec.X = (this.X - 10) | 0;
        this.myRec.Y = (this.Y - 20) | 0;
        this.myRec.Width = 10 * 2;
        this.myRec.Height = 20 * 2;
        if (this.InAir)
            this.Mode = RotationMode.Floor;
    }
    public Tick(sonicLevel: SonicLevel): void {
        if (this.Debugging) {
            let debugSpeed = this.Watcher.Multiply(15);
            if (this.HoldingRight)
                this.X += debugSpeed;
            if (this.HoldingLeft)
                this.X -= debugSpeed;
            if (this.Crouching)
                this.Y += debugSpeed;
            if (this.HoldingUp)
                this.Y -= debugSpeed;
            this.X = ((sonicLevel.LevelWidth * 128) + (this.X)) % (sonicLevel.LevelWidth * 128);
            this.Y = ((sonicLevel.LevelHeight * 128) + (this.Y)) % (sonicLevel.LevelHeight * 128);
            return
        }
        this.UpdateMode();
        if (this.HLock > 0) {
            this.HLock--;
            this.HoldingRight = false;
            this.HoldingLeft = false;
        }
        if (this.InAir) {
            if (this.Angle != 0xff) {
                this.Angle = (0xff + (this.Angle + ((this.Angle > 0xff / 2) ? 2 : -2))) % 0xff;
                if (this.Angle >= 0xfd || this.Angle <= 0x01)
                    this.Angle = 0xff;
            }
        }
        this.EffectPhysics();
        this.CheckCollisionWithRings();
        this.UpdateSprite();
        this.SensorManager.Check(this);
        let sensorM1 = this.SensorManager.GetResult("m1");
        let sensorM2 = this.SensorManager.GetResult("m2");
        let best = this.GetBestSensor(sensorM1, sensorM2, this.Mode);
        if (best != null) {
            switch (this.Mode) {
                case RotationMode.Floor:
                    this.X = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? 12 : -12)));
                    this.Gsp = 0;
                    if (this.InAir)
                        this.Xsp = 0;
                    break;
                case RotationMode.LeftWall:
                    this.Y = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? 12 : -12)));
                    if (this.InAir)
                        this.Xsp = 0;
                    break;
                case RotationMode.Ceiling:
                    this.X = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? -12 : 12)));
                    this.Gsp = 0;
                    if (this.InAir)
                        this.Xsp = 0;
                    break;
                case RotationMode.RightWall:
                    this.Y = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? -12 : 12)));
                    this.Gsp = 0;
                    if (this.InAir)
                        this.Xsp = 0;
                    break;
            }
        }
        this.SensorManager.Check(this);
        let sensorA = this.SensorManager.GetResult("a");
        let sensorB = this.SensorManager.GetResult("b");
        let fy: number;
        let fx: number;
        let hSize = this.GetHalfImageSize();
        if (!this.InAir) {
            best = this.GetBestSensor(sensorA, sensorB, this.Mode);
            if (best == null)
                this.InAir = true;
            else {
                this.JustHit = false;
                switch (this.Mode) {
                    case RotationMode.Floor:
                        best.Chosen = true;
                        this.Angle = best.Angle;
                        this.Y = fy = best.Value - hSize.Y;
                        break;
                    case RotationMode.LeftWall:
                        best.Chosen = true;
                        this.Angle = best.Angle;
                        this.X = fx = best.Value + hSize.X;
                        break;
                    case RotationMode.Ceiling:
                        best.Chosen = true;
                        this.Angle = best.Angle;
                        this.Y = fy = best.Value + hSize.Y;
                        break;
                    case RotationMode.RightWall:
                        best.Chosen = true;
                        this.Angle = best.Angle;
                        this.X = fx = best.Value - hSize.X;
                        break;
                }
            }
            this.UpdateMode();
        }
        else {
            if (sensorA == null && sensorB == null)
                this.InAir = true;
            else {
                if ((sensorA != null && sensorA.Value >= 0) && (sensorB != null && sensorB.Value >= 0)) {
                    if (sensorA.Value < sensorB.Value) {
                        if (this.Y + (20) >= sensorA.Value) {
                            this.Angle = sensorA.Angle;
                            this.Y = fy = sensorA.Value - hSize.Y;
                            this.Rolling = this.CurrentlyBall = false;
                            this.InAir = false;
                        }
                    }
                    else {
                        if (sensorB.Value > -1) {
                            if (this.Y + (20) >= sensorB.Value) {
                                this.Angle = sensorB.Angle;
                                this.Y = fy = sensorB.Value - hSize.Y;
                                this.Rolling = this.CurrentlyBall = false;
                                this.InAir = false;
                            }
                        }
                    }
                }
                else if ((sensorA != null) && sensorA.Value > -1) {
                    if (this.Y + (20) >= sensorA.Value) {
                        this.Angle = sensorA.Angle;
                        this.Y = fy = sensorA.Value - hSize.Y;
                        this.Rolling = this.CurrentlyBall = false;
                        this.InAir = false;
                    }
                }
                else if (sensorB != null && sensorB.Value > -1) {
                    if (this.Y + (20) >= sensorB.Value) {
                        this.Angle = sensorB.Angle;
                        this.Y = fy = sensorB.Value - hSize.Y;
                        this.Rolling = this.CurrentlyBall = false;
                        this.InAir = false;
                    }
                }
            }
            this.UpdateMode();
            let cur = SonicManager.Instance.SpriteCache.SonicSprites[this.SpriteState];
            let __h = cur.height / 2;
            this.SensorManager.Check(this);
            let sensorC = this.SensorManager.GetResult("c");
            let sensorD = this.SensorManager.GetResult("d");
            if ((sensorC == null && sensorD == null)) {

            }
            else {
                if (sensorD != null && (sensorC != null) && (sensorC.Value >= 0 && sensorD.Value >= 0)) {
                    if (sensorC.Value < sensorD.Value) {
                        if (this.Y + (__h) >= sensorC.Value) {
                            if (this.Ysp < 0) {
                                if (sensorC.Angle > 0x40 && sensorC.Angle < 0xC0) {
                                    this.Angle = sensorC.Angle;
                                    this.Gsp = this.Ysp;
                                    this.InAir = false;
                                    this.WasInAir = false;
                                }
                                else this.Ysp = 0;
                                this.Y = fy = sensorC.Value + __h;
                            }
                        }
                    }
                    else {
                        if (this.Y + (__h) >= sensorD.Value) {
                            if (this.Ysp < 0) {
                                if (sensorD.Angle > 0x40 && sensorD.Angle < 0xC0) {
                                    this.Angle = sensorD.Angle;
                                    this.Gsp = -this.Ysp;
                                    this.InAir = false;
                                    this.WasInAir = false;
                                }
                                else this.Ysp = 0;
                                this.Y = fy = sensorD.Value + __h;
                            }
                        }
                    }
                }
                else if (sensorC != null && sensorC.Value > -1) {
                    if (this.Y + (__h) >= sensorC.Value) {
                        if (this.Ysp < 0) {
                            if (sensorC.Angle > 0x40 && sensorC.Angle < 0xC0) {
                                this.Angle = sensorC.Angle;
                                this.Gsp = this.Ysp;
                                this.InAir = false;
                                this.WasInAir = false;
                            }
                            else this.Ysp = 0;
                            this.Y = fy = sensorC.Value + __h;
                        }
                    }
                }
                else if (sensorD != null && sensorD.Value > -1) {
                    if (this.Y + (__h) >= sensorD.Value) {
                        if (this.Ysp < 0) {
                            if (sensorD.Angle > 0x40 && sensorD.Angle < 0xC0) {
                                this.Angle = sensorD.Angle;
                                this.Gsp = -this.Ysp;
                                this.InAir = false;
                                this.WasInAir = false;
                            }
                            else this.Ysp = 0;
                            this.Y = fy = sensorD.Value + __h;
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
        let mc = SonicManager.Instance.DrawTickCount - this.sonicLastHitTick;
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
        let cur = SonicManager.Instance.SpriteCache.SonicSprites[this.SpriteState];
        let xOffset = 0;
        let yOffset = 0;
        if (cur.height != 40) {
            let n: number;
            switch (this.Mode) {
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
        let absgsp = Math.abs(this.Gsp);
        let word = this.SpriteState.substring(0, this.SpriteState.length - 1);
        let j = parseInt(this.SpriteState.substring(this.SpriteState.length - 1, this.SpriteState.length));
        if (this.Breaking > 0) {
            if (this.Gsp > 0 || this.Gsp == 0 || this.SpriteState == "breaking3") {
                this.Facing = false;
                this.Breaking = 0;
            }
        }
        else if (this.Breaking < 0) {
            if (this.Gsp < 0 || this.Gsp == 0 || this.SpriteState == "breaking3") {
                this.Breaking = 0;
                this.Facing = true;
            }
        }
        let epsilon = 0.00001;
        if (this.JustHit) {
            if (word != "hit") {
                this.SpriteState = "hit0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0))
                this.SpriteState = "hit1";
        }
        else if (this.SpinDash) {
            if (word != "spindash") {
                this.SpriteState = "spindash0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % Math.floor(2 - absgsp) | 0) == 0)
                this.SpriteState = "spindash" + ((j + 1) % 6);
        }
        else if (Math.abs(absgsp - 0) < epsilon && !this.InAir) {
            if (this.Ducking) {
                if (word != "duck") {
                    this.SpriteState = "duck0";
                    this.runningTick = 1;
                }
                else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                    this.SpriteState = "duck1";
            }
            else if (this.HoldingUp) {
                if (word != "lookingup") {
                    this.SpriteState = "lookingup0";
                    this.runningTick = 1;
                }
                else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                    this.SpriteState = "lookingup1";
            }
            else {
                this.SpriteState = "normal";
                this.CurrentlyBall = false;
                this.Rolling = false;
                this.runningTick = 0;
            }
        }
        else if (this.Breaking != 0) {
            if (word != "breaking") {
                this.SpriteState = "breaking0";
                this.runningTick = 1;
            }
            else if ((this.runningTick++) % (7) == 0) {
                this.SpriteState = "breaking" + ((j + 1) % 4);
                if (j == 0)
                    this.HaltSmoke.push(new Point(this.X, this.Y));
            }
        }
        else if (this.CurrentlyBall) {
            if (word != "balls") {
                this.SpriteState = "balls0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (<number>Math.floor(8 - absgsp)) == 0) || (8 - absgsp < 1))
                this.SpriteState = "balls" + ((j + 1) % 5);
        }
        else if (absgsp < 6) {
            if (word != "running") {
                this.SpriteState = "running0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                this.SpriteState = "running" + ((j + 1) % 8);
        }
        else if (absgsp >= 6) {
            if (word != "fastrunning") {
                this.SpriteState = "fastrunning0";
                this.runningTick = 1;
            }
            else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                this.SpriteState = "fastrunning" + ((j + 1) % 4);
        }
    }
    private EffectPhysics(): void {
        this.Watcher.Tick();
        let physics = this.physicsVariables;
        let max = physics.TopSpeed;
        if (!this.Jumping) {
            if (!this.InAir && this.WasJumping)
                this.WasJumping = false;
        }
        if (this.InAir && !this.WasInAir) {
            this.WasInAir = true;
            let offset = this.GetOffsetFromImage();
        }
        if (!this.InAir && this.WasInAir) {
            this.WasInAir = false;
            if ((this.Angle >= 0xF0 || this.Angle <= 0x0F))
                this.Gsp = (this.Xsp);
            else if ((this.Angle > 0xE2 && this.Angle <= 0xEF) || (this.Angle >= 0x10 && this.Angle <= 0x1F))
                this.Gsp = (this.Ysp);
            else if ((this.Angle >= 0xC0 && this.Angle <= 0xE2))
                this.Gsp = (-this.Ysp);
            else if ((this.Angle >= 0x20 && this.Angle <= 0x3F))
                this.Gsp = (this.Ysp);
            this.Xsp = 0;
            this.Ysp = 0;
        }
        if (!this.InAir && !this.Rolling && !this.SpinDash) {
            if (!this.HoldingLeft && !this.HoldingRight && !this.JustHit) {
                this.Gsp -= (Math.min(Math.abs(this.Gsp), this.Watcher.Multiply(physics.Frc)) * (this.Gsp > 0 ? 1 : -1));
            }
            this.oldSign = Help.Sign(this.Gsp);
            this.Gsp += this.Watcher.Multiply(physics.Slp) * -Help.Sin(this.Angle);
            if (this.oldSign != Help.Sign(this.Gsp) && this.oldSign != 0)
                this.HLock = 30;
            if (this.HoldingRight && !this.HoldingLeft && !this.JustHit) {
                this.Facing = true;
                if (this.Gsp >= 0) {
                    this.Gsp += this.Watcher.Multiply(physics.Acc);
                    if (this.Gsp > max)
                        this.Gsp = max;
                }
                else {
                    this.Gsp += this.Watcher.Multiply(physics.Dec);
                    if (Math.abs(this.Gsp) > 4.5) {
                        this.Facing = false;
                        this.Breaking = 1;
                        this.runningTick = 0;
                    }
                }
            }
            if (this.HoldingLeft && !this.HoldingRight && !this.JustHit) {
                this.Facing = false;
                if (this.Gsp <= 0) {
                    this.Gsp -= this.Watcher.Multiply(physics.Acc);
                    if (this.Gsp < -max)
                        this.Gsp = -max;
                }
                else {
                    this.Gsp -= this.Watcher.Multiply(physics.Dec);
                    if (Math.abs(this.Gsp) > 4.5) {
                        this.Facing = true;
                        this.Breaking = -1;
                        this.runningTick = 0;
                    }
                }
            }
        }
        this.Ducking = false;
        if (this.Crouching) {
            if (Math.abs(this.Gsp) > 1.03125) {
                this.Rolling = true;
                this.CurrentlyBall = true;
            }
            else this.Ducking = true;
        }
        else {
            if (this.SpinDash) {
                this.Gsp = (8 + Help.Floor(this.SpinDashSpeed) / 2) * (this.Facing ? 1 : -1);
                this.SpinDash = false;
                this.Rolling = true;
                this.CurrentlyBall = true;
            }
        }
        if (!this.InAir && this.Rolling) {
            if (this.HoldingLeft && !this.JustHit) {
                if (this.Gsp > 0) {
                    if (this.Rolling)
                        this.Gsp = (Help.Max(0, this.Gsp - this.Watcher.Multiply(physics.Rdec)));
                }
            }
            if (this.HoldingRight && !this.JustHit) {
                if (this.Gsp < 0) {
                    if (this.Rolling)
                        this.Gsp = (Help.Min(0, this.Gsp + this.Watcher.Multiply(physics.Rdec)));
                }
            }
            this.Gsp -= (Math.min(Math.abs(this.Gsp), this.Watcher.Multiply(physics.Rfrc)) * (this.Gsp > 0 ? 1 : -1));
            this.oldSign = Help.Sign(this.Gsp);
            let ang = Help.Sin(this.Angle);
            if ((ang > 0) == (this.Gsp > 0))
                this.Gsp += this.Watcher.Multiply(-physics.SlpRollingUp) * ang;
            else this.Gsp += this.Watcher.Multiply(-physics.SlpRollingDown) * ang;
            if (this.Gsp > max * 2.5)
                this.Gsp = max * 2.5;
            if (this.Gsp < -max * 2.5)
                this.Gsp = -max * 2.5;
            if (this.oldSign != Help.Sign(this.Gsp) && this.oldSign != 0)
                this.HLock = 30;
            if (Math.abs(this.Gsp) < 0.53125) {
                this.Rolling = false;
                this.CurrentlyBall = false;
            }
        }
        if (this.InAir) {
            if (this.HoldingRight && !this.HoldingLeft && !this.JustHit) {
                this.Facing = true;
                if (this.Xsp >= 0) {
                    this.Xsp += this.Watcher.Multiply(physics.Air);
                    if (this.Xsp > max)
                        this.Xsp = max;
                }
                else {
                    this.Xsp += this.Watcher.Multiply(physics.Air);
                }
            }
            if (this.HoldingLeft && !this.HoldingRight && !this.JustHit) {
                this.Facing = false;
                if (this.Xsp <= 0) {
                    this.Xsp -= this.Watcher.Multiply(physics.Air);
                    if (this.Xsp < -max)
                        this.Xsp = -max;
                }
                else {
//                    this.Xsp -= this.Watcher.Multiply(physics.Air);
                }
            }
            if (this.WasInAir)
                if (this.Jumping) {

                }
                else {

                }
            this.Ysp += this.JustHit ? 0.1875 : physics.Grv;
            if (this.Ysp < 0 && this.Ysp > -4) {
                if (Math.abs(this.Xsp) > 0.125)
                    this.Xsp *= 0.96875;
            }
            if (this.Ysp > 16)
                this.Ysp = 16;
        }
        if (this.WasInAir && this.Jumping) {

        }
        else if (this.Jumping && !this.WasJumping) {
            this.WasJumping = true;
            if (this.Ducking) {
                this.SpinDash = true;
                this.SpinDashSpeed += 2;
                if (this.SpinDashSpeed > 8)
                    this.SpinDashSpeed = 8;
                this.SpriteState = "spindash0";
            }
            else {
                this.InAir = true;
                this.CurrentlyBall = true;
                this.Xsp = physics.Jmp * Help.Sin(this.Angle) + this.Gsp * Help.Cos(this.Angle);
                this.Ysp = physics.Jmp * Help.Cos(this.Angle);
                if (Math.abs(this.Xsp) < .17)
                    this.Xsp = 0;
            }
        }
        if (!this.InAir) {
            if (this.SpinDash)
                this.Gsp = 0;
            this.Xsp = this.Gsp * Help.Cos(this.Angle);
            this.Ysp = this.Gsp * -Help.Sin(this.Angle);
            if (Math.abs(this.Gsp) < 2.5 && this.Mode != RotationMode.Floor) {
                if (this.Mode == RotationMode.RightWall)
                    this.X += 0;
                else if (this.Mode == RotationMode.LeftWall)
                    this.X += 0;
                else if (this.Mode == RotationMode.Ceiling)
                    this.Y += 0;
                let oldMode = this.Mode;
                this.UpdateMode();
                this.Mode = RotationMode.Floor;
                this.HLock = 30;
                this.InAir = true;
            }
        }
        if (this.Xsp > 0 && this.Xsp < 0.008) {
            this.Gsp = 0;
            this.Xsp = 0;
        }
        if (this.Xsp < 0 && this.Xsp > -0.008) {
            this.Gsp = 0;
            this.Xsp = 0;
        }
        this.X = ((this.sonicLevel.LevelWidth * 128) + (this.X + this.Xsp)) % (this.sonicLevel.LevelWidth * 128);
        this.Y = ((this.sonicLevel.LevelHeight * 128) + (this.Y + this.Ysp)) % (this.sonicLevel.LevelHeight * 128);
    }
    public Draw(canvas: CanvasRenderingContext2D): void {
        let fx = (this.X);
        let fy = (this.Y);
        if (this.Invulnerable())
            return
        let cur = SonicManager.Instance.SpriteCache.SonicSprites[this.SpriteState];
        if (cur == null) {
        }
        if (Help.IsLoaded(cur)) {
            canvas.save();
            let offset = this.GetOffsetFromImage();
            canvas.translate((fx - SonicManager.Instance.WindowLocation.X + offset.X),
                ((fy - SonicManager.Instance.WindowLocation.Y + offset.Y)));
            if (SonicManager.Instance.ShowHeightMap) {
                canvas.save();
                let mul = 6;
                let xj = this.Xsp * mul;
                let yj = this.Ysp * mul;
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
            if (!this.Facing) {
                canvas.scale(-1, 1);
                if (!this.CurrentlyBall && !this.SpinDash)
                    canvas.rotate(-Help.FixAngle(this.Angle));
                canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                if (this.SpinDash) {
                    canvas.drawImage(SonicManager.Instance.SpriteCache.SonicSprites[("spinsmoke" + ((SonicManager.Instance.DrawTickCount % 14) / 2 | 0))],
                        (-cur.width / 2) - 19,
                        -cur.height / 2 + (offset.Y) - 6,
                        cur.width,
                        cur.height);
                }
            }
            else {
                if (!this.CurrentlyBall && !this.SpinDash)
                    canvas.rotate(Help.FixAngle(this.Angle));
                canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                if (this.SpinDash) {
                    canvas.drawImage(SonicManager.Instance.SpriteCache.SonicSprites[("spinsmoke" + ((SonicManager.Instance.DrawTickCount % 14) / 2 | 0))],
                        (-cur.width / 2) - 19,
                        -cur.height / 2 + (offset.Y) - 6,
                        cur.width,
                        cur.height);
                }
            }
            canvas.restore();
            if (SonicManager.Instance.ShowHeightMap)
                this.SensorManager.Draw(canvas, this);
            for (let i = 0; i < this.HaltSmoke.length; i++) {
                let lo = this.HaltSmoke[i];
                canvas.drawImage(SonicManager.Instance.SpriteCache.SonicSprites[("haltsmoke" + ((SonicManager.Instance.DrawTickCount % (4 * 6)) / 6 | 0))],
                    ((lo.X - SonicManager.Instance.WindowLocation.X - 15)),
                    ((lo.Y + 12 - SonicManager.Instance.WindowLocation.Y + offset.Y)));
                if ((((SonicManager.Instance.DrawTickCount + 6) % (4 * 6)) / 6 | 0) == 0) {
                     this.HaltSmoke.splice(i, 1);
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
            canvas.fillText("Rings: " + this.Rings, pos.X + 90, pos.Y + 45);
            canvas.fillText("Angle: " + this.Angle.toString(16), pos.X + 90, pos.Y + 75);
            canvas.fillText("Position: " + (this.X) + ", " + (this.Y), pos.X + 90, pos.Y + 105);
            canvas.fillText("Speed: g: " + this.Gsp.toFixed(3) + " x:" + this.Xsp.toFixed(3) + " y:" + this.Ysp.toFixed(3), pos.X + 90, pos.Y + 135);
            canvas.fillText("Mode: " + this.Mode.toString(), pos.X + 90, pos.Y + 165);
            canvas.fillText("Multiplier: " + this.Watcher.mult, pos.X + 90, pos.Y + 195);
            if (this.InAir)
                canvas.fillText("Air ", pos.X + 220, pos.Y + 45);
            if (this.HLock > 0)
                canvas.fillText("HLock: " + this.HLock, pos.X + 90, pos.Y + 195);
        }
        canvas.restore();
    }
    public Hit(x: number, y: number): void {
        if (SonicManager.Instance.DrawTickCount - this.sonicLastHitTick < 120)
            return
        this.JustHit = true;
        this.Ysp = -4;
        this.Xsp = 2 * ((this.X - x) < 0 ? -1 : 1);
        this.sonicLastHitTick = SonicManager.Instance.DrawTickCount;
        let t = 0;
        let angle = 101.25;
        let n = false;
        let speed = 4;
        while (t < this.Rings) {
            let ring = new Ring(true);
            SonicManager.Instance.ActiveRings.push(ring);
            ring.X = this.X | 0;
            ring.Y = this.Y - 10 | 0;
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
        this.Rings = 0;
    }
    public Debug(): void {
        this.Debugging = !this.Debugging;
        this.Xsp = 0;
        this.Gsp = 0;
        this.Ysp = 0;
        this.SpriteState = "normal";
    }
    public PressUp(): void {
        this.HoldingUp = true;
    }
    public ReleaseUp(): void {
        this.HoldingUp = false;
    }
    public PressCrouch(): void {
        this.Crouching = true;
    }
    public ReleaseCrouch(): void {
        this.Crouching = false;
    }
    public PressLeft(): void {
        this.HoldingLeft = true;
    }
    public ReleaseLeft(): void {
        this.HoldingLeft = false;
    }
    public PressRight(): void {
        this.HoldingRight = true;
    }
    public ReleaseRight(): void {
        this.HoldingRight = false;
    }
    public PressJump(): void {
        this.Jumping = true;
    }
    public ReleaseJump(): void {
        this.Jumping = false;
    }
    private objectCollision: Point = new Point(0, 0);
    public CheckCollisionWithObjects(x: number, y: number, letter: string): boolean {
        this.objectCollision.X = x;
        this.objectCollision.Y = y;
        let me = this.objectCollision;
        let levelObjectInfos = SonicManager.Instance.InFocusObjects;
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
        let rings: Ring[] = SonicManager.Instance.SonicLevel.Rings;
        for (let index: number = 0; index < rings.length; index++) {
            let ring = rings[index];
            let pos = ring;
            if (this.obtainedRing[index])
                continue;
            this.ringCollisionRect.X = pos.X;
            this.ringCollisionRect.Y = pos.Y;
            if (IntersectingRectangle.IntersectRect(me, this.ringCollisionRect)) {
                this.Rings++;
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
        if (true || SonicManager.Instance.InHaltMode) {
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