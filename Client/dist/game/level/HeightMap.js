System.register(["../../common/Utils", "../SonicManager", "../../common/CanvasInformation", "../../common/Help", "../../common/Enums"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils_1, SonicManager_1, CanvasInformation_1, Help_1, Enums_1;
    var HeightMap;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            }],
        execute: function() {
            HeightMap = (function () {
                function HeightMap(heightMap, i) {
                    this.Width = 0;
                    this.Height = 0;
                    this.Index = 0;
                    this.Items = heightMap;
                    this.Width = 16;
                    this.Height = 16;
                    this.Index = i;
                    this.buildCollisionBlocks();
                }
                HeightMap.prototype.setItem = function (x, y, rotationMode) {
                    var jx = 0;
                    var jy = 0;
                    switch (rotationMode) {
                        case Enums_1.RotationMode.Floor:
                            jx = x;
                            jy = y;
                            break;
                        case Enums_1.RotationMode.LeftWall:
                            jx = y;
                            jy = 15 - x;
                            break;
                        case Enums_1.RotationMode.Ceiling:
                            jx = x;
                            jy = 15 - y;
                            break;
                        case Enums_1.RotationMode.RightWall:
                            jx = y;
                            jy = x;
                            break;
                    }
                    this.Items[jx] = 16 - jy;
                };
                HeightMap.prototype.draw = function (canvas, pos, xflip, yflip, solid, angle) {
                    if (this.Items == null)
                        return;
                    canvas.save();
                    var oPos = Utils_1.Point.Create(pos);
                    if (xflip) {
                        pos.x = -pos.x - 16;
                        canvas.scale(-1, 1);
                    }
                    if (yflip) {
                        pos.y = -pos.y - 16;
                        canvas.scale(1, -1);
                    }
                    var fd = SonicManager_1.SonicManager.instance.spriteCache.HeightMaps[this.Index + (solid << 20)];
                    if (this.Index != -1 && fd)
                        canvas.drawImage(fd.canvas, pos.x, pos.y);
                    else {
                        var ntcanvas = CanvasInformation_1.CanvasInformation.create(16, 16, false);
                        var ncanvas = ntcanvas.Context;
                        if (solid > 0) {
                            ncanvas.fillStyle = HeightMap.colors[solid];
                            for (var x = 0; x < 16; x++) {
                                for (var y = 0; y < 16; y++) {
                                    var jx = 0;
                                    var jy = 0;
                                    if (HeightMap.itemsGood(this.Items, x, y)) {
                                        jx = x;
                                        jy = y;
                                        var _x = jx;
                                        var _y = jy;
                                        ncanvas.lineWidth = 1;
                                        ncanvas.fillRect(_x, _y, 1, 1);
                                        if (angle != 255) {
                                            ncanvas.beginPath();
                                            ncanvas.lineWidth = 1;
                                            ncanvas.strokeStyle = "rgba(163,241,255,0.8)";
                                            ncanvas.moveTo(16 / 2, 16 / 2);
                                            ncanvas.lineTo(16 / 2 - Help_1.Help.sin(angle) * 8, 16 / 2 - Help_1.Help.cos(angle) * 8);
                                            ncanvas.stroke();
                                        }
                                    }
                                }
                            }
                        }
                        SonicManager_1.SonicManager.instance.spriteCache.HeightMaps[this.Index + (solid << 20)] = ntcanvas;
                        canvas.drawImage(ntcanvas.canvas, pos.x, pos.y);
                    }
                    canvas.restore();
                    pos.x = oPos.x;
                    pos.y = oPos.y;
                };
                HeightMap.itemsGood = function (items, x, y) {
                    if (items[x] < 0)
                        return Math.abs(items[x]) >= y;
                    return items[x] >= 16 - y;
                };
                HeightMap.prototype.buildCollisionBlocks = function () {
                    this.collisionBlock = new Array(64);
                    this.collisionBlockXFlip = new Array(64);
                    this.collisionBlockYFlip = new Array(64);
                    this.collisionBlockXFlipYFlip = new Array(64);
                    for (var y = 0; y < 16; y++) {
                        for (var x = 0; x < 16; x++) {
                            this.collisionBlock[(x) + (y) * 16] = HeightMap.itemsGood(this.Items, x, y);
                            this.collisionBlockXFlip[(15 - x) + (y) * 16] = HeightMap.itemsGood(this.Items, x, y);
                            this.collisionBlockYFlip[(x) + (15 - y) * 16] = HeightMap.itemsGood(this.Items, x, y);
                            this.collisionBlockXFlipYFlip[(15 - x) + (15 - y) * 16] = HeightMap.itemsGood(this.Items, x, y);
                        }
                    }
                };
                HeightMap.colors = new Array("", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)");
                HeightMap.fullCollision = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
                HeightMap.empty = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
                return HeightMap;
            }());
            exports_1("HeightMap", HeightMap);
        }
    }
});
//# sourceMappingURL=HeightMap.js.map