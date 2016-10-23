import {Sonic} from "./Sonic";
import {Solidity} from "../../SLData";
import {HeightMap} from "../level/HeightMap";
import {Help} from "../../common/Help";
import {SonicManager} from "../SonicManager";
import {RotationMode} from "../../common/Enums";
import {TileChunk} from "../level/Tiles/TileChunk";
import {TilePiece} from "../Level/Tiles/TilePiece";
import {TilePieceInfo} from "../Level/Tiles/TilePieceInfo";

export class SensorManager {

    protected sensors: { [sensorKey: string]: Sensor };

    protected sensorResults: { [sensorKey: string]: SensorM };

    constructor() {
        this.sensors = {};
        this.sensorResults = {};
    }

    public addSensor(letter: string, sensor: Sensor): Sensor {
        this.sensors[letter] = (sensor);
        this.sensorResults[letter] = null;
        return sensor;
    }

    public createVerticalSensor(letter: string, x: number, y1: number, y2: number, color: string, ignoreSolid: boolean = false): Sensor {
        return this.addSensor(letter, new Sensor(x, x, y1, y2, this, color, ignoreSolid, letter));
    }

    public createHorizontalSensor(letter: string, y: number, x1: number, x2: number, color: string, ignoreSolid: boolean = false): Sensor {
        return this.addSensor(letter, new Sensor(x1, x2, y, y, this, color, ignoreSolid, letter));
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
    private __currentM: SensorM = new SensorM(0, 0);
    public value: number = 0;
    public angle: number = 0;
    public letter: string;
    public chosen: boolean = false;
    protected ignoreSolid: boolean = false;
    protected color: string;
    protected manager: SensorManager;
    protected x1: number = 0;
    protected x2: number = 0;
    protected y1: number = 0;
    protected y2: number = 0;

    constructor(x1: number, x2: number, y1: number, y2: number, manager: SensorManager, color: string, ignoreSolid: boolean, letter: string) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.manager = manager;
        this.color = color;
        this.ignoreSolid = ignoreSolid;
        this.letter = letter;
    }

