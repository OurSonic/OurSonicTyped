

import {Sonic } from "./Sonic";
import {Solidity} from "../../SLData";
import {HeightMap } from "../level/HeightMap";
import {Help } from "../../common/Help";
import {SonicManager } from "../SonicManager";
import {RotationMode } from "../../common/Enums";
import {TileChunk} from "../level/Tiles/TileChunk";

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
    public buildChunk(chunk: TileChunk, isLayerOne: boolean): void {
        if (isLayerOne) {
            if (chunk.HeightBlocks1)
                return
            let hb1 = chunk.HeightBlocks1 = new Array(128);
            let ab1 = chunk.AngleMap1 = new Array(8);
            for (let _1 = 0; _1 < 128; _1++) {
                hb1[_1] = new Array(128);
                for (let _2 = 0; _2 < 128; _2++) {
                    hb1[_1][_2] = 0;
                }
            }
            for (let _1 = 0; _1 < 8; _1++) {
                ab1[_1] = new Array(8);
                for (let _2 = 0; _2 < 8; _2++) {
                    ab1[_1][_2] = 0;
                }
            }
            for (let _y = 0; _y < 8; _y++) {
                for (let _x = 0; _x < 8; _x++) {
                    let tp = chunk.TilePieces[_x][_y];
                    ab1[_x][_y] = tp.GetLayer1Angles();
                    if (!(ab1[_x][_y] == 0 || ab1[_x][_y] == 255 || ab1[_x][_y] == 1)) {
                        if (tp.XFlip) {
                            if (tp.YFlip) {
                                ab1[_x][_y] = 192 - ab1[_x][_y] + 192;
                                ab1[_x][_y] = 128 - ab1[_x][_y] + 128;
                            }
                            else ab1[_x][_y] = 128 - ab1[_x][_y] + 128;
                        }
                        else {
                            if (tp.YFlip)
                                ab1[_x][_y] = 192 - ab1[_x][_y] + 192;
                            else ab1[_x][_y] = (ab1[_x][_y]);
                        }
                    }

                    let heightMask = tp.GetLayer1HeightMaps();
                    let heightMaskItems: number[] = null;
                    if (heightMask == null)
                        continue;
                    let mj: Solidity;
                    if (heightMask.Full !== undefined) {
                        mj = heightMask.Full === false ? 0 : tp.Solid1;
                        for (let __y = 0; __y < 16; __y++) {
                            for (let __x = 0; __x < 16; __x++) {
                                hb1[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                            }
                        }
                    } else {
                        heightMaskItems = heightMask.Items;
                    }
                    for (let __y = 0; __y < 16; __y++) {
                        for (let __x = 0; __x < 16; __x++) {
                            let jx = 0;
                            let jy = 0;
                            if (tp.XFlip) {
                                if (tp.YFlip) {
                                    jx = 15 - __x;
                                    jy = 15 - __y;
                                }
                                else {
                                    jx = 15 - __x;
                                    jy = __y;
                                }
                            }
                            else {
                                if (tp.YFlip) {
                                    jx = __x;
                                    jy = 15 - __y;
                                }
                                else {
                                    jx = __x;
                                    jy = __y;
                                }
                            }
                            if (heightMask.Full === undefined) {
                                switch (tp.Solid1) {
                                    case <Solidity>0:
                                        hb1[(_x * 16 + jx)][(_y * 16 + jy)] = 0;
                                        break;
                                    case <Solidity>1:
                                    case <Solidity>2:
                                    case <Solidity>3:
                                        hb1[(_x * 16 + jx)][(_y * 16 + jy)] = HeightMap.ItemsGood(heightMaskItems, __x, __y) ? tp.Solid1 : 0;
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            if (chunk.HeightBlocks2)
                return
            let hb2 = chunk.HeightBlocks2 = new Array(128);
            let ab2 = chunk.AngleMap2 = new Array(8);
            for (let _1 = 0; _1 < 128; _1++) {
                hb2[_1] = new Array(128);
            }
            for (let _1 = 0; _1 < 8; _1++) {
                ab2[_1] = new Array(8);
            }
            for (let _y = 0; _y < 8; _y++) {
                for (let _x = 0; _x < 8; _x++) {
                    let tp = chunk.TilePieces[_x][_y];
                    ab2[_x][_y] = tp.GetLayer2Angles();
                    if (!(ab2[_x][_y] == 0 || ab2[_x][_y] == 255 || ab2[_x][_y] == 1)) {
                        if (tp.XFlip) {
                            if (tp.YFlip) {
                                ab2[_x][_y] = 192 - ab2[_x][_y] + 192;
                                ab2[_x][_y] = 128 - ab2[_x][_y] + 128;
                            }
                            else ab2[_x][_y] = 128 - ab2[_x][_y] + 128;
                        }
                        else {
                            if (tp.YFlip)
                                ab2[_x][_y] = 192 - ab2[_x][_y] + 192;
                            else ab2[_x][_y] = (ab2[_x][_y]);
                        }
                    }
                    let hd2 = tp.GetLayer2HeightMaps();
                    if (hd2 == null)
                        continue;
                    let mj: Solidity;
                    let hd2Items: number[] = null;


                    if (hd2.Full !== undefined) {
                        mj = hd2.Full === false ? 0 : tp.Solid2;
                        for (let __y = 0; __y < 16; __y++) {
                            for (let __x = 0; __x < 16; __x++) {
                                hb2[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                            }
                        }
                    }
                    else hd2Items = hd2.Items;
                    for (let __y = 0; __y < 16; __y++) {
                        for (let __x = 0; __x < 16; __x++) {
                            let jx = 0;
                            let jy = 0;
                            if (tp.XFlip) {
                                if (tp.YFlip) {
                                    jx = 15 - __x;
                                    jy = 15 - __y;
                                }
                                else {
                                    jx = 15 - __x;
                                    jy = __y;
                                }
                            }
                            else {
                                if (tp.YFlip) {
                                    jx = __x;
                                    jy = 15 - __y;
                                }
                                else {
                                    jx = __x;
                                    jy = __y;
                                }
                            }
                            if (hd2.Full === undefined) {
                                switch (tp.Solid2) {
                                    case <Solidity>0:
                                        hb2[(_x * 16 + jx)][(_y * 16 + jy)] = Solidity.NotSolid;
                                        break;
                                    case <Solidity>1:
                                    case <Solidity>2:
                                    case <Solidity>3:
                                        hb2[(_x * 16 + jx)][(_y * 16 + jy)] = HeightMap.ItemsGood(hd2Items, __x, __y) ? tp.Solid2 : 0;
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
export class Sensor {
    private __currentM: SensorM = new SensorM(0, 0);
    public value: number=0;
    public angle: number=0;
    public letter: string;
    public chosen: boolean=false;
    protected ignoreSolid: boolean=false;
    protected color: string;
    protected manager: SensorManager;
    protected x1: number=0;
    protected x2: number=0;
    protected y1: number=0;
    protected y2: number=0;
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
    private checkCollisionLineWrap(x1: number, x2: number, y1: number, y2: number, ignoreSolid: boolean): SensorM {
        let _x = (x1 / 128) | 0;
        let _y = Help.mod((y1 / 128) | 0, SonicManager.instance.sonicLevel.LevelHeight);
        let tc = SonicManager.instance.sonicLevel.getChunkAt(_x, _y);
        this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
        let curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
        let cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
        let __x = x1 - _x * 128;
        let __y = y1 - _y * 128;

        let length = 0;
        if (y1 == y2) {
            if (Math.max(x1, x2) > SonicManager.instance.sonicLevel.LevelWidth * 128) {
                this.__currentM.value = SonicManager.instance.sonicLevel.LevelWidth * 128 - 20;
                this.__currentM.angle = 0xff;
                return this.__currentM;
            }
            if (x1 < x2) {
                length = x2 - x1;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (let i = 0; i < 128 * 2; i++) {
                        while (true) {
                            if (__x - i < 0) {
                                if (_x - 1 < 0) {
                                    this.__currentM.value = 0;
                                    this.__currentM.angle = 0xFF;
                                    return this.__currentM;
                                }
                                tc = SonicManager.instance.sonicLevel.getChunkAt(_x - 1, _y);
                                this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                                curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __x += 128;
                            }
                            else break;
                        }
                        if (curh[(__x - i)][__y] >= <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.letter)) {
                            this.__currentM.value = x1 - i;
                            this.__currentM.angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
                            return this.__currentM;
                        }
                    }
                }
                for (let i = 0; i < length; i++) {
                    while (true) {
                        if (__x + i >= 128) {
                            tc = SonicManager.instance.sonicLevel.getChunkAt(_x + 1, _y);
                            this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                            curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __x -= 128;
                        }
                        else break;
                    }
                    if (curh[(__x + i)][__y] >= <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.letter)) {
                        this.__currentM.value = x1 + i;
                        this.__currentM.angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                        return this.__currentM;
                    }
                }
            }
            else {
                length = x1 - x2;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (let i = 0; i < 128 * 2; i++) {
                        while (true) {
                            if (__x + i >= 128) {
                                tc = SonicManager.instance.sonicLevel.getChunkAt(_x + 1, _y);
                                this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                                curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __x -= 128;
                            }
                            else break;
                        }
                        if (curh[(__x + i)][__y] >= <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.letter)) {
                            this.__currentM.value = x1 + i;
                            this.__currentM.angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                            return this.__currentM;
                        }
                    }
                }
                for (let i = 0; i < length; i++) {
                    while (true) {
                        if (__x - i < 0) {
                            if (_x - 1 < 0) {
                                this.__currentM.value = 0;
                                this.__currentM.angle = 0xFF;
                                return this.__currentM;
                            }
                            tc = SonicManager.instance.sonicLevel.getChunkAt(_x - 1, _y);
                            this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                            curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __x += 128;
                        }
                        else break;
                    }
                    if (curh[(__x - i)][__y] >= <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.letter)) {
                        this.__currentM.value = x1 - i;
                        this.__currentM.angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
                        return this.__currentM;
                    }
                }
            }
        }
        else {
            if (y1 < y2) {
                length = y2 - y1;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (let i = 0; i < 128 * 2; i++) {
                        while (true) {
                            if (__y - i < 0) {
                                tc = SonicManager.instance.sonicLevel.getChunkAt(_x, Help.mod((_y - 1), SonicManager.instance.sonicLevel.LevelHeight));
                                this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                                curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __y += 128;
                            }
                            else break;
                        }
                        if (curh[__x][__y - i] > <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 - i, this.letter)) {
                            this.__currentM.value = y1 - i;
                            this.__currentM.angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                            return this.__currentM;
                        }
                    }
                }
                for (let i = 0; i < length; i++) {
                    while (true) {
                        if (__y + i >= 128) {
                            tc = SonicManager.instance.sonicLevel.getChunkAt(_x, (_y + 1) % SonicManager.instance.sonicLevel.LevelHeight);
                            this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                            curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __y -= 128;
                        }
                        else break;
                    }
                    if (curh[__x][__y + i] >= <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                        if (curh[__x][__y + i] == <Solidity>1 && SonicManager.instance.sonicToon.inAir && SonicManager.instance.sonicToon.ysp < 0)
                            continue;
                        this.__currentM.value = y1 + i;
                        this.__currentM.angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                        return this.__currentM;
                    }
                }
            }
            else {
                length = y1 - y2;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (let i = 0; i < 128 * 2; i++) {
                        while (true) {
                            if (__y + i >= 128) {
                                tc = SonicManager.instance.sonicLevel.getChunkAt(_x, (_y + 1) % SonicManager.instance.sonicLevel.LevelHeight);
                                this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                                curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __y -= 128;
                            }
                            else break;
                        }
                        if (curh[__x][__y + i] >= <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                            this.__currentM.value = y1 + i;
                            this.__currentM.angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                            return this.__currentM;
                        }
                    }
                }
                for (let i = 0; i < length; i++) {
                    while (true) {
                        if (__y - i < 0) {
                            tc = SonicManager.instance.sonicLevel.getChunkAt(_x, Help.mod((_y - 1), SonicManager.instance.sonicLevel.LevelHeight));
                            this.manager.buildChunk(tc, SonicManager.instance.sonicLevel.CurHeightMap);
                            curh = SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __y += 128;
                        }
                        else break;
                    }
                    if (curh[__x][__y - i] > <Solidity>1 || SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                        this.__currentM.value = y1 - i;
                        this.__currentM.angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                        return this.__currentM;
                    }
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
    public value: number=0;
    public angle: number=0;
    public letter: string;
    public chosen: boolean=false;
    constructor(value: number, angle: number) {
        this.value = value;
        this.angle = angle;
    }
}