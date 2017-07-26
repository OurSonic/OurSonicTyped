﻿import {Sonic} from "./Sonic";
import {Solidity} from "../../SLData";
import {Help} from "../../common/Help";
import {SonicManager} from "../SonicManager";
import {RotationMode} from "../../common/Enums";

export class SensorManager {

    protected sensors: { [sensorKey: string]: Sensor };

    public sensorResults: { [sensorKey: string]: SensorM };

    constructor() {
        this.sensors = {};
        this.sensorResults = {};
    }

    public addSensor(letter: string, sensor: Sensor): Sensor {
        this.sensors[letter] = (sensor);
        this.sensorResults[letter] = null;
        return sensor;
    }

    public createVerticalSensor(letter: string, x: number, y1: number, y2: number, color: string): Sensor {
        return this.addSensor(letter, new Sensor(x, x, y1, y2, this, color, letter));
    }

    public createHorizontalSensor(letter: string, y: number, x1: number, x2: number, color: string): Sensor {
        return this.addSensor(letter, new Sensor(x1, x2, y, y, this, color, letter));
    }

    public check(character: Sonic): boolean {
        let none: boolean = false;
        for (let i in this.sensors) {
            this.sensorResults[i] = this.sensors[i].check(character);
            none = none || (this.sensorResults[i] != null);
        }
        return none;
    }

    public getResult(mn: string): SensorM {
        return this.sensorResults[mn];
    }

    public draw(canvas: CanvasRenderingContext2D, sonic: Sonic): void {
        for (let sensor in this.sensors) {
            this.sensors[sensor].draw(canvas, sonic, this.sensorResults[sensor]);
        }
    }
}

export class Sensor {
    private cachedReturnSensor: SensorM = new SensorM(0, 0);
    public letter: string;
    protected color: string;
    protected manager: SensorManager;
    protected x1: number = 0;
    protected x2: number = 0;
    protected y1: number = 0;
    protected y2: number = 0;

