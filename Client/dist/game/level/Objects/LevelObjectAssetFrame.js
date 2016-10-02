System.register(["../../../common/CanvasInformation"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CanvasInformation_1;
    var LevelObjectAssetFrame;
    return {
        setters:[
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            }],
        execute: function() {
            LevelObjectAssetFrame = (function () {
                function LevelObjectAssetFrame(name) {
                    this.Image = {};
                    this.name = name;
                    this.collisionMap = new Array(100);
                    this.hurtSonicMap = new Array(100);
                    for (var i = 0; i < 100; i++) {
                        this.collisionMap[i] = new Array(100);
                        this.hurtSonicMap[i] = new Array(100);
                    }
                }
                LevelObjectAssetFrame.prototype.SetWidth = function (w) {
                    this.width = w;
                    this.collisionMap = this.collisionMap.slice(0, w);
                    this.ClearCache();
                };
                LevelObjectAssetFrame.prototype.SetHeight = function (h) {
                    this.height = h;
                    for (var j = 0; j < this.width; j++) {
                        this.collisionMap[j] = this.collisionMap[j].slice(0, h);
                    }
                    this.ClearCache();
                };
                LevelObjectAssetFrame.prototype.SetOffset = function (ex, ey) {
                    this.offsetX = ex;
                    this.offsetY = ey;
                    this.ClearCache();
                };
                LevelObjectAssetFrame.prototype.DrawSimple = function (mainCanvas, pos, width, height, xflip, yflip) {
                    var c = this.GetCache(false, false, false);
                    mainCanvas.save();
                    mainCanvas.translate(pos.x, pos.y);
                    mainCanvas.scale((width / this.width) | 0, (height / this.height) | 0);
                    mainCanvas.drawImage(c.canvas, 0, 0);
                    mainCanvas.restore();
                };
                LevelObjectAssetFrame.prototype.GetCache = function (showOutline, showCollideMap, showHurtMap) {
                    var m = this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)];
                    if (m == null) {
                        var mj = CanvasInformation_1.CanvasInformation.create(this.width, this.height, false);
                        var canvas = mj.Context;
                        canvas.save();
                        canvas.strokeStyle = "#000000";
                        canvas.lineWidth = 1;
                        for (var x = 0; x < this.width; x++) {
                            for (var y = 0; y < this.height; y++) {
                                var ex = x;
                                var ey = y;
                                var d = this.colorMap[ex][ey];
                                var color = this.palette[d];
                                if (color == this.transparentColor) {
                                    canvas.fillStyle = "rgba(0,0,0,0)";
                                }
                                else {
                                    canvas.fillStyle = "#" + color;
                                }
                                canvas.fillRect(ex, ey, 1, 1);
                                if (showCollideMap) {
                                    if (this.collisionMap[ex][ey] > 0) {
                                        canvas.fillStyle = "rgba(30,34,255,0.6)";
                                        canvas.fillRect(ex, ey, 1, 1);
                                    }
                                }
                                if (showHurtMap) {
                                    if (this.hurtSonicMap[ex][ey] > 0) {
                                        canvas.fillStyle = "rgba(211,12,55,0.6)";
                                        canvas.fillRect(ex, ey, 1, 1);
                                    }
                                }
                            }
                        }
                        canvas.restore();
                        m = mj;
                        this.SetCache(mj, showOutline, showCollideMap, showHurtMap);
                    }
                    return m;
                };
                LevelObjectAssetFrame.prototype.ClearCache = function () {
                    this.Image = {};
                };
                LevelObjectAssetFrame.prototype.SetCache = function (image, showOutline, showCollideMap, showHurtMap) {
                    this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)] = image;
                };
                LevelObjectAssetFrame.prototype.DrawUI = function (_canvas, pos, showOutline, showCollideMap, showHurtMap, showOffset, xflip, yflip) {
                    var fd = this.GetCache(showOutline, showCollideMap, showHurtMap);
                    _canvas.save();
                    _canvas.translate(pos.x, pos.y);
                    if (xflip) {
                        if (yflip) {
                            _canvas.translate(fd.canvas.width / 2, fd.canvas.height / 2);
                            _canvas.rotate(-90 * Math.PI / 180);
                            _canvas.translate(-fd.canvas.width / 2, -fd.canvas.height / 2);
                            _canvas.translate(0, this.height);
                            _canvas.scale(1, -1);
                        }
                        else {
                            _canvas.translate(fd.canvas.width / 2, fd.canvas.height / 2);
                            _canvas.rotate(-90 * Math.PI / 180);
                            _canvas.translate(-fd.canvas.width / 2, -fd.canvas.height / 2);
                        }
                    }
                    else {
                        if (yflip) {
                            _canvas.translate(0, this.height);
                            _canvas.scale(1, -1);
                        }
                        else {
                        }
                    }
                    _canvas.drawImage(fd.canvas, 0, 0);
                    if (showOffset) {
                        _canvas.beginPath();
                        _canvas.moveTo(this.offsetX, 0);
                        _canvas.lineTo(this.offsetX, this.height);
                        _canvas.lineWidth = 1;
                        _canvas.strokeStyle = "#000000";
                        _canvas.stroke();
                        _canvas.beginPath();
                        _canvas.moveTo(0, this.offsetY);
                        _canvas.lineTo(this.width, this.offsetY);
                        _canvas.lineWidth = 1;
                        _canvas.strokeStyle = "#000000";
                        _canvas.stroke();
                    }
                    _canvas.restore();
                };
                return LevelObjectAssetFrame;
            }());
            exports_1("LevelObjectAssetFrame", LevelObjectAssetFrame);
        }
    }
});
//# sourceMappingURL=LevelObjectAssetFrame.js.map