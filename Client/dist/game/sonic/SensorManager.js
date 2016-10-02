System.register(["../../SLData", "../level/HeightMap", "../../common/Help", "../SonicManager", "../../common/Enums"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SLData_1, HeightMap_1, Help_1, SonicManager_1, Enums_1;
    var SensorManager, Sensor, SensorM;
    return {
        setters:[
            function (SLData_1_1) {
                SLData_1 = SLData_1_1;
            },
            function (HeightMap_1_1) {
                HeightMap_1 = HeightMap_1_1;
            },
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            }],
        execute: function() {
            SensorManager = (function () {
                function SensorManager() {
                    this.sensors = {};
                    this.sensorResults = {};
                }
                SensorManager.prototype.addSensor = function (letter, sensor) {
                    this.sensors[letter] = (sensor);
                    this.sensorResults[letter] = null;
                    return sensor;
                };
                SensorManager.prototype.createVerticalSensor = function (letter, x, y1, y2, color, ignoreSolid) {
                    if (ignoreSolid === void 0) { ignoreSolid = false; }
                    return this.addSensor(letter, new Sensor(x, x, y1, y2, this, color, ignoreSolid, letter));
                };
                SensorManager.prototype.createHorizontalSensor = function (letter, y, x1, x2, color, ignoreSolid) {
                    if (ignoreSolid === void 0) { ignoreSolid = false; }
                    return this.addSensor(letter, new Sensor(x1, x2, y, y, this, color, ignoreSolid, letter));
                };
                SensorManager.prototype.check = function (character) {
                    var none = false;
                    for (var i in this.sensors) {
                        this.sensorResults[i] = this.sensors[i].check(character);
                        none = none || (this.sensorResults[i] != null);
                    }
                    return none;
                };
                SensorManager.prototype.getResult = function (mn) {
                    return this.sensorResults[mn];
                };
                SensorManager.prototype.draw = function (canvas, sonic) {
                    for (var sensor in this.sensors) {
                        this.sensors[sensor].draw(canvas, sonic, this.sensorResults[sensor]);
                    }
                };
                SensorManager.prototype.buildChunk = function (chunk, isLayerOne) {
                    if (isLayerOne) {
                        if (chunk.HeightBlocks1)
                            return;
                        var hb1 = chunk.HeightBlocks1 = new Array(128);
                        var ab1 = chunk.AngleMap1 = new Array(8);
                        for (var _1 = 0; _1 < 128; _1++) {
                            hb1[_1] = new Array(128);
                            for (var _2 = 0; _2 < 128; _2++) {
                                hb1[_1][_2] = 0;
                            }
                        }
                        for (var _1 = 0; _1 < 8; _1++) {
                            ab1[_1] = new Array(8);
                            for (var _2 = 0; _2 < 8; _2++) {
                                ab1[_1][_2] = 0;
                            }
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
                                        else
                                            ab1[_x][_y] = 128 - ab1[_x][_y] + 128;
                                    }
                                    else {
                                        if (tp.YFlip)
                                            ab1[_x][_y] = 192 - ab1[_x][_y] + 192;
                                        else
                                            ab1[_x][_y] = (ab1[_x][_y]);
                                    }
                                }
                                var heightMask = tp.GetLayer1HeightMaps();
                                var heightMaskItems = null;
                                if (heightMask == null)
                                    continue;
                                var mj = void 0;
                                if (heightMask.Full !== undefined) {
                                    mj = heightMask.Full === false ? 0 : tp.Solid1;
                                    for (var __y = 0; __y < 16; __y++) {
                                        for (var __x = 0; __x < 16; __x++) {
                                            hb1[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                                        }
                                    }
                                }
                                else {
                                    heightMaskItems = heightMask.Items;
                                }
                                for (var __y = 0; __y < 16; __y++) {
                                    for (var __x = 0; __x < 16; __x++) {
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
                                        if (heightMask.Full === undefined) {
                                            switch (tp.Solid1) {
                                                case 0:
                                                    hb1[(_x * 16 + jx)][(_y * 16 + jy)] = 0;
                                                    break;
                                                case 1:
                                                case 2:
                                                case 3:
                                                    hb1[(_x * 16 + jx)][(_y * 16 + jy)] = HeightMap_1.HeightMap.ItemsGood(heightMaskItems, __x, __y) ? tp.Solid1 : 0;
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
                            return;
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
                                        else
                                            ab2[_x][_y] = 128 - ab2[_x][_y] + 128;
                                    }
                                    else {
                                        if (tp.YFlip)
                                            ab2[_x][_y] = 192 - ab2[_x][_y] + 192;
                                        else
                                            ab2[_x][_y] = (ab2[_x][_y]);
                                    }
                                }
                                var hd2 = tp.GetLayer2HeightMaps();
                                if (hd2 == null)
                                    continue;
                                var mj = void 0;
                                var hd2Items = null;
                                if (hd2.Full !== undefined) {
                                    mj = hd2.Full === false ? 0 : tp.Solid2;
                                    for (var __y = 0; __y < 16; __y++) {
                                        for (var __x = 0; __x < 16; __x++) {
                                            hb2[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                                        }
                                    }
                                }
                                else
                                    hd2Items = hd2.Items;
                                for (var __y = 0; __y < 16; __y++) {
                                    for (var __x = 0; __x < 16; __x++) {
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
                                        if (hd2.Full === undefined) {
                                            switch (tp.Solid2) {
                                                case 0:
                                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = SLData_1.Solidity.NotSolid;
                                                    break;
                                                case 1:
                                                case 2:
                                                case 3:
                                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = HeightMap_1.HeightMap.ItemsGood(hd2Items, __x, __y) ? tp.Solid2 : 0;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                return SensorManager;
            }());
            exports_1("SensorManager", SensorManager);
            Sensor = (function () {
                function Sensor(x1, x2, y1, y2, manager, color, ignoreSolid, letter) {
                    this.__currentM = new SensorM(0, 0);
                    this.value = 0;
                    this.angle = 0;
                    this.chosen = false;
                    this.ignoreSolid = false;
                    this.x1 = 0;
                    this.x2 = 0;
                    this.y1 = 0;
                    this.y2 = 0;
                    this.x1 = x1;
                    this.x2 = x2;
                    this.y1 = y1;
                    this.y2 = y2;
                    this.manager = manager;
                    this.color = color;
                    this.ignoreSolid = ignoreSolid;
                    this.letter = letter;
                }
                Sensor.prototype.checkCollisionLineWrap = function (x1, x2, y1, y2, ignoreSolid) {
                    var _x = (x1 / 128) | 0;
                    var _y = Help_1.Help.mod((y1 / 128) | 0, SonicManager_1.SonicManager.instance.sonicLevel.LevelHeight);
                    var tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x, _y);
                    this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                    var curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                    var cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                    var __x = x1 - _x * 128;
                    var __y = y1 - _y * 128;
                    var length = 0;
                    if (y1 == y2) {
                        if (Math.max(x1, x2) > SonicManager_1.SonicManager.instance.sonicLevel.LevelWidth * 128) {
                            this.__currentM.value = SonicManager_1.SonicManager.instance.sonicLevel.LevelWidth * 128 - 20;
                            this.__currentM.angle = 0xff;
                            return this.__currentM;
                        }
                        if (x1 < x2) {
                            length = x2 - x1;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__x - i < 0) {
                                            if (_x - 1 < 0) {
                                                this.__currentM.value = 0;
                                                this.__currentM.angle = 0xFF;
                                                return this.__currentM;
                                            }
                                            tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x - 1, _y);
                                            this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __x += 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[(__x - i)][__y] >= 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.letter)) {
                                        this.__currentM.value = x1 - i;
                                        this.__currentM.angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__x + i >= 128) {
                                        tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x + 1, _y);
                                        this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __x -= 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[(__x + i)][__y] >= 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.letter)) {
                                    this.__currentM.value = x1 + i;
                                    this.__currentM.angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                        else {
                            length = x1 - x2;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__x + i >= 128) {
                                            tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x + 1, _y);
                                            this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __x -= 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[(__x + i)][__y] >= 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.letter)) {
                                        this.__currentM.value = x1 + i;
                                        this.__currentM.angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__x - i < 0) {
                                        if (_x - 1 < 0) {
                                            this.__currentM.value = 0;
                                            this.__currentM.angle = 0xFF;
                                            return this.__currentM;
                                        }
                                        tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x - 1, _y);
                                        this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __x += 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[(__x - i)][__y] >= 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.letter)) {
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
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__y - i < 0) {
                                            tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x, Help_1.Help.mod((_y - 1), SonicManager_1.SonicManager.instance.sonicLevel.LevelHeight));
                                            this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __y += 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[__x][__y - i] > 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 - i, this.letter)) {
                                        this.__currentM.value = y1 - i;
                                        this.__currentM.angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__y + i >= 128) {
                                        tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x, (_y + 1) % SonicManager_1.SonicManager.instance.sonicLevel.LevelHeight);
                                        this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __y -= 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[__x][__y + i] >= 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                                    if (curh[__x][__y + i] == 1 && SonicManager_1.SonicManager.instance.sonicToon.inAir && SonicManager_1.SonicManager.instance.sonicToon.ysp < 0)
                                        continue;
                                    this.__currentM.value = y1 + i;
                                    this.__currentM.angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                        else {
                            length = y1 - y2;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__y + i >= 128) {
                                            tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x, (_y + 1) % SonicManager_1.SonicManager.instance.sonicLevel.LevelHeight);
                                            this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __y -= 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[__x][__y + i] >= 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                                        this.__currentM.value = y1 + i;
                                        this.__currentM.angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__y - i < 0) {
                                        tc = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(_x, Help_1.Help.mod((_y - 1), SonicManager_1.SonicManager.instance.sonicLevel.LevelHeight));
                                        this.manager.buildChunk(tc, SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_1.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __y += 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[__x][__y - i] > 1 || SonicManager_1.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                                    this.__currentM.value = y1 - i;
                                    this.__currentM.angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                    }
                    return null;
                };
                Sensor.prototype.draw = function (canvas, character, sensorResult) {
                    var x = Help_1.Help.floor(character.x) - SonicManager_1.SonicManager.instance.windowLocation.x;
                    var y = Help_1.Help.floor(character.y) - SonicManager_1.SonicManager.instance.windowLocation.y;
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
                        case Enums_1.RotationMode.Floor:
                            canvas.moveTo((x + this.x1), (y + this.y1));
                            canvas.lineTo((x + this.x2), (y + this.y2));
                            break;
                        case Enums_1.RotationMode.LeftWall:
                            canvas.moveTo((x - this.y1), (y + this.x1));
                            canvas.lineTo((x - this.y2), (y + this.x2));
                            break;
                        case Enums_1.RotationMode.Ceiling:
                            canvas.moveTo((x - this.x1), (y - this.y1));
                            canvas.lineTo((x - this.x2), (y - this.y2));
                            break;
                        case Enums_1.RotationMode.RightWall:
                            canvas.moveTo((x + this.y1), (y - this.x1));
                            canvas.lineTo((x + this.y2), (y - this.x2));
                            break;
                    }
                    canvas.closePath();
                    canvas.stroke();
                };
                Sensor.prototype.check = function (character) {
                    var _y2 = character.inAir ? this.y2 : this.y2;
                    var m = null;
                    var x = Help_1.Help.floor(character.x);
                    var y = Help_1.Help.floor(character.y);
                    switch (character.mode) {
                        case Enums_1.RotationMode.Floor:
                            m = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + _y2, this.ignoreSolid);
                            break;
                        case Enums_1.RotationMode.LeftWall:
                            m = this.checkCollisionLineWrap(x - this.y1, x - _y2, y + this.x1, y + this.x2, this.ignoreSolid);
                            break;
                        case Enums_1.RotationMode.Ceiling:
                            m = this.checkCollisionLineWrap(x - this.x1, x - this.x2, y - this.y1, y - _y2, this.ignoreSolid);
                            break;
                        case Enums_1.RotationMode.RightWall:
                            m = this.checkCollisionLineWrap(x + this.y1, x + _y2, y - this.x1, y - this.x2, this.ignoreSolid);
                            break;
                    }
                    if (m != null) {
                        m.letter = this.letter;
                        if (m.angle == 255 || m.angle == 0 || m.angle == 1) {
                            if (character.mode == Enums_1.RotationMode.Floor)
                                m.angle = 255;
                            if (character.mode == Enums_1.RotationMode.LeftWall)
                                m.angle = 64;
                            if (character.mode == Enums_1.RotationMode.Ceiling)
                                m.angle = 128;
                            if (character.mode == Enums_1.RotationMode.RightWall)
                                m.angle = 192;
                        }
                    }
                    return m;
                };
                return Sensor;
            }());
            exports_1("Sensor", Sensor);
            SensorM = (function () {
                function SensorM(value, angle) {
                    this.value = 0;
                    this.angle = 0;
                    this.chosen = false;
                    this.value = value;
                    this.angle = angle;
                }
                return SensorM;
            }());
            exports_1("SensorM", SensorM);
        }
    }
});
