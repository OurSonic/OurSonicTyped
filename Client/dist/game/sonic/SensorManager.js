System.register(["../../common/Help", "../SonicManager", "../../common/Enums"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Help_1, SonicManager_1, Enums_1;
    var SensorManager, Sensor, SensorM;
    return {
        setters:[
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
                Sensor.prototype.checkCollisionLineWrap = function (startX, endX, startY, endY, ignoreSolid) {
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
                            var tileChunkX = (testX / 128) | 0;
                            var tileChunkY = (testY / 128) | 0;
                            var chunk = SonicManager_1.SonicManager.instance.sonicLevel.getChunkAt(tileChunkX, tileChunkY);
                            var interChunkX = testX - tileChunkX * 128;
                            var interChunkY = testY - tileChunkY * 128;
                            var tileX = (interChunkX / 16) | 0;
                            var tileY = (interChunkY / 16) | 0;
                            var interTileX = interChunkX - tileX * 16;
                            var interTileY = interChunkY - tileY * 16;
                            var tilePiece = chunk.getTilePieceAt(tileX, tileY, false);
                            var tilePieceInfo = chunk.getTilePieceInfo(tileX, tileY, false);
                            var solidity = (SonicManager_1.SonicManager.instance.sonicLevel.curHeightMap ? tilePieceInfo.Solid1 : tilePieceInfo.Solid2);
                            var heightMap = SonicManager_1.SonicManager.instance.sonicLevel.curHeightMap ? tilePiece.getLayer1HeightMap() : tilePiece.getLayer2HeightMap();
                            var tileAngle = SonicManager_1.SonicManager.instance.sonicLevel.curHeightMap ? tilePiece.getLayer1Angle() : tilePiece.getLayer2Angle();
                            if (!(tileAngle == 0 || tileAngle == 255 || tileAngle == 1)) {
                                if (tilePieceInfo.XFlip) {
                                    if (tilePieceInfo.YFlip) {
                                        tileAngle = 192 - tileAngle + 192;
                                        tileAngle = 128 - tileAngle + 128;
                                    }
                                    else
                                        tileAngle = 128 - tileAngle + 128;
                                }
                                else {
                                    if (tilePieceInfo.YFlip)
                                        tileAngle = 192 - tileAngle + 192;
                                    else
                                        tileAngle = (tileAngle);
                                }
                            }
                            var collisionMap;
                            if (tilePieceInfo.XFlip) {
                                if (tilePieceInfo.YFlip) {
                                    collisionMap = heightMap.collisionBlockXFlipYFlip;
                                }
                                else {
                                    collisionMap = heightMap.collisionBlockXFlip;
                                }
                            }
                            else {
                                if (tilePieceInfo.YFlip) {
                                    collisionMap = heightMap.collisionBlockYFlip;
                                }
                                else {
                                    collisionMap = heightMap.collisionBlock;
                                }
                            }
                            if ((solidity != 0 && collisionMap[interTileX + interTileY * 16]) || SonicManager_1.SonicManager.instance.sonicToon.checkCollisionWithObjects(testX, testY, this.letter)) {
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
//# sourceMappingURL=SensorManager.js.map