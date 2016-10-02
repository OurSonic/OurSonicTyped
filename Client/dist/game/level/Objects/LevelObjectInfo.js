System.register(["../../../common/Utils", "../../SonicManager", "./ObjectManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils_1, SonicManager_1, ObjectManager_1;
    var LevelObjectInfo;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (ObjectManager_1_1) {
                ObjectManager_1 = ObjectManager_1_1;
            }],
        execute: function() {
            LevelObjectInfo = (function () {
                function LevelObjectInfo(o) {
                    this._rect = new Utils_1.Rectangle(0, 0, 0, 0);
                    this.lastDrawTick = 0;
                    this.x = 0;
                    this.y = 0;
                    this.xsp = 0;
                    this.ysp = 0;
                    this.xflip = false;
                    this.yflip = false;
                    this.subdata = 0;
                    this.upperNibble = 0;
                    this.lowerNibble = 0;
                    this.pieceLayoutIndex = 0;
                    this.dead = false;
                    this.index = 0;
                    this.o = o;
                    this.x = o.X;
                    this.y = o.Y;
                    this.xflip = o.XFlip;
                    this.yflip = o.YFlip;
                    this.subdata = o.SubType;
                    this.key = o.ID.toString();
                    this.upperNibble = this.subdata >> 4;
                    this.lowerNibble = this.subdata & 0xf;
                }
                LevelObjectInfo.prototype.log = function (txt, level) {
                    if (level === void 0) { level = 100; }
                    if (!this.debug)
                        this.debug = [];
                    if (level == 0)
                        this.debug.push(" -- " + txt + " -- ");
                    else
                        this.debug.push(txt);
                    if (this.consoleLog)
                        this.consoleLog(this.debug);
                };
                LevelObjectInfo.prototype.setPieceLayoutIndex = function (ind) {
                    this.pieceLayoutIndex = ind;
                    var pcs = this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces;
                    this.pieces = [];
                    for (var _i = 0, pcs_1 = pcs; _i < pcs_1.length; _i++) {
                        var t = pcs_1[_i];
                        //todo look into this...
                        this.pieces.push(t);
                    }
                };
                LevelObjectInfo.prototype.setObjectData = function (obj) {
                    this.objectData = obj;
                    if (this.objectData.pieceLayouts.length > this.pieceLayoutIndex && this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces.length > 0)
                        this.setPieceLayoutIndex(this.pieceLayoutIndex);
                };
                LevelObjectInfo.prototype.tick = function ($object, level, sonic) {
                    if (this.dead || !this.objectData)
                        return false;
                    try {
                        return this.objectData.tick($object, level, sonic);
                    }
                    catch (EJ) {
                        this.log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.mainPieceLayout = function () {
                    return this.objectData.pieceLayouts[this.pieceLayoutIndex];
                };
                LevelObjectInfo.prototype.getRect = function () {
                    if (this.objectData.pieceLayouts.length == 0) {
                        this._rect.x = this.x;
                        this._rect.y = this.y;
                        this._rect.Width = ObjectManager_1.ObjectManager.broken.width;
                        this._rect.Height = ObjectManager_1.ObjectManager.broken.height;
                        return this._rect;
                    }
                    return this.objectData.pieceLayouts[this.pieceLayoutIndex].GetRectangle(this.objectData);
                };
                LevelObjectInfo.prototype.draw = function (canvas, x, y, showHeightMap) {
                    if (this.dead || !this.objectData)
                        return;
                    if (this.objectData.pieceLayouts.length == 0) {
                        canvas.drawImage(ObjectManager_1.ObjectManager.broken, (x - ObjectManager_1.ObjectManager.broken.width / 2), (y - ObjectManager_1.ObjectManager.broken.height / 2), ObjectManager_1.ObjectManager.broken.width, ObjectManager_1.ObjectManager.broken.height);
                        return;
                    }
                    var levelObjectPieceLayout = this.mainPieceLayout();
                    levelObjectPieceLayout.Draw(canvas, x, y, this.objectData, this, showHeightMap);
                    if (this.consoleLog != null) {
                        var gr = this.getRect();
                        canvas.save();
                        canvas.fillStyle = "rgba(228,228,12,0.4)";
                        var wd = 1;
                        canvas.fillRect(gr.x - this.x + x - (gr.Width / 2) - wd, gr.y - this.y + y - (gr.Height / 2) - wd, gr.Width - (gr.x - this.x) + wd * 2, gr.Height - (gr.y - this.y) + wd * 2);
                        canvas.restore();
                    }
                };
                LevelObjectInfo.prototype.reset = function () {
                    this.x = this.o.X;
                    this.y = this.o.Y;
                    this.xsp = 0;
                    this.ysp = 0;
                    this.state = null;
                    this.xflip = this.o.XFlip;
                    this.yflip = this.o.YFlip;
                    this.dead = false;
                    this.pieceLayoutIndex = 0;
                    this.subdata = this.o.SubType;
                    this.upperNibble = this.subdata >> 4;
                    this.lowerNibble = this.subdata & 0xf;
                    if (this.objectData.pieceLayouts.length > this.pieceLayoutIndex && this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces.length > 0)
                        this.setPieceLayoutIndex(this.pieceLayoutIndex);
                };
                LevelObjectInfo.prototype.collides = function (sonic) {
                    return this.collision(sonic, false);
                };
                LevelObjectInfo.prototype.hurtsSonic = function (sonic) {
                    return this.collision(sonic, true);
                };
                LevelObjectInfo.prototype.kill = function () {
                    this.dead = true;
                };
                LevelObjectInfo.prototype.collision = function (sonic, isHurtMap) {
                    if (this.dead || !this.objectData || this.objectData.pieceLayouts.length == 0)
                        return null;
                    var pcs = this.pieces;
                    var mX = ((sonic.x) - this.x) | 0;
                    var mY = ((sonic.y) - this.y) | 0;
                    for (var _i = 0, pcs_2 = pcs; _i < pcs_2.length; _i++) {
                        var j = pcs_2[_i];
                        var piece = this.objectData.pieces[j.pieceIndex];
                        var asset = this.objectData.assets[piece.assetIndex];
                        if (asset.frames.length > 0) {
                            var frm = asset.frames[j.frameIndex];
                            var map = isHurtMap ? frm.hurtSonicMap : frm.collisionMap;
                            if (this.twoDArray(map, (mX + frm.offsetX), (mY + frm.offsetY), this.xflip !== !!piece.xflip, this.yflip !== !!piece.xflip) == true)
                                return j;
                        }
                    }
                    return null;
                };
                LevelObjectInfo.prototype.twoDArray = function (map, x, y, xflip, yflip) {
                    if (!map || x < 0 || y < 0 || x > map.length)
                        return false;
                    var d = map[x];
                    if (!d || y > d.length)
                        return false;
                    return d[y] > 0;
                };
                LevelObjectInfo.prototype.collide = function (sonic, sensor, piece) {
                    try {
                        return this.objectData.onCollide(this, SonicManager_1.SonicManager.instance.sonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        console.log(EJ);
                        this.log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.hurtSonic = function (sonic, sensor, piece) {
                    try {
                        return this.objectData.onHurtSonic(this, SonicManager_1.SonicManager.instance.sonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.log(EJ.Message, 0);
                        return false;
                    }
                };
                return LevelObjectInfo;
            }());
            exports_1("LevelObjectInfo", LevelObjectInfo);
        }
    }
});
//# sourceMappingURL=LevelObjectInfo.js.map