    constructor(x1: number, x2: number, y1: number, y2: number, manager: SensorManager, color: string, letter: string) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.manager = manager;
        this.color = color;
        this.letter = letter;
    }

    private checkCollisionLineWrap(startX: number, endX: number, startY: number, endY: number, allowTopSolid: boolean): SensorM {
        let xIncrease = startX == endX ? (0) : (startX > endX ? -1 : 1);
        let yIncrease = startY == endY ? (0) : (startY > endY ? -1 : 1);

        let minSolidity = 0;
        if (!allowTopSolid) {
            minSolidity = 1;
        }

        let oneTryX = startX === endX;
        let levelWidth = SonicManager.instance.sonicLevel.levelWidth * 128;

        for (let testX = startX; oneTryX || Math.abs(testX - endX) !== 0; testX += xIncrease) {
            oneTryX = false;
            if (testX == 0) {
                this.cachedReturnSensor.value = 0;
                this.cachedReturnSensor.angle = 0;
                this.cachedReturnSensor.solidity = Solidity.AllSolid;
                return this.cachedReturnSensor;
            }
            if (testX == levelWidth) {
                this.cachedReturnSensor.value = 0;
                this.cachedReturnSensor.angle = 0;
                this.cachedReturnSensor.solidity = Solidity.AllSolid;
                return this.cachedReturnSensor;
            }

            let oneTryY = startY === endY;
            for (let testY = startY; oneTryY || Math.abs(testY - endY) !== 0; testY += yIncrease) {
                oneTryY = false;

                let tileChunkX = (testX / 128) | 0;
                let tileChunkY = (Help.mod(testY, SonicManager.instance.sonicLevel.levelHeight * 128) / 128) | 0;

                let chunk = SonicManager.instance.sonicLevel.getChunkAt(tileChunkX, tileChunkY);
                if (chunk === undefined) continue;

                let interChunkX = testX - tileChunkX * 128;
                let interChunkY = testY - tileChunkY * 128;

                let tileX = (interChunkX / 16) | 0;
                let tileY = (interChunkY / 16) | 0;

                let interTileX = interChunkX - tileX * 16;
                let interTileY = interChunkY - tileY * 16;

                let tilePiece = chunk.getTilePieceAt(tileX, tileY, false);
                if (tilePiece === undefined) continue;
                let tilePieceInfo = chunk.getTilePieceInfo(tileX, tileY, false);
                let solidity = (SonicManager.instance.sonicLevel.curHeightMap ? tilePieceInfo.solid1 : tilePieceInfo.solid2 );


                let heightMap = SonicManager.instance.sonicLevel.curHeightMap ? tilePiece.getLayer1HeightMap() : tilePiece.getLayer2HeightMap();
                let tileAngle = SonicManager.instance.sonicLevel.curHeightMap ? tilePiece.getLayer1Angle() : tilePiece.getLayer2Angle();

                if (!(tileAngle == 0 || tileAngle == 255 || tileAngle == 1)) {
                    if (tilePieceInfo.xFlip) {
                        if (tilePieceInfo.yFlip) {
                            tileAngle = 192 - tileAngle + 192;
                            tileAngle = 128 - tileAngle + 128;
                        }
                        else tileAngle = 128 - tileAngle + 128;
                    }
                    else {
                        if (tilePieceInfo.yFlip)
                            tileAngle = 192 - tileAngle + 192;
                        else tileAngle = (tileAngle);
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

                if ((solidity > minSolidity && collisionMap[interTileX + interTileY * 16]) || SonicManager.instance.sonicToon.checkCollisionWithObjects(testX, testY, this.letter)) {
                    this.cachedReturnSensor.value = startY == endY ? testX : testY;
                    this.cachedReturnSensor.angle = tileAngle;
                    this.cachedReturnSensor.solidity = solidity;

                    return this.cachedReturnSensor;
                }
            }
        }
        return null;
    }

    public draw(canvas: CanvasRenderingContext2D, character: Sonic, sensorResult: SensorM): void {
        let x = Help.floor(character.x) - SonicManager.instance.windowLocation.x;
        let y = Help.floor(character.y) - SonicManager.instance.windowLocation.y;
        canvas.beginPath();
        if (sensorResult && sensorResult.chosen) {
            canvas.strokeStyle = "#FFF76D";
            canvas.lineWidth = 4;
        }
        else {
            canvas.strokeStyle = this.color;
            canvas.lineWidth = 2;
        }
        switch (character.mode) {
            case RotationMode.Floor:
                canvas.moveTo((x + this.x1), (y + this.y1));
                canvas.lineTo((x + this.x2), (y + this.y2));
                break;
            case RotationMode.LeftWall:
                canvas.moveTo((x - this.y1), (y + this.x1));
                canvas.lineTo((x - this.y2), (y + this.x2));
                break;
            case RotationMode.Ceiling:
                canvas.moveTo((x - this.x1), (y - this.y1));
                canvas.lineTo((x - this.x2), (y - this.y2));
                break;
            case RotationMode.RightWall:
                canvas.moveTo((x + this.y1), (y - this.x1));
                canvas.lineTo((x + this.y2), (y - this.x2));
                break;
        }
        canvas.closePath();
        canvas.stroke();
    }

    public check(sonic: Sonic): SensorM {
        let _y2 = sonic.inAir ? this.y2 : this.y2;
        let sensor: SensorM = null;
        let x = Help.floor(sonic.x);
        let y = Help.floor(sonic.y);
        let allowTopSolid = true;

        switch (sonic.mode) {
            case RotationMode.Floor:
                switch (this.letter) {
                    case "a":
                    case "b":
                        if (sonic.inAir && sonic.ysp < 0) {
                            allowTopSolid = false;
                        }
                        break;
                    case "c":
                    case "d":
                        allowTopSolid = false;
                        break;
                    case "m1":
                    case "m2":
                        if (sonic.inAir) {
                            allowTopSolid = false;
                        }
                        break;
                }

                sensor = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + _y2, allowTopSolid);
                break;
            case RotationMode.LeftWall:
                switch (this.letter) {
                    case "a":
                    case "b":
                        if (sonic.ysp < 0) {
                            allowTopSolid = false;
                        }
                        break;
                    case "c":
                    case "d":
                        allowTopSolid = false;
                        break;
                    case "m1":
                        allowTopSolid = false;
                        break;
                    case "m2":
                        if (sonic.ysp < 0) {
                            allowTopSolid = false;
                        }
                        break;
                }
                sensor = this.checkCollisionLineWrap(x - this.y1, x - _y2, y + this.x1, y + this.x2, allowTopSolid);
                break;
            case RotationMode.Ceiling:
                sensor = this.checkCollisionLineWrap(x - this.x1, x - this.x2, y - this.y1, y - _y2, allowTopSolid);
                break;
            case RotationMode.RightWall:
                switch (this.letter) {
                    case "a":
                    case "b":
                        if (sonic.ysp < 0) {
                            allowTopSolid = false;
                        }
                        break;
                    case "c":
                    case "d":
                        allowTopSolid = false;
                        break;
                    case "m1":
                        if (sonic.ysp < 0) {
                            allowTopSolid = false;
                        }
                        break;
                    case "m2":
                        allowTopSolid = false;
                        break;
                }
                sensor = this.checkCollisionLineWrap(x + this.y1, x + _y2, y - this.x1, y - this.x2, allowTopSolid);
                break;
        }
        if (sensor != null) {
            sensor.letter = this.letter;
            if (sensor.angle == 255 || sensor.angle == 0 || sensor.angle == 1) {
                switch (sonic.mode) {
                    case RotationMode.Floor:
                        sensor.angle = 255;
                        break;
                    case RotationMode.LeftWall:
                        sensor.angle = 64;
                        break;
                    case RotationMode.Ceiling:
                        sensor.angle = 128;
                        break;
                    case RotationMode.RightWall:
                        sensor.angle = 192;
                        break;
                }
            }

            if (sonic.mode == RotationMode.Floor) {
                switch (this.letter) {
                    case "c":
                    case "d":
                        if (sensor.angle < 160) {
                            sensor.angle = 0;
                        }
                        break;
                    case "m1":
                    case "m2":
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

export class SensorM {
    public value: number = 0;
    public angle: number = 0;
    public letter: string;
    public chosen: boolean = false;
    public solidity: Solidity = 0;

    constructor(value: number, angle: number) {
        this.value = value;
        this.angle = angle;
    }
}