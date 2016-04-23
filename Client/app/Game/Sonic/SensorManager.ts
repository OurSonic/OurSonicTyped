

import {Sonic, Sonic } from "Sonic";
import {Solidity} from "../../SLData";

export class SensorManager {
    protected sensors: { [sensorKey: string]: Sensor };
    protected sensorResults: { [sensorKey: string]: Sensor };
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
        var none: boolean = false;
        this.sensors.forEach(function (i) {
            this.sensorResults[i.Key] = i.Value.Check(character);
            none = none || (this.sensorResults[i.Key] != null);
        });
        return none;
    }
    public getResult(mn: string): SensorM {
        return this.sensorResults[mn];
    }
    public draw(canvas: CanvasRenderingContext2D, sonic: Sonic): void {
        this.sensors.forEach(function (sensor) {
            sensor.Value.Draw(canvas, sonic, this.sensorResults[sensor.Key]);
        });
    }
    public buildChunk(chunk: TileChunk, isLayerOne: boolean): void {
        if (isLayerOne) {
            if (chunk.HeightBlocks1.Truthy())
                return
            var hb1 = chunk.HeightBlocks1 = new Array(128);
            var ab1 = chunk.AngleMap1 = new Array(8);
            for (var _1 = 0; _1 < 128; _1++) {
                hb1[_1] = new Array(128);
            }
            for (var _1 = 0; _1 < 8; _1++) {
                ab1[_1] = new Array(8);
            }
            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = chunk.TilePieces[_x][_y];
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
                    var __x = 0;
                    var __y = 0;
                    var heightMask: HeightMap = tp.GetLayer1HeightMaps();
                    var heightMaskItems: number[] = null;
                    if (heightMask == null)
                        continue;
                    var mj: SlData.Solidity;
                    if (heightMask.Full != null) {
                        mj = !heightMask.Full.Value ? 0 : tp.Solid1;
                        for (; __y < 16; __y++) {
                            for (; __x < 16; __x++) {
                                hb1[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                            }
                        }
                    }
                    else heightMaskItems = heightMask.Items;
                    for (; __y < 16; __y++) {
                        for (; __x < 16; __x++) {
                            var jx = 0;
                            var jy = 0;
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
                            if (heightMask.Full == null) {
                                switch (tp.Solid1) {
                                    case 0:
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
            if (chunk.HeightBlocks2.Truthy())
                return
            var hb2 = chunk.HeightBlocks2 = new Array(128);
            var ab2 = chunk.AngleMap2 = new Array(8);
            for (var _1 = 0; _1 < 128; _1++) {
                hb2[_1] = new Array(128);
            }
            for (var _1 = 0; _1 < 8; _1++) {
                ab2[_1] = new Array(8);
            }
            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = chunk.TilePieces[_x][_y];
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
                    var __x: number;
                    var __y: number;
                    var hd2 = tp.GetLayer2HeightMaps();
                    if (hd2 == null)
                        continue;
                    var mj: Solidity;
                    var hd2Items: number[] = null;
                    if (hd2.Full != null) {
                        mj = hd2.Full == false ? 0 : tp.Solid2;
                        for (; __y < 16; __y++) {
                            for (; __x < 16; __x++) {
                                hb2[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                            }
                        }
                    }
                    else hd2Items = hd2.Items;
                    for (; __y < 16; __y++) {
                        for (; __x < 16; __x++) {
                            var jx = 0;
                            var jy = 0;
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
                            if (hd2.Full == null) {
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
    public value: number;
    public angle: number;
    public letter: string;
    public chosen: boolean;
    protected ignoreSolid: boolean;
    protected color: string;
    protected manager: SensorManager;
    protected x1: number;
    protected x2: number;
    protected y1: number;
    protected y2: number;

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
        var _x = x1 / 128;
        var _y = Help.Mod(y1 / 128, SonicManager.Instance.SonicLevel.LevelHeight);
        var tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x, _y);
        Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
        var curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
        var cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
        var __x = x1 - _x * 128;
        var __y = y1 - _y * 128;
        var i = 0;
        var length = 0;
        if (y1 == y2) {
            if (Math.Max(x1, x2) > SonicManager.Instance.SonicLevel.LevelWidth * 128) {
                this.__currentM.Value = SonicManager.Instance.SonicLevel.LevelWidth * 128 - 20;
                this.__currentM.angle = 0xff;
                return this.__currentM;
            }
            if (x1 < x2) {
                length = x2 - x1;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (; i < 128 * 2; i++) {
                        while (true) {
                            if (__x - i < 0) {
                                if (_x - 1 < 0) {
                                    this.__currentM.Value = 0;
                                    this.__currentM.angle = 0xFF;
                                    return this.__currentM;
                                }
                                tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x - 1, _y);
                                Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                                curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __x += 128;
                            }
                            else break;
                        }
                        if (curh[(__x - i)][__y] >= <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1 - i, y1, letter)) {
                            this.__currentM.Value = x1 - i;
                            this.__currentM.angle = cura[(__x - i) / 16][(__y) / 16];
                            return this.__currentM;
                        }
                    }
                }
                for (; i < length; i++) {
                    while (true) {
                        if (__x + i >= 128) {
                            tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x + 1, _y);
                            Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                            curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __x -= 128;
                        }
                        else break;
                    }
                    if (curh[(__x + i)][__y] >= <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1 + i, y1, letter)) {
                        this.__currentM.Value = x1 + i;
                        this.__currentM.angle = cura[(__x + i) / 16][(__y) / 16];
                        return this.__currentM;
                    }
                }
            }
            else {
                length = x1 - x2;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (; i < 128 * 2; i++) {
                        while (true) {
                            if (__x + i >= 128) {
                                tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x + 1, _y);
                                Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                                curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __x -= 128;
                            }
                            else break;
                        }
                        if (curh[(__x + i)][__y] >= <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1 + i, y1, letter)) {
                            this.__currentM.Value = x1 + i;
                            this.__currentM.angle = cura[(__x + i) / 16][(__y) / 16];
                            return this.__currentM;
                        }
                    }
                }
                for (; i < length; i++) {
                    while (true) {
                        if (__x - i < 0) {
                            if (_x - 1 < 0) {
                                this.__currentM.Value = 0;
                                this.__currentM.angle = 0xFF;
                                return this.__currentM;
                            }
                            tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x - 1, _y);
                            Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                            curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __x += 128;
                        }
                        else break;
                    }
                    if (curh[(__x - i)][__y] >= <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1 - i, y1, letter)) {
                        this.__currentM.Value = x1 - i;
                        this.__currentM.angle = cura[(__x - i) / 16][(__y) / 16];
                        return this.__currentM;
                    }
                }
            }
        }
        else {
            if (y1 < y2) {
                length = y2 - y1;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (; i < 128 * 2; i++) {
                        while (true) {
                            if (__y - i < 0) {
                                tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x, Help.Mod((_y - 1), SonicManager.Instance.SonicLevel.LevelHeight));
                                Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                                curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __y += 128;
                            }
                            else break;
                        }
                        if (curh[__x][__y - i] > <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1, y1 - i, letter)) {
                            this.__currentM.Value = y1 - i;
                            this.__currentM.angle = cura[(__x) / 16][(__y - i) / 16];
                            return this.__currentM;
                        }
                    }
                }
                for (; i < length; i++) {
                    while (true) {
                        if (__y + i >= 128) {
                            tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x, (_y + 1) % SonicManager.Instance.SonicLevel.LevelHeight);
                            Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                            curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __y -= 128;
                        }
                        else break;
                    }
                    if (curh[__x][__y + i] >= <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1, y1 + i, letter)) {
                        if (curh[__x][__y + i] == <Solidity>1 && SonicManager.Instance.SonicToon.InAir && SonicManager.Instance.SonicToon.Ysp < 0)
                            continue;
                        this.__currentM.Value = y1 + i;
                        this.__currentM.angle = cura[(__x) / 16][(__y + i) / 16];
                        return this.__currentM;
                    }
                }
            }
            else {
                length = y1 - y2;
                if (curh[(__x)][__y] >= <Solidity>2) {
                    for (; i < 128 * 2; i++) {
                        while (true) {
                            if (__y + i >= 128) {
                                tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x, (_y + 1) % SonicManager.Instance.SonicLevel.LevelHeight);
                                Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                                curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                __y -= 128;
                            }
                            else break;
                        }
                        if (curh[__x][__y + i] >= <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1, y1 + i, letter)) {
                            this.__currentM.Value = y1 + i;
                            this.__currentM.angle = cura[(__x) / 16][(__y + i) / 16];
                            return this.__currentM;
                        }
                    }
                }
                for (; i < length; i++) {
                    while (true) {
                        if (__y - i < 0) {
                            tc = SonicManager.Instance.SonicLevel.GetChunkAt(_x, Help.Mod((_y - 1), SonicManager.Instance.SonicLevel.LevelHeight));
                            Manager.BuildChunk(tc, SonicManager.Instance.SonicLevel.CurHeightMap);
                            curh = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                            cura = SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                            __y += 128;
                        }
                        else break;
                    }
                    if (curh[__x][__y - i] > <Solidity>1 || SonicManager.Instance.SonicToon.CheckCollisionWithObjects(x1, y1 + i, letter)) {
                        this.__currentM.Value = y1 - i;
                        this.__currentM.angle = cura[(__x) / 16][(__y - i) / 16];
                        return this.__currentM;
                    }
                }
            }
        }
        return null;
    }
    public draw(canvas: CanvasRenderingContext2D, character: Sonic, sensorResult: SensorM): void {
        var x = Help.Floor(character.X) - SonicManager.Instance.WindowLocation.X;
        var y = Help.Floor(character.Y) - SonicManager.Instance.WindowLocation.Y;
        canvas.BeginPath();
        if (sensorResult.Truthy() && sensorResult.Chosen) {
            canvas.StrokeStyle = "#FFF76D";
            canvas.LineWidth = 4;
        }
        else {
            canvas.StrokeStyle = Color;
            canvas.LineWidth = 2;
        }
        switch (character.mode) {
            case RotationMode.Floor:
                canvas.MoveTo((x + X1), (y + Y1));
                canvas.LineTo((x + X2), (y + Y2));
                break;
            case RotationMode.LeftWall:
                canvas.MoveTo((x - Y1), (y + X1));
                canvas.LineTo((x - Y2), (y + X2));
                break;
            case RotationMode.Ceiling:
                canvas.MoveTo((x - X1), (y - Y1));
                canvas.LineTo((x - X2), (y - Y2));
                break;
            case RotationMode.RightWall:
                canvas.MoveTo((x + Y1), (y - X1));
                canvas.LineTo((x + Y2), (y - X2));
                break;
        }
        canvas.ClosePath();
        canvas.Stroke();
    }
    public check(character: Sonic): SensorM {
        var _y2 = character.InAir ? Y2 : Y2;
        var m: SensorM = null;
        var x = Help.Floor(character.X);
        var y = Help.Floor(character.Y);
        switch (character.mode) {
            case RotationMode.Floor:
                m = this.checkCollisionLineWrap(x + X1, x + X2, y + Y1, y + _y2, IgnoreSolid);
                break;
            case RotationMode.LeftWall:
                m = this.checkCollisionLineWrap(x - Y1, x - _y2, y + X1, y + X2, IgnoreSolid);
                break;
            case RotationMode.Ceiling:
                m = this.checkCollisionLineWrap(x - X1, x - X2, y - Y1, y - _y2, IgnoreSolid);
                break;
            case RotationMode.RightWall:
                m = this.checkCollisionLineWrap(x + Y1, x + _y2, y - X1, y - X2, IgnoreSolid);
                break;
        }
        if (m != null) {
            m.letter = letter;
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
    public value: number;
    public angle: number;
    public letter: string;
    public chosen: boolean;
    constructor(value: number, angle: number) {
        this.value = value;
        this.angle = angle;
    }
}

export enum RotationMode {
    Floor = 134,

    RightWall = 224,

    Ceiling = 314,

    LeftWall = 44
}