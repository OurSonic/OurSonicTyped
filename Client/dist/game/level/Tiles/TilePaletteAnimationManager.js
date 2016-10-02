System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TilePaletteAnimationManager, TilePaletteAnimation, TilePaletteAnimationFrame;
    return {
        setters:[],
        execute: function() {
            TilePaletteAnimationManager = (function () {
                function TilePaletteAnimationManager(sonicManager) {
                    this.SonicManager = sonicManager;
                    this.Init();
                }
                TilePaletteAnimationManager.prototype.Init = function () {
                    this.Animations = {};
                    for (var animatedPaletteIndex = 0; animatedPaletteIndex < this.SonicManager.sonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                        this.Animations[animatedPaletteIndex] = new TilePaletteAnimation(this, this.SonicManager.sonicLevel.AnimatedPalettes[animatedPaletteIndex]);
                        this.Animations[animatedPaletteIndex].Init();
                    }
                };
                TilePaletteAnimationManager.prototype.ClearCache = function () {
                    this.Animations = null;
                };
                TilePaletteAnimationManager.prototype.TickAnimatedPalettes = function () {
                    if (this.Animations == null)
                        this.Init();
                    for (var animation in this.Animations) {
                        var tilePaletteAnimation = this.Animations[animation];
                        tilePaletteAnimation.Tick();
                    }
                };
                TilePaletteAnimationManager.prototype.getCurrentFrame = function (paletteAnimationIndex) {
                    return this.Animations[paletteAnimationIndex].GetCurrentFrame();
                };
                TilePaletteAnimationManager.prototype.GetPaletteAnimation = function (paletteAnimationIndex) {
                    return this.Animations[paletteAnimationIndex];
                };
                return TilePaletteAnimationManager;
            }());
            exports_1("TilePaletteAnimationManager", TilePaletteAnimationManager);
            TilePaletteAnimation = (function () {
                function TilePaletteAnimation(manager, animatedPaletteData) {
                    this.CurrentFrame = 0;
                    this.Manager = manager;
                    this.AnimatedPaletteData = animatedPaletteData;
                    this.Frames = new Array();
                }
                TilePaletteAnimation.prototype.GetCurrentFrame = function () {
                    return this.Frames[this.CurrentFrame];
                };
                TilePaletteAnimation.prototype.Tick = function () {
                    var pal = this.AnimatedPaletteData;
                    if (pal.SkipIndex == 0)
                        return;
                    if (pal.TotalLength == 0)
                        return;
                    for (var j = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
                        if (this.Manager.SonicManager.drawTickCount % (pal.TotalLength + pal.SkipIndex) == j) {
                            this.CurrentFrame = j / pal.SkipIndex;
                        }
                    }
                };
                TilePaletteAnimation.prototype.Init = function () {
                    var pal = this.AnimatedPaletteData;
                    if (pal.SkipIndex == 0)
                        return;
                    if (pal.TotalLength == 0)
                        return;
                    for (var j = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
                        var frameIndex = j / pal.SkipIndex;
                        if (this.Frames[frameIndex] == null) {
                            this.Frames[frameIndex] = new TilePaletteAnimationFrame(frameIndex, this);
                        }
                    }
                };
                return TilePaletteAnimation;
            }());
            exports_1("TilePaletteAnimation", TilePaletteAnimation);
            TilePaletteAnimationFrame = (function () {
                function TilePaletteAnimationFrame(frameIndex, animation) {
                    this.FrameIndex = 0;
                    this.Animation = animation;
                    this.FrameIndex = frameIndex;
                }
                TilePaletteAnimationFrame.prototype.SetPalette = function () {
                    var levelPalette = this.Animation.Manager.SonicManager.sonicLevel.Palette;
                    this.clonePalette(levelPalette);
                    var pal = this.Animation.AnimatedPaletteData;
                    for (var index = 0; index < pal.Pieces.length; index++) {
                        var palettePiece = pal.Pieces[index];
                        var colorIndex = this.FrameIndex + (pal.Pieces.length * index);
                        var replaceIndex = (palettePiece.PaletteOffset) / 2 | 0;
                        var color = pal.Palette[colorIndex];
                        if (color != null)
                            levelPalette[palettePiece.PaletteIndex][replaceIndex] = color;
                        else
                            levelPalette[palettePiece.PaletteIndex][replaceIndex] = "#000000";
                    }
                };
                TilePaletteAnimationFrame.prototype.clonePalette = function (levelPalette) {
                    this.tempPalette = new Array(levelPalette.length);
                    for (var index = 0; index < levelPalette.length; index++) {
                        var canvasElements = levelPalette[index];
                        this.tempPalette[index] = new Array(canvasElements.length);
                        for (var index2 = 0; index2 < canvasElements.length; index2++) {
                            this.tempPalette[index][index2] = canvasElements[index2];
                        }
                    }
                };
                TilePaletteAnimationFrame.prototype.ClearPalette = function () {
                    this.Animation.Manager.SonicManager.sonicLevel.Palette = this.tempPalette;
                    this.tempPalette = null;
                };
                return TilePaletteAnimationFrame;
            }());
            exports_1("TilePaletteAnimationFrame", TilePaletteAnimationFrame);
        }
    }
});
//# sourceMappingURL=TilePaletteAnimationManager.js.map