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
                    this.X = 0;
                    this.Y = 0;
                    this.Xsp = 0;
                    this.Ysp = 0;
                    this.Xflip = false;
                    this.Yflip = false;
                    this.Subdata = 0;
                    this.UpperNibble = 0;
                    this.LowerNibble = 0;
                    this.PieceLayoutIndex = 0;
                    this.Dead = false;
                    this.Index = 0;
                    this.O = o;
                    this.X = o.X;
                    this.Y = o.Y;
                    this.Xflip = o.XFlip;
                    this.Yflip = o.YFlip;
                    this.Subdata = o.SubType;
                    this.Key = o.ID.toString();
                    this.UpperNibble = this.Subdata >> 4;
                    this.LowerNibble = this.Subdata & 0xf;
                }
                LevelObjectInfo.prototype.Log = function (txt, level) {
                    if (level === void 0) { level = 100; }
                    if (!this.Debug)
                        this.Debug = [];
                    if (level == 0)
                        this.Debug.push(" -- " + txt + " -- ");
                    else
                        this.Debug.push(txt);
                    if (this.ConsoleLog)
                        this.ConsoleLog(this.Debug);
                };
                LevelObjectInfo.prototype.SetPieceLayoutIndex = function (ind) {
                    this.PieceLayoutIndex = ind;
                    var pcs = this.ObjectData.PieceLayouts[this.PieceLayoutIndex].pieces;
                    this.Pieces = [];
                    for (var _i = 0, pcs_1 = pcs; _i < pcs_1.length; _i++) {
                        var t = pcs_1[_i];
                        //todo look into this...
                        this.Pieces.push(t);
                    }
                };
                LevelObjectInfo.prototype.SetObjectData = function (obj) {
                    this.ObjectData = obj;
                    if (this.ObjectData.PieceLayouts.length > this.PieceLayoutIndex && this.ObjectData.PieceLayouts[this.PieceLayoutIndex].pieces.length > 0)
                        this.SetPieceLayoutIndex(this.PieceLayoutIndex);
                };
                LevelObjectInfo.prototype.Tick = function ($object, level, sonic) {
                    if (this.Dead || !this.ObjectData)
                        return false;
                    try {
                        return this.ObjectData.Tick($object, level, sonic);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.MainPieceLayout = function () {
                    return this.ObjectData.PieceLayouts[this.PieceLayoutIndex];
                };
                LevelObjectInfo.prototype.GetRect = function () {
                    if (this.ObjectData.PieceLayouts.length == 0) {
                        this._rect.x = this.X;
                        this._rect.y = this.Y;
                        this._rect.Width = ObjectManager_1.ObjectManager.broken.width;
                        this._rect.Height = ObjectManager_1.ObjectManager.broken.height;
                        return this._rect;
                    }
                    return this.ObjectData.PieceLayouts[this.PieceLayoutIndex].GetRectangle(this.ObjectData);
                };
                LevelObjectInfo.prototype.Draw = function (canvas, x, y, showHeightMap) {
                    if (this.Dead || !this.ObjectData)
                        return;
                    if (this.ObjectData.PieceLayouts.length == 0) {
                        canvas.drawImage(ObjectManager_1.ObjectManager.broken, (x - ObjectManager_1.ObjectManager.broken.width / 2), (y - ObjectManager_1.ObjectManager.broken.height / 2), ObjectManager_1.ObjectManager.broken.width, ObjectManager_1.ObjectManager.broken.height);
                        return;
                    }
                    var levelObjectPieceLayout = this.MainPieceLayout();
                    levelObjectPieceLayout.Draw(canvas, x, y, this.ObjectData, this, showHeightMap);
                    if (this.ConsoleLog != null) {
                        var gr = this.GetRect();
                        canvas.save();
                        canvas.fillStyle = "rgba(228,228,12,0.4)";
                        var wd = 1;
                        canvas.fillRect(gr.x - this.X + x - (gr.Width / 2) - wd, gr.y - this.Y + y - (gr.Height / 2) - wd, gr.Width - (gr.x - this.X) + wd * 2, gr.Height - (gr.y - this.Y) + wd * 2);
                        canvas.restore();
                    }
                };
                LevelObjectInfo.prototype.Reset = function () {
                    this.X = this.O.X;
                    this.Y = this.O.Y;
                    this.Xsp = 0;
                    this.Ysp = 0;
                    this.State = null;
                    this.Xflip = this.O.XFlip;
                    this.Yflip = this.O.YFlip;
                    this.Dead = false;
                    this.PieceLayoutIndex = 0;
                    this.Subdata = this.O.SubType;
                    this.UpperNibble = this.Subdata >> 4;
                    this.LowerNibble = this.Subdata & 0xf;
                    if (this.ObjectData.PieceLayouts.length > this.PieceLayoutIndex && this.ObjectData.PieceLayouts[this.PieceLayoutIndex].pieces.length > 0)
                        this.SetPieceLayoutIndex(this.PieceLayoutIndex);
                };
                LevelObjectInfo.prototype.Collides = function (sonic) {
                    return this.Collision(sonic, false);
                };
                LevelObjectInfo.prototype.HurtsSonic = function (sonic) {
                    return this.Collision(sonic, true);
                };
                LevelObjectInfo.prototype.Kill = function () {
                    this.Dead = true;
                };
                LevelObjectInfo.prototype.Collision = function (sonic, isHurtMap) {
                    if (this.Dead || !this.ObjectData || this.ObjectData.PieceLayouts.length == 0)
                        return null;
                    var pcs = this.Pieces;
                    var mX = ((sonic.x) - this.X) | 0;
                    var mY = ((sonic.y) - this.Y) | 0;
                    for (var _i = 0, pcs_2 = pcs; _i < pcs_2.length; _i++) {
                        var j = pcs_2[_i];
                        var piece = this.ObjectData.Pieces[j.pieceIndex];
                        var asset = this.ObjectData.Assets[piece.assetIndex];
                        if (asset.frames.length > 0) {
                            var frm = asset.frames[j.frameIndex];
                            var map = isHurtMap ? frm.hurtSonicMap : frm.collisionMap;
                            if (this.twoDArray(map, (mX + frm.offsetX), (mY + frm.offsetY), this.Xflip !== !!piece.xflip, this.Yflip !== !!piece.xflip) == true)
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
                LevelObjectInfo.prototype.Collide = function (sonic, sensor, piece) {
                    try {
                        return this.ObjectData.OnCollide(this, SonicManager_1.SonicManager.instance.sonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.HurtSonic = function (sonic, sensor, piece) {
                    try {
                        return this.ObjectData.OnHurtSonic(this, SonicManager_1.SonicManager.instance.sonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                return LevelObjectInfo;
            }());
            exports_1("LevelObjectInfo", LevelObjectInfo);
        }
    }
});
