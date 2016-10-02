System.register(["../../../common/CanvasInformation", "../../../common/Utils", "../../SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CanvasInformation_1, Utils_1, SonicManager_1;
    var Tile;
    return {
        setters:[
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            Tile = (function () {
                function Tile(colors) {
                    this.canAnimate = true;
                    this.index = 0;
                    this.isTileAnimated = false;
                    this.baseCaches = {};
                    this.animatedPaletteCaches = {};
                    this.colors = colors;
                    this.curPaletteIndexes = null;
                }
                Tile.prototype.drawBase = function (canvas, pos, xflip, yflip, palette, isAnimatedTile) {
                    if (isAnimatedTile === void 0) { isAnimatedTile = false; }
                    if (this.animatedTileIndexes != null && (!isAnimatedTile && this.animatedTileIndexes.length > 0))
                        return;
                    var baseCacheIndex = this.getBaseCacheIndex(xflip, yflip, palette);
                    var baseCache = this.baseCaches[baseCacheIndex];
                    if (baseCache == null) {
                        var squareSize = this.colors.length;
                        var j = void 0;
                        j = CanvasInformation_1.CanvasInformation.create(squareSize, squareSize, false);
                        if (pos.x < 0 || pos.y < 0)
                            return;
                        var oPos = new Utils_1.Point(0, 0);
                        if (xflip) {
                            oPos.x = -squareSize;
                            j.Context.scale(-1, 1);
                        }
                        if (yflip) {
                            oPos.y = -squareSize;
                            j.Context.scale(1, -1);
                        }
                        var palette_ = SonicManager_1.SonicManager.instance.sonicLevel.Palette;
                        var colorPaletteIndex = (palette + SonicManager_1.SonicManager.instance.indexedPalette) % palette_.length;
                        var x = oPos.x;
                        var y = oPos.y;
                        for (var _x = 0; _x < squareSize; _x++) {
                            for (var _y = 0; _y < squareSize; _y++) {
                                var colorIndex = this.colors[_x][_y];
                                if (colorIndex == 0)
                                    continue;
                                j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                                j.Context.fillRect(x + _x, y + _y, 1, 1);
                            }
                        }
                        this.baseCaches[baseCacheIndex] = baseCache = j;
                    }
                    canvas.drawImage(baseCache.canvas, pos.x, pos.y);
                };
                Tile.prototype.getBaseCacheIndex = function (xflip, yflip, palette) {
                    return (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                Tile.prototype.getAnimatedPaletteCacheIndex = function (xflip, yflip, palette, animatedPaletteIndex, frameIndex) {
                    return (frameIndex << 8) + (animatedPaletteIndex << 7) + (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                Tile.prototype.DrawAnimatedPalette = function (canvas, pos, xflip, yflip, palette, animatedPaletteIndex, isAnimatedTile) {
                    if (isAnimatedTile === void 0) { isAnimatedTile = false; }
                    if (this.animatedTileIndexes != null && (!isAnimatedTile && this.animatedTileIndexes.length > 0))
                        return;
                    var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xflip, yflip, palette, animatedPaletteIndex, SonicManager_1.SonicManager.instance.tilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
                    var animatedPaletteCache = this.animatedPaletteCaches[animatedPaletteCacheIndex];
                    if (animatedPaletteCache == null) {
                        var squareSize = this.colors.length;
                        var j = void 0;
                        j = CanvasInformation_1.CanvasInformation.create(squareSize, squareSize, false);
                        if (pos.x < 0 || pos.y < 0)
                            return;
                        var oPos = new Utils_1.Point(0, 0);
                        if (xflip) {
                            oPos.x = -squareSize;
                            j.Context.scale(-1, 1);
                        }
                        if (yflip) {
                            oPos.y = -squareSize;
                            j.Context.scale(1, -1);
                        }
                        var palette_ = SonicManager_1.SonicManager.instance.sonicLevel.Palette;
                        var colorPaletteIndex = (palette + SonicManager_1.SonicManager.instance.indexedPalette) % palette_.length;
                        var x = oPos.x;
                        var y = oPos.y;
                        for (var _x = 0; _x < squareSize; _x++) {
                            for (var _y = 0; _y < squareSize; _y++) {
                                var colorIndex = this.colors[_x][_y];
                                if (colorIndex == 0)
                                    continue;
                                if (this.paletteIndexesToBeAnimated[animatedPaletteIndex].indexOf(colorIndex) == -1)
                                    continue;
                                j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                                j.Context.fillRect(x + _x, y + _y, 1, 1);
                            }
                        }
                        this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = j;
                    }
                    canvas.drawImage(animatedPaletteCache.canvas, pos.x, pos.y);
                };
                Tile.prototype.drawAnimatedTile = function (canvas, pos, xflip, yflip, palette, animatedTileIndex) {
                    if (this.animatedTileIndexes.indexOf(animatedTileIndex) == -1)
                        return;
                    var tileAnimationFrame = SonicManager_1.SonicManager.instance.tileAnimationManager.getCurrentFrame(animatedTileIndex);
                    var tileAnimation = tileAnimationFrame.animation;
                    var tileAnimationData = tileAnimation.animatedTileData;
                    var animationIndex = tileAnimationData.AnimationTileIndex;
                    var frame = tileAnimationFrame.frameData();
                    if (!frame) {
                        frame = tileAnimation.animatedTileData.DataFrames[0];
                    }
                    var file = tileAnimationData.GetAnimationFile();
                    var va = file[frame.StartingTileIndex + (this.index - animationIndex)];
                    if (va != null) {
                        va.drawBase(canvas, pos, xflip, yflip, palette, true);
                    }
                    else {
                    }
                };
                Tile.prototype.ShouldTileAnimate = function () {
                    return this.isTileAnimated && this.canAnimate;
                };
                Tile.prototype.GetAllPaletteIndexes = function () {
                    if (this.curPaletteIndexes == null) {
                        var d = new Array();
                        for (var _x = 0; _x < this.colors.length; _x++) {
                            var color = this.colors[_x];
                            var _loop_1 = function(_y) {
                                var col = color[_y];
                                if (col == 0)
                                    return "continue";
                                if (d.filter(function (a) { return a != col; }).length == d.length)
                                    d.push(col);
                            };
                            for (var _y = 0; _y < color.length; _y++) {
                                var state_1 = _loop_1(_y);
                                if (state_1 === "continue") continue;
                            }
                        }
                        this.curPaletteIndexes = d.slice(0);
                    }
                    return this.curPaletteIndexes;
                };
                Tile.prototype.ClearCache = function () {
                    this.curPaletteIndexes = null;
                    this.baseCaches = {};
                };
                return Tile;
            }());
            exports_1("Tile", Tile);
        }
    }
});
