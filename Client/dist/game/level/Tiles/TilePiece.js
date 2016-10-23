System.register(["../../../common/Utils", "../../../common/CanvasInformation", "../../SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils_1, CanvasInformation_1, SonicManager_1;
    var TilePiece;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            TilePiece = (function () {
                function TilePiece() {
                    this.onlyBackground = false;
                    this.onlyBackgroundSet = false;
                    this.onlyForeground = false;
                    this.onlyForegroundSet = false;
                    this.shouldAnimate = false;
                    this.Index = 0;
                    this.animatedPaletteCaches = {};
                }
                TilePiece.prototype.Init = function () {
                    this.OnlyBackground();
                    this.OnlyForeground();
                };
                TilePiece.prototype.OnlyBackground = function () {
                    if (this.onlyBackgroundSet)
                        return this.onlyBackground;
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var mj = _a[_i];
                        if (mj) {
                            if (mj.Priority) {
                                this.onlyBackgroundSet = true;
                                return (this.onlyBackground = false);
                            }
                        }
                    }
                    this.onlyBackgroundSet = true;
                    return (this.onlyBackground = true);
                };
                TilePiece.prototype.OnlyForeground = function () {
                    if (this.onlyForegroundSet)
                        return this.onlyForeground;
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var mj = _a[_i];
                        if (mj) {
                            if (!mj.Priority) {
                                this.onlyForegroundSet = true;
                                return (this.onlyForeground = false);
                            }
                        }
                    }
                    this.onlyForegroundSet = true;
                    return (this.onlyForeground = true);
                };
                TilePiece.prototype.DrawBase = function (canvas, position, layer, xFlip, yFlip) {
                    var drawOrderIndex = 0;
                    drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                    var tilePieceLength = 8;
                    var ac = CanvasInformation_1.CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
                    var i = 0;
                    var localPoint = new Utils_1.Point(0, 0);
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var tileItem = _a[_i];
                        var tile = tileItem.GetTile();
                        if (tile) {
                            if (tileItem.Priority == (layer == 1)) {
                                var _xf = !!xFlip !== !!tileItem.XFlip;
                                var _yf = !!yFlip !== !!tileItem.YFlip;
                                var df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                                localPoint.x = df[0] * tilePieceLength;
                                localPoint.y = df[1] * tilePieceLength;
                                tile.drawBase(ac.Context, localPoint, _xf, _yf, tileItem.Palette);
                            }
                        }
                        i++;
                    }
                    canvas.drawImage(ac.canvas, position.x, position.y);
                };
                TilePiece.prototype.getAnimatedPaletteCacheIndex = function (xflip, yflip, animatedPaletteIndex, frameIndex) {
                    return (frameIndex << 8) + (animatedPaletteIndex << 7) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                TilePiece.prototype.DrawAnimatedPalette = function (canvas, position, layer, xFlip, yFlip, animatedPaletteIndex) {
                    var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xFlip, yFlip, animatedPaletteIndex, SonicManager_1.SonicManager.instance.tilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
                    var animatedPaletteCache = this.animatedPaletteCaches[animatedPaletteCacheIndex];
                    if (animatedPaletteCache == null) {
                        var drawOrderIndex = 0;
                        drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                        var tilePieceLength = 8;
                        var ac = CanvasInformation_1.CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
                        var i = 0;
                        var localPoint = new Utils_1.Point(0, 0);
                        for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                            var tileItem = _a[_i];
                            var tile = tileItem.GetTile();
                            if (tile) {
                                if (tileItem.Priority == (layer == 1)) {
                                    var _xf = !!xFlip !== !!tileItem.XFlip;
                                    var _yf = !!yFlip !== !!tileItem.YFlip;
                                    var df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                                    localPoint.x = df[0] * tilePieceLength;
                                    localPoint.y = df[1] * tilePieceLength;
                                    tile.DrawAnimatedPalette(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedPaletteIndex);
                                }
                            }
                            i++;
                        }
                        this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = ac;
                    }
                    canvas.drawImage(animatedPaletteCache.canvas, position.x, position.y);
                };
                TilePiece.prototype.DrawAnimatedTile = function (canvas, position, layer, xFlip, yFlip, animatedTileIndex) {
                    var drawOrderIndex = 0;
                    drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                    var tilePieceLength = 8;
                    var ac = CanvasInformation_1.CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
                    var i = 0;
                    var localPoint = new Utils_1.Point(0, 0);
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var tileItem = _a[_i];
                        var tile = tileItem.GetTile();
                        if (tile) {
                            if (tileItem.Priority == (layer == 1)) {
                                var _xf = !!xFlip !== !!tileItem.XFlip;
                                var _yf = !!yFlip !== !!tileItem.YFlip;
                                var df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                                localPoint.x = df[0] * tilePieceLength;
                                localPoint.y = df[1] * tilePieceLength;
                                tile.drawAnimatedTile(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedTileIndex);
                            }
                        }
                        i++;
                    }
                    canvas.drawImage(ac.canvas, position.x, position.y);
                };
                TilePiece.prototype.ShouldAnimate = function () {
                    if (this.shouldAnimate == null) {
                        for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                            var t = _a[_i];
                            var tile = t.GetTile();
                            if (tile) {
                                if (tile.ShouldTileAnimate())
                                    return (this.shouldAnimate = true);
                            }
                        }
                        this.shouldAnimate = false;
                    }
                    return (this.shouldAnimate);
                };
                TilePiece.prototype.getLayer1Angle = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.angles[SonicManager_1.SonicManager.instance.sonicLevel.collisionIndexes1[this.Index]];
                };
                TilePiece.prototype.getLayer2Angle = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.angles[SonicManager_1.SonicManager.instance.sonicLevel.collisionIndexes2[this.Index]];
                };
                TilePiece.prototype.getLayer1HeightMap = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.heightMaps[SonicManager_1.SonicManager.instance.sonicLevel.collisionIndexes1[this.Index]];
                };
                TilePiece.prototype.getLayer2HeightMap = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.heightMaps[SonicManager_1.SonicManager.instance.sonicLevel.collisionIndexes2[this.Index]];
                };
                TilePiece.DrawInfo = [[0, 0], [1, 0], [0, 1], [1, 1]];
                TilePiece.DrawOrder = [[3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 1, 2, 3]];
                return TilePiece;
            }());
            exports_1("TilePiece", TilePiece);
        }
    }
});
//# sourceMappingURL=TilePiece.js.map