    private checkCollisionLineWrap(startX: number, endX: number, startY: number, endY: number, ignoreSolid: boolean): SensorM {
        /*
         startY = Help.mod(startY, SonicManager.instance.sonicLevel.levelHeight * 128);
         endY = Help.mod(endY, SonicManager.instance.sonicLevel.levelHeight * 128);
         */


        var xIncrease = startX == endX ? (0) : (startX > endX ? -1 : 1);
        var yIncrease = startY == endY ? (0) : (startY > endY ? -1 : 1);


        var oneTryX = startX === endX;

        for (var testX = startX; oneTryX || Math.abs(testX - endX) !== 0; testX += xIncrease) {
            oneTryX = false;
            var oneTryY = startY === endY;
            for (var testY = startY; oneTryY || Math.abs(testY - endY) !== 0; testY += yIncrease) {
                oneTryY = false;
                let tileChunkX = (testX / 128) | 0;
                let tileChunkY = (testY / 128) | 0;

                let chunk = SonicManager.instance.sonicLevel.getChunkAt(tileChunkX, tileChunkY);

                let interChunkX = testX - tileChunkX * 128;
                let interChunkY = testY - tileChunkY * 128;

                let tileX = (interChunkX / 16) | 0;
                let tileY = (interChunkY / 16) | 0;

                let interTileX = interChunkX - tileX * 16;
                let interTileY = interChunkY - tileY * 16;

                let tilePiece = chunk.getTilePieceAt(tileX, tileY, false);
                let tilePieceInfo = chunk.getTilePieceInfo(tileX, tileY, false);
                var solidity = (SonicManager.instance.sonicLevel.curHeightMap ? tilePieceInfo.Solid1 : tilePieceInfo.Solid2 );


                var heightMap = SonicManager.instance.sonicLevel.curHeightMap ? tilePiece.getLayer1HeightMap() : tilePiece.getLayer2HeightMap();
                var tileAngle = SonicManager.instance.sonicLevel.curHeightMap ? tilePiece.getLayer1Angle() : tilePiece.getLayer2Angle();

                if (!(tileAngle == 0 || tileAngle == 255 || tileAngle == 1)) {
                    if (tilePieceInfo.XFlip) {
                        if (tilePieceInfo.YFlip) {
                            tileAngle = 192 - tileAngle + 192;
                            tileAngle = 128 - tileAngle + 128;
                        }
                        else tileAngle = 128 - tileAngle + 128;
                    }
                    else {
                        if (tilePieceInfo.YFlip)
                            tileAngle = 192 - tileAngle + 192;
                        else tileAngle = (tileAngle);
                    }
                }

                var collisionMap: boolean[];
                if (tilePieceInfo.XFlip) {
                    if (tilePieceInfo.YFlip) {
                        collisionMap = heightMap.collisionBlockXFlipYFlip;
                    } else {
                        collisionMap = heightMap.collisionBlockXFlip;
                    }
                } else {
                    if (tilePieceInfo.YFlip) {
                        collisionMap = heightMap.collisionBlockYFlip;
                    } else {
                        collisionMap = heightMap.collisionBlock;
                    }
                }

                if ((solidity !=0 && collisionMap[interTileX + interTileY * 16]) || SonicManager.instance.sonicToon.checkCollisionWithObjects(testX, testY, this.letter)) {
                    this.__currentM.value = startY == endY ? testX : testY;
                    this.__currentM.angle = tileAngle;

                    /*
                     if (this.letter === 'b') {

                     console.log(
                     "tilechunkx", tileChunkX,
                     "tilechunky", tileChunkY,

                     "interchunkx", interChunkX,
                     "interchunky", interChunkY,

                     "tilex", tileX,
                     "tiley", tileY,

                     "interTileX", interTileX,
                     "interTileY", interTileY,

                     "startx", startX,
                     "endx", endX,

                     "starty", startY,
                     "endy", endY,

                     "testx", testX,
                     "testy", testY,

                     "items",JSON.stringify(heightMap.Items)
                     );
                     }
                     */
                    return this.__currentM;

                }
            }
        }


        /*
         let length = 0;
         if (startY == endY) {//left right sensor

         if (Math.max(startX, endX) > SonicManager.instance.sonicLevel.levelWidth * 128) {
         //edge of a level
         this.__currentM.value = SonicManager.instance.sonicLevel.levelWidth * 128 - 20;
         this.__currentM.angle = 0xff;
         return this.__currentM;
         }


         if (startX < endX) {//facing left sensor
         length = endX - startX;
         if (startHeightMap[(startInterChunkX)][startInterChunkY] >= <Solidity>2) {
         for (let i = 0; i < 128 * 2; i++) {
         while (true) {
         if (startInterChunkX - i < 0) {
         if (startTileChunkX - 1 < 0) {
         this.__currentM.value = 0;
         this.__currentM.angle = 0xFF;
         return this.__currentM;
         }
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX - 1, startTileChunkY);
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkX += 128;
         }
         else break;
         }
         if (startHeightMap[(startInterChunkX - i)][startInterChunkY] >= <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX - i, startY, this.letter)) {
         this.__currentM.value = startX - i;
         this.__currentM.angle = startTileAngle[(startInterChunkX - i) / 16 | 0][(startInterChunkY) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         for (let i = 0; i < length; i++) {
         while (true) {
         if (startInterChunkX + i >= 128) {
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX + 1, startTileChunkY);
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkX -= 128;
         }
         else break;
         }
         if (startHeightMap[(startInterChunkX + i)][startInterChunkY] >= <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX + i, startY, this.letter)) {
         this.__currentM.value = startX + i;
         this.__currentM.angle = startTileAngle[(startInterChunkX + i) / 16 | 0][(startInterChunkY) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         else {//facing right sensor
         length = startX - endX;
         if (startHeightMap[(startInterChunkX)][startInterChunkY] >= <Solidity>2) {
         for (let i = 0; i < 128 * 2; i++) {
         while (true) {
         if (startInterChunkX + i >= 128) {
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX + 1, startTileChunkY);
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkX -= 128;
         }
         else break;
         }
         if (startHeightMap[(startInterChunkX + i)][startInterChunkY] >= <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX + i, startY, this.letter)) {
         this.__currentM.value = startX + i;
         this.__currentM.angle = startTileAngle[(startInterChunkX + i) / 16 | 0][(startInterChunkY) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         for (let i = 0; i < length; i++) {
         while (true) {
         if (startInterChunkX - i < 0) {
         if (startTileChunkX - 1 < 0) {
         this.__currentM.value = 0;
         this.__currentM.angle = 0xFF;
         return this.__currentM;
         }
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX - 1, startTileChunkY);
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkX += 128;
         }
         else break;
         }
         if (startHeightMap[(startInterChunkX - i)][startInterChunkY] >= <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX - i, startY, this.letter)) {
         this.__currentM.value = startX - i;
         this.__currentM.angle = startTileAngle[(startInterChunkX - i) / 16 | 0][(startInterChunkY) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         }
         else {//up down sensor
         if (startY < endY) {//upward sensor
         length = endY - startY;
         if (startHeightMap[(startInterChunkX)][startInterChunkY] >= <Solidity>2) {
         for (let i = 0; i < 128 * 2; i++) {
         while (true) {
         if (startInterChunkY - i < 0) {
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX, Help.mod((startTileChunkY - 1), SonicManager.instance.sonicLevel.levelHeight));
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkY += 128;
         }
         else break;
         }
         if (startHeightMap[startInterChunkX][startInterChunkY - i] > <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX, startY - i, this.letter)) {
         this.__currentM.value = startY - i;
         this.__currentM.angle = startTileAngle[(startInterChunkX) / 16 | 0][(startInterChunkY - i) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         for (let i = 0; i < length; i++) {
         while (true) {
         if (startInterChunkY + i >= 128) {
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX, (startTileChunkY + 1) % SonicManager.instance.sonicLevel.levelHeight);
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkY -= 128;
         }
         else break;
         }
         if (startHeightMap[startInterChunkX][startInterChunkY + i] >= <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX, startY + i, this.letter)) {
         if (startHeightMap[startInterChunkX][startInterChunkY + i] == <Solidity>1 && SonicManager.instance.sonicToon.inAir && SonicManager.instance.sonicToon.ysp < 0)
         continue;
         this.__currentM.value = startY + i;
         this.__currentM.angle = startTileAngle[(startInterChunkX) / 16 | 0][(startInterChunkY + i) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         else {//downward sensor
         length = startY - endY;
         if (startHeightMap[(startInterChunkX)][startInterChunkY] >= <Solidity>2) {
         for (let i = 0; i < 128 * 2; i++) {
         while (true) {
         if (startInterChunkY + i >= 128) {
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX, (startTileChunkY + 1) % SonicManager.instance.sonicLevel.levelHeight);
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkY -= 128;
         }
         else break;
         }
         if (startHeightMap[startInterChunkX][startInterChunkY + i] >= <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX, startY + i, this.letter)) {
         this.__currentM.value = startY + i;
         this.__currentM.angle = startTileAngle[(startInterChunkX) / 16 | 0][(startInterChunkY + i) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         for (let i = 0; i < length; i++) {
         while (true) {
         if (startInterChunkY - i < 0) {
         startChunk = SonicManager.instance.sonicLevel.getChunkAt(startTileChunkX, Help.mod((startTileChunkY - 1), SonicManager.instance.sonicLevel.levelHeight));
         this.manager.buildChunk(startChunk, SonicManager.instance.sonicLevel.curHeightMap);
         startHeightMap = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.HeightBlocks1 : startChunk.HeightBlocks2;
         startTileAngle = SonicManager.instance.sonicLevel.curHeightMap ? startChunk.AngleMap1 : startChunk.AngleMap2;
         startInterChunkY += 128;
         }
         else break;
         }
         if (startHeightMap[startInterChunkX][startInterChunkY - i] > <Solidity>1 || SonicManager.instance.sonicToon.checkCollisionWithObjects(startX, startY + i, this.letter)) {
         this.__currentM.value = startY - i;
         this.__currentM.angle = startTileAngle[(startInterChunkX) / 16 | 0][(startInterChunkY - i) / 16 | 0];
         return this.__currentM;
         }
         }
         }
         }
         */
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

    public check(character: Sonic): SensorM {
        let _y2 = character.inAir ? this.y2 : this.y2;
        let m: SensorM = null;
        let x = Help.floor(character.x);
        let y = Help.floor(character.y);
        switch (character.mode) {
            case RotationMode.Floor:
                m = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + _y2, this.ignoreSolid);
                break;
            case RotationMode.LeftWall:
                m = this.checkCollisionLineWrap(x - this.y1, x - _y2, y + this.x1, y + this.x2, this.ignoreSolid);
                break;
            case RotationMode.Ceiling:
                m = this.checkCollisionLineWrap(x - this.x1, x - this.x2, y - this.y1, y - _y2, this.ignoreSolid);
                break;
            case RotationMode.RightWall:
                m = this.checkCollisionLineWrap(x + this.y1, x + _y2, y - this.x1, y - this.x2, this.ignoreSolid);
                break;
        }
        if (m != null) {
            m.letter = this.letter;
            if (m.angle == 255 || m.angle == 0 || m.angle == 1) {
                if (character.mode == RotationMode.Floor)
                    m.angle = 255;
                if (character.mode == RotationMode.LeftWall)
                    m.angle = 64;
                if (character.mode == RotationMode.Ceiling)
                    m.angle = 128;
                if (character.mode == RotationMode.RightWall)
                    m.angle = 192;
            }
        }
        return m;
    }
}

export class SensorM {
    public value: number = 0;
    public angle: number = 0;
    public letter: string;
    public chosen: boolean = false;

    constructor(value: number, angle: number) {
        this.value = value;
        this.angle = angle;
    }
}