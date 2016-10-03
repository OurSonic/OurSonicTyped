System.register(["../../common/Utils", "./SensorManager", "../../common/Enums", "../SonicManager", "../../common/Help", "../level/Ring", "./SonicConstants"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils_1, SensorManager_1, Enums_1, SonicManager_1, Help_1, Ring_1, SonicConstants_1;
    var Sonic, Watcher;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (SensorManager_1_1) {
                SensorManager_1 = SensorManager_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (Ring_1_1) {
                Ring_1 = Ring_1_1;
            },
            function (SonicConstants_1_1) {
                SonicConstants_1 = SonicConstants_1_1;
            }],
        execute: function() {
            Sonic = (function () {
                function Sonic() {
                    this.obtainedRing = {};
                    this.ticking = false;
                    this.x = 0;
                    this.y = 0;
                    this.rings = 0;
                    this.debugging = false;
                    this.jumping = false;
                    this.crouching = false;
                    this.holdingLeft = false;
                    this.holdingRight = false;
                    this.holdingUp = false;
                    this.xsp = 0;
                    this.ysp = 0;
                    this.gsp = 0;
                    this.rolling = false;
                    this.inAir = false;
                    this.wasInAir = false;
                    this.holdingJump = false;
                    this.justHit = false;
                    this.hLock = 0;
                    this.mode = Enums_1.RotationMode.Floor;
                    this.facing = false;
                    this.breaking = 0;
                    this.ducking = false;
                    this.spinDash = false;
                    this.spinDashSpeed = 0;
                    this.angle = 0;
                    this.currentlyBall = false;
                    this.halfSize = new Utils_1.Point(20, 20);
                    this.offsetFromImage = new Utils_1.Point(0, 0);
                    this.objectCollision = new Utils_1.Point(0, 0);
                    this.ringCollisionRect = new Utils_1.Rectangle(0, 0, 0, 0);
                    this.watcher = new Watcher();
                    this.physicsVariables = SonicConstants_1.SonicConstants.Sonic();
                    var sonicManager = SonicManager_1.SonicManager.instance;
                    this.sonicLevel = sonicManager.sonicLevel;
                    this.x = this.sonicLevel.startPositions[0].x;
                    this.y = this.sonicLevel.startPositions[0].y;
                    this.sensorManager = new SensorManager_1.SensorManager();
                    this.haltSmoke = new Array();
                    this.rings = 7;
                    this.sensorManager.createVerticalSensor("a", -9, 0, 36, "#F202F2");
                    this.sensorManager.createVerticalSensor("b", 9, 0, 36, "#02C2F2");
                    this.sensorManager.createVerticalSensor("c", -9, 0, -20, "#2D2C21");
                    this.sensorManager.createVerticalSensor("d", 9, 0, -20, "#C24222");
                    this.sensorManager.createHorizontalSensor("m1", 4, 0, -12, "#212C2E");
                    this.sensorManager.createHorizontalSensor("m2", 4, 0, 13, "#22Ffc1");
                    this.spriteState = "normal";
                    this.myRec = new Utils_1.Rectangle(0, 0, 0, 0);
                    this.sonicLastHitTick = -100000;
                }
                Sonic.prototype.updateMode = function () {
                    if (this.angle <= 0x22 || this.angle >= 0xDE)
                        this.mode = Enums_1.RotationMode.Floor;
                    else if (this.angle > 0x22 && this.angle < 0x59)
                        this.mode = Enums_1.RotationMode.LeftWall;
                    else if (this.angle >= 0x59 && this.angle < 0xA1)
                        this.mode = Enums_1.RotationMode.Ceiling;
                    else if (this.angle > 0xA1 && this.angle < 0xDE)
                        this.mode = Enums_1.RotationMode.RightWall;
                    this.myRec.x = (this.x - 10) | 0;
                    this.myRec.y = (this.y - 20) | 0;
                    this.myRec.Width = 10 * 2;
                    this.myRec.Height = 20 * 2;
                    if (this.inAir)
                        this.mode = Enums_1.RotationMode.Floor;
                };
                Sonic.prototype.tick = function (sonicLevel) {
                    if (this.debugging) {
                        var debugSpeed = this.watcher.Multiply(15);
                        if (this.holdingRight)
                            this.x += debugSpeed;
                        if (this.holdingLeft)
                            this.x -= debugSpeed;
                        if (this.crouching)
                            this.y += debugSpeed;
                        if (this.holdingUp)
                            this.y -= debugSpeed;
                        this.x = ((sonicLevel.levelWidth * 128) + (this.x)) % (sonicLevel.levelWidth * 128);
                        this.y = ((sonicLevel.levelHeight * 128) + (this.y)) % (sonicLevel.levelHeight * 128);
                        return;
                    }
                    this.updateMode();
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
                    this.effectPhysics();
                    this.checkCollisionWithRings();
                    this.updateSprite();
                    this.sensorManager.check(this);
                    var sensorM1 = this.sensorManager.getResult("m1");
                    var sensorM2 = this.sensorManager.getResult("m2");
                    var best = this.getBestSensor(sensorM1, sensorM2, this.mode);
                    if (best != null) {
                        switch (this.mode) {
                            case Enums_1.RotationMode.Floor:
                                this.x = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter === "m1" ? 12 : -12)));
                                this.gsp = 0;
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                            case Enums_1.RotationMode.LeftWall:
                                this.y = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter === "m1" ? 12 : -12)));
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                            case Enums_1.RotationMode.Ceiling:
                                this.x = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter === "m1" ? -12 : 12)));
                                this.gsp = 0;
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                            case Enums_1.RotationMode.RightWall:
                                this.y = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter === "m1" ? -12 : 12)));
                                this.gsp = 0;
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                        }
                    }
                    this.sensorManager.check(this);
                    var sensorA = this.sensorManager.getResult("a");
                    var sensorB = this.sensorManager.getResult("b");
                    var fy;
                    var fx;
                    var hSize = this.getHalfImageSize();
                    if (!this.inAir) {
                        best = this.getBestSensor(sensorA, sensorB, this.mode);
                        if (best == null)
                            this.inAir = true;
                        else {
                            this.justHit = false;
                            switch (this.mode) {
                                case Enums_1.RotationMode.Floor:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.y = fy = best.value - hSize.y;
                                    break;
                                case Enums_1.RotationMode.LeftWall:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.x = fx = best.value + hSize.x;
                                    break;
                                case Enums_1.RotationMode.Ceiling:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.y = fy = best.value + hSize.y;
                                    break;
                                case Enums_1.RotationMode.RightWall:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.x = fx = best.value - hSize.x;
                                    break;
                            }
                        }
                        this.updateMode();
                    }
                    else {
                        if (sensorA == null && sensorB == null)
                            this.inAir = true;
                        else {
                            if ((sensorA != null && sensorA.value >= 0) && (sensorB != null && sensorB.value >= 0)) {
                                if (sensorA.value < sensorB.value) {
                                    if (this.y + (20) >= sensorA.value) {
                                        this.angle = sensorA.angle;
                                        this.y = fy = sensorA.value - hSize.y;
                                        this.rolling = this.currentlyBall = false;
                                        this.inAir = false;
                                    }
                                }
                                else {
                                    if (sensorB.value > -1) {
                                        if (this.y + (20) >= sensorB.value) {
                                            this.angle = sensorB.angle;
                                            this.y = fy = sensorB.value - hSize.y;
                                            this.rolling = this.currentlyBall = false;
                                            this.inAir = false;
                                        }
                                    }
                                }
                            }
                            else if ((sensorA != null) && sensorA.value > -1) {
                                if (this.y + (20) >= sensorA.value) {
                                    this.angle = sensorA.angle;
                                    this.y = fy = sensorA.value - hSize.y;
                                    this.rolling = this.currentlyBall = false;
                                    this.inAir = false;
                                }
                            }
                            else if (sensorB != null && sensorB.value > -1) {
                                if (this.y + (20) >= sensorB.value) {
                                    this.angle = sensorB.angle;
                                    this.y = fy = sensorB.value - hSize.y;
                                    this.rolling = this.currentlyBall = false;
                                    this.inAir = false;
                                }
                            }
                        }
                        this.updateMode();
                        var cur = SonicManager_1.SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
                        var __h = cur.height / 2;
                        this.sensorManager.check(this);
                        var sensorC = this.sensorManager.getResult("c");
                        var sensorD = this.sensorManager.getResult("d");
                        if ((sensorC == null && sensorD == null)) {
                        }
                        else {
                            if (sensorD != null && (sensorC != null) && (sensorC.value >= 0 && sensorD.value >= 0)) {
                                if (sensorC.value < sensorD.value) {
                                    if (this.y + (__h) >= sensorC.value) {
                                        if (this.ysp < 0) {
                                            if (sensorC.angle > 0x40 && sensorC.angle < 0xC0) {
                                                this.angle = sensorC.angle;
                                                this.gsp = this.ysp;
                                                this.inAir = false;
                                                this.wasInAir = false;
                                            }
                                            else
                                                this.ysp = 0;
                                            this.y = fy = sensorC.value + __h;
                                        }
                                    }
                                }
                                else {
                                    if (this.y + (__h) >= sensorD.value) {
                                        if (this.ysp < 0) {
                                            if (sensorD.angle > 0x40 && sensorD.angle < 0xC0) {
                                                this.angle = sensorD.angle;
                                                this.gsp = -this.ysp;
                                                this.inAir = false;
                                                this.wasInAir = false;
                                            }
                                            else
                                                this.ysp = 0;
                                            this.y = fy = sensorD.value + __h;
                                        }
                                    }
                                }
                            }
                            else if (sensorC != null && sensorC.value > -1) {
                                if (this.y + (__h) >= sensorC.value) {
                                    if (this.ysp < 0) {
                                        if (sensorC.angle > 0x40 && sensorC.angle < 0xC0) {
                                            this.angle = sensorC.angle;
                                            this.gsp = this.ysp;
                                            this.inAir = false;
                                            this.wasInAir = false;
                                        }
                                        else
                                            this.ysp = 0;
                                        this.y = fy = sensorC.value + __h;
                                    }
                                }
                            }
                            else if (sensorD != null && sensorD.value > -1) {
                                if (this.y + (__h) >= sensorD.value) {
                                    if (this.ysp < 0) {
                                        if (sensorD.angle > 0x40 && sensorD.angle < 0xC0) {
                                            this.angle = sensorD.angle;
                                            this.gsp = -this.ysp;
                                            this.inAir = false;
                                            this.wasInAir = false;
                                        }
                                        else
                                            this.ysp = 0;
                                        this.y = fy = sensorD.value + __h;
                                    }
                                }
                            }
                            this.updateMode();
                        }
                    }
                };
                Sonic.prototype.getBestSensor = function (sensor1, sensor2, mode) {
                    if (sensor1 == null && sensor2 == null)
                        return null;
                    if (sensor1 == null)
                        return sensor2;
                    if (sensor2 == null)
                        return sensor1;
                    switch (mode) {
                        case Enums_1.RotationMode.Floor:
                            return sensor1.value < sensor2.value ? sensor1 : sensor2;
                        case Enums_1.RotationMode.LeftWall:
                            return sensor1.value > sensor2.value ? sensor1 : sensor2;
                        case Enums_1.RotationMode.Ceiling:
                            return sensor1.value > sensor2.value ? sensor1 : sensor2;
                        case Enums_1.RotationMode.RightWall:
                            return sensor1.value < sensor2.value ? sensor1 : sensor2;
                    }
                    return null;
                };
                Sonic.prototype.invulnerable = function () {
                    var mc = SonicManager_1.SonicManager.instance.drawTickCount - this.sonicLastHitTick;
                    if (mc < 120) {
                        if (mc % 8 < 4)
                            return true;
                    }
                    return false;
                };
                Sonic.prototype.getHalfImageSize = function () {
                    return this.halfSize;
                };
                Sonic.prototype.getOffsetFromImage = function () {
                    var cur = SonicManager_1.SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
                    var xOffset = 0;
                    var yOffset = 0;
                    if (cur.height !== 40) {
                        var n = void 0;
                        switch (this.mode) {
                            case Enums_1.RotationMode.Floor:
                                n = 0;
                                yOffset = (40 - ((cur.height + n))) / 2;
                                break;
                            case Enums_1.RotationMode.LeftWall:
                                n = 15;
                                xOffset = -(40 - ((cur.height + n))) / 2;
                                break;
                            case Enums_1.RotationMode.Ceiling:
                                n = 8;
                                yOffset = -(40 - ((cur.height + n))) / 2;
                                break;
                            case Enums_1.RotationMode.RightWall:
                                n = 9;
                                xOffset = (40 - ((cur.height + n))) / 2;
                                break;
                        }
                    }
                    this.offsetFromImage.x = xOffset;
                    this.offsetFromImage.y = yOffset;
                    return this.offsetFromImage;
                };
                Sonic.prototype.updateSprite = function () {
                    var absgsp = Math.abs(this.gsp);
                    var word = this.spriteState.substring(0, this.spriteState.length - 1);
                    var j = parseInt(this.spriteState.substring(this.spriteState.length - 1, this.spriteState.length));
                    if (this.breaking > 0) {
                        if (this.gsp > 0 || this.gsp === 0 || this.spriteState === "breaking3") {
                            this.facing = false;
                            this.breaking = 0;
                        }
                    }
                    else if (this.breaking < 0) {
                        if (this.gsp < 0 || this.gsp === 0 || this.spriteState === "breaking3") {
                            this.breaking = 0;
                            this.facing = true;
                        }
                    }
                    var epsilon = 0.00001;
                    if (this.justHit) {
                        if (word !== "hit") {
                            this.spriteState = "hit0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) === 0))
                            this.spriteState = "hit1";
                    }
                    else if (this.spinDash) {
                        if (word !== "spindash") {
                            this.spriteState = "spindash0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % Math.floor(2 - absgsp) | 0) === 0)
                            this.spriteState = "spindash" + ((j + 1) % 6);
                    }
                    else if (Math.abs(absgsp - 0) < epsilon && !this.inAir) {
                        if (this.ducking) {
                            if (word !== "duck") {
                                this.spriteState = "duck0";
                                this.runningTick = 1;
                            }
                            else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) === 0)
                                this.spriteState = "duck1";
                        }
                        else if (this.holdingUp) {
                            if (word !== "lookingup") {
                                this.spriteState = "lookingup0";
                                this.runningTick = 1;
                            }
                            else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) === 0)
                                this.spriteState = "lookingup1";
                        }
                        else {
                            this.spriteState = "normal";
                            this.currentlyBall = false;
                            this.rolling = false;
                            this.runningTick = 0;
                        }
                    }
                    else if (this.breaking !== 0) {
                        if (word !== "breaking") {
                            this.spriteState = "breaking0";
                            this.runningTick = 1;
                        }
                        else if ((this.runningTick++) % (7) === 0) {
                            this.spriteState = "breaking" + ((j + 1) % 4);
                            if (j === 0)
                                this.haltSmoke.push(new Utils_1.Point(this.x, this.y));
                        }
                    }
                    else if (this.currentlyBall) {
                        if (word !== "balls") {
                            this.spriteState = "balls0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp)) === 0) || (8 - absgsp < 1))
                            this.spriteState = "balls" + ((j + 1) % 5);
                    }
                    else if (absgsp < 6) {
                        if (word !== "running") {
                            this.spriteState = "running0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) === 0) || (8 - absgsp < 1))
                            this.spriteState = "running" + ((j + 1) % 8);
                    }
                    else if (absgsp >= 6) {
                        if (word !== "fastrunning") {
                            this.spriteState = "fastrunning0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) === 0) || (8 - absgsp < 1))
                            this.spriteState = "fastrunning" + ((j + 1) % 4);
                    }
                };
                Sonic.prototype.effectPhysics = function () {
                    this.watcher.Tick();
                    var physics = this.physicsVariables;
                    var max = physics.topSpeed;
                    if (!this.jumping) {
                        if (!this.inAir && this.wasJumping)
                            this.wasJumping = false;
                    }
                    if (this.inAir && !this.wasInAir) {
                        this.wasInAir = true;
                        var offset = this.getOffsetFromImage();
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
                            this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.frc)) * (this.gsp > 0 ? 1 : -1));
                        }
                        this.oldSign = Help_1.Help.sign(this.gsp);
                        this.gsp += this.watcher.Multiply(physics.slp) * -Help_1.Help.sin(this.angle);
                        if (this.oldSign != Help_1.Help.sign(this.gsp) && this.oldSign != 0)
                            this.hLock = 30;
                        if (this.holdingRight && !this.holdingLeft && !this.justHit) {
                            this.facing = true;
                            if (this.gsp >= 0) {
                                this.gsp += this.watcher.Multiply(physics.acc);
                                if (this.gsp > max)
                                    this.gsp = max;
                            }
                            else {
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
                                if (this.gsp < -max)
                                    this.gsp = -max;
                            }
                            else {
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
                        }
                        else
                            this.ducking = true;
                    }
                    else {
                        if (this.spinDash) {
                            this.gsp = (8 + Help_1.Help.floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
                            this.spinDash = false;
                            this.rolling = true;
                            this.currentlyBall = true;
                        }
                    }
                    if (!this.inAir && this.rolling) {
                        if (this.holdingLeft && !this.justHit) {
                            if (this.gsp > 0) {
                                if (this.rolling)
                                    this.gsp = (Help_1.Help.max(0, this.gsp - this.watcher.Multiply(physics.rdec)));
                            }
                        }
                        if (this.holdingRight && !this.justHit) {
                            if (this.gsp < 0) {
                                if (this.rolling)
                                    this.gsp = (Help_1.Help.min(0, this.gsp + this.watcher.Multiply(physics.rdec)));
                            }
                        }
                        this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.rfrc)) * (this.gsp > 0 ? 1 : -1));
                        this.oldSign = Help_1.Help.sign(this.gsp);
                        var ang = Help_1.Help.sin(this.angle);
                        if ((ang > 0) === (this.gsp > 0))
                            this.gsp += this.watcher.Multiply(-physics.slpRollingUp) * ang;
                        else
                            this.gsp += this.watcher.Multiply(-physics.slpRollingDown) * ang;
                        if (this.gsp > max * 2.5)
                            this.gsp = max * 2.5;
                        if (this.gsp < -max * 2.5)
                            this.gsp = -max * 2.5;
                        if (this.oldSign !== Help_1.Help.sign(this.gsp) && this.oldSign != 0)
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
                                this.xsp += this.watcher.Multiply(physics.air);
                                if (this.xsp > max)
                                    this.xsp = max;
                            }
                            else {
                                this.xsp += this.watcher.Multiply(physics.air);
                            }
                        }
                        if (this.holdingLeft && !this.holdingRight && !this.justHit) {
                            this.facing = false;
                            if (this.xsp <= 0) {
                                this.xsp -= this.watcher.Multiply(physics.air);
                                if (this.xsp < -max)
                                    this.xsp = -max;
                            }
                            else {
                            }
                        }
                        if (this.wasInAir)
                            if (this.jumping) {
                            }
                            else {
                            }
                        this.ysp += this.justHit ? 0.1875 : physics.grv;
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
                            this.xsp = physics.jmp * Help_1.Help.sin(this.angle) + this.gsp * Help_1.Help.cos(this.angle);
                            this.ysp = physics.jmp * Help_1.Help.cos(this.angle);
                            if (Math.abs(this.xsp) < .17)
                                this.xsp = 0;
                        }
                    }
                    if (!this.inAir) {
                        if (this.spinDash)
                            this.gsp = 0;
                        this.xsp = this.gsp * Help_1.Help.cos(this.angle);
                        this.ysp = this.gsp * -Help_1.Help.sin(this.angle);
                        if (Math.abs(this.gsp) < 2.5 && this.mode != Enums_1.RotationMode.Floor) {
                            if (this.mode === Enums_1.RotationMode.RightWall)
                                this.x += 0;
                            else if (this.mode === Enums_1.RotationMode.LeftWall)
                                this.x += 0;
                            else if (this.mode === Enums_1.RotationMode.Ceiling)
                                this.y += 0;
                            var oldMode = this.mode;
                            this.updateMode();
                            this.mode = Enums_1.RotationMode.Floor;
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
                    this.x = ((this.sonicLevel.levelWidth * 128) + (this.x + this.xsp)) % (this.sonicLevel.levelWidth * 128);
                    this.y = ((this.sonicLevel.levelHeight * 128) + (this.y + this.ysp)) % (this.sonicLevel.levelHeight * 128);
                };
                Sonic.prototype.draw = function (canvas) {
                    var fx = (this.x) | 0;
                    var fy = (this.y) | 0;
                    if (this.invulnerable())
                        return;
                    var cur = SonicManager_1.SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
                    if (cur == null) {
                    }
                    if (Help_1.Help.isLoaded(cur)) {
                        canvas.save();
                        var offset = this.getOffsetFromImage();
                        canvas.translate((fx - SonicManager_1.SonicManager.instance.windowLocation.x + offset.x), ((fy - SonicManager_1.SonicManager.instance.windowLocation.y + offset.y)));
                        if (SonicManager_1.SonicManager.instance.showHeightMap) {
                            var mul = 10;
                            var xj = this.xsp * mul;
                            var yj = this.ysp * mul;
                            var distance = Math.sqrt((yj * yj) + (xj * xj));
                            canvas.save();
                            canvas.moveTo(xj, yj);
                            canvas.beginPath();
                            canvas.fillStyle = "rgba(163,241,255,1)";
                            canvas.strokeStyle = "rgba(163,241,255,1)";
                            canvas.arc(xj, yj, distance / 8, 0, 2 * Math.PI, true);
                            canvas.closePath();
                            canvas.fill();
                            canvas.stroke();
                            canvas.restore();
                        }
                        if (!this.facing) {
                            canvas.scale(-1, 1);
                            if (!this.currentlyBall && !this.spinDash)
                                canvas.rotate(-Help_1.Help.fixAngle(this.angle));
                            canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                            if (this.spinDash) {
                                canvas.drawImage(SonicManager_1.SonicManager.instance.spriteCache.SonicSprites[("spinsmoke" + ((SonicManager_1.SonicManager.instance.drawTickCount % 14) / 2 | 0))], (-cur.width / 2) - 19, -cur.height / 2 + (offset.y) - 6, cur.width, cur.height);
                            }
                        }
                        else {
                            if (!this.currentlyBall && !this.spinDash)
                                canvas.rotate(Help_1.Help.fixAngle(this.angle));
                            canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                            if (this.spinDash) {
                                canvas.drawImage(SonicManager_1.SonicManager.instance.spriteCache.SonicSprites[("spinsmoke" + ((SonicManager_1.SonicManager.instance.drawTickCount % 14) / 2 | 0))], (-cur.width / 2) - 19, -cur.height / 2 + (offset.y) - 6, cur.width, cur.height);
                            }
                        }
                        canvas.restore();
                        if (SonicManager_1.SonicManager.instance.showHeightMap)
                            this.sensorManager.draw(canvas, this);
                        for (var i = 0; i < this.haltSmoke.length; i++) {
                            var lo = this.haltSmoke[i];
                            canvas.drawImage(SonicManager_1.SonicManager.instance.spriteCache.SonicSprites[("haltsmoke" + ((SonicManager_1.SonicManager.instance.drawTickCount % (4 * 6)) / 6 | 0))], ((lo.x - SonicManager_1.SonicManager.instance.windowLocation.x - 15)), ((lo.y + 12 - SonicManager_1.SonicManager.instance.windowLocation.y + offset.y)));
                            if ((((SonicManager_1.SonicManager.instance.drawTickCount + 6) % (4 * 6)) / 6 | 0) == 0) {
                                this.haltSmoke.splice(i, 1);
                            }
                        }
                    }
                };
                Sonic.prototype.drawUI = function (canvas, pos) {
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
                };
                Sonic.prototype.hit = function (x, y) {
                    if (SonicManager_1.SonicManager.instance.drawTickCount - this.sonicLastHitTick < 120)
                        return;
                    this.justHit = true;
                    this.ysp = -4;
                    this.xsp = 2 * ((this.x - x) < 0 ? -1 : 1);
                    this.sonicLastHitTick = SonicManager_1.SonicManager.instance.drawTickCount;
                    var t = 0;
                    var angle = 101.25;
                    var n = false;
                    var speed = 4;
                    while (t < this.rings) {
                        var ring = new Ring_1.Ring(true);
                        SonicManager_1.SonicManager.instance.activeRings.push(ring);
                        ring.x = this.x | 0;
                        ring.y = this.y - 10 | 0;
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
                };
                Sonic.prototype.debug = function () {
                    this.debugging = !this.debugging;
                    this.xsp = 0;
                    this.gsp = 0;
                    this.ysp = 0;
                    this.spriteState = "normal";
                };
                Sonic.prototype.pressUp = function () {
                    this.holdingUp = true;
                };
                Sonic.prototype.releaseUp = function () {
                    this.holdingUp = false;
                };
                Sonic.prototype.pressCrouch = function () {
                    this.crouching = true;
                };
                Sonic.prototype.releaseCrouch = function () {
                    this.crouching = false;
                };
                Sonic.prototype.pressLeft = function () {
                    this.holdingLeft = true;
                };
                Sonic.prototype.releaseLeft = function () {
                    this.holdingLeft = false;
                };
                Sonic.prototype.pressRight = function () {
                    this.holdingRight = true;
                };
                Sonic.prototype.releaseRight = function () {
                    this.holdingRight = false;
                };
                Sonic.prototype.pressJump = function () {
                    this.jumping = true;
                };
                Sonic.prototype.releaseJump = function () {
                    this.jumping = false;
                };
                Sonic.prototype.checkCollisionWithObjects = function (x, y, letter) {
                    this.objectCollision.x = x;
                    this.objectCollision.y = y;
                    var me = this.objectCollision;
                    var levelObjectInfos = SonicManager_1.SonicManager.instance.inFocusObjects;
                    for (var _i = 0, levelObjectInfos_1 = levelObjectInfos; _i < levelObjectInfos_1.length; _i++) {
                        var ob = levelObjectInfos_1[_i];
                        var dj = ob.collides(me);
                        var dj2 = ob.hurtsSonic(me);
                        if (dj) {
                            return ob.collide(this, letter, dj);
                        }
                        if (dj2) {
                            return ob.hurtSonic(this, letter, dj2);
                        }
                    }
                    return false;
                };
                Sonic.prototype.checkCollisionWithRings = function () {
                    var me = this.myRec;
                    this.ringCollisionRect.x = 0;
                    this.ringCollisionRect.y = 0;
                    this.ringCollisionRect.Width = 8 * 2;
                    this.ringCollisionRect.Height = 8 * 2;
                    var rings = SonicManager_1.SonicManager.instance.sonicLevel.rings;
                    for (var index = 0; index < rings.length; index++) {
                        var ring = rings[index];
                        var pos = ring;
                        if (this.obtainedRing[index])
                            continue;
                        this.ringCollisionRect.x = pos.x;
                        this.ringCollisionRect.y = pos.y;
                        if (Utils_1.IntersectingRectangle.IntersectRect(me, this.ringCollisionRect)) {
                            this.rings++;
                            this.obtainedRing[index] = true;
                        }
                    }
                };
                Sonic.prototype.checkCollisionLine = function (p0, p1, p2, p3) {
                    return null;
                };
                return Sonic;
            }());
            exports_1("Sonic", Sonic);
            Watcher = (function () {
                function Watcher() {
                    this.lastTick = 0;
                    this.mult = 1;
                }
                Watcher.prototype.Tick = function () {
                    if (true || SonicManager_1.SonicManager.instance.inHaltMode) {
                        this.mult = 1;
                        return;
                    }
                    var ticks = new Date().getTime();
                    var offset = 0;
                    if (this.lastTick == 0)
                        offset = 16;
                    else
                        offset = ticks - this.lastTick;
                    this.lastTick = ticks;
                    this.mult = (offset / 16) | 0;
                };
                Watcher.prototype.Multiply = function (v) {
                    return this.mult * v;
                };
                return Watcher;
            }());
            exports_1("Watcher", Watcher);
        }
    }
});
//# sourceMappingURL=Sonic.js.map