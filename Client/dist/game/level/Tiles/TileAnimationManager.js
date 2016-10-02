System.register(["../../SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicManager_1;
    var TileAnimationManager, TileAnimation, TileAnimationFrame;
    return {
        setters:[
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            TileAnimationManager = (function () {
                function TileAnimationManager(sonicManager) {
                    this.SonicManager = sonicManager;
                    this.Init();
                }
                TileAnimationManager.prototype.Init = function () {
                    this.Animations = {};
                    for (var animatedTileIndex = 0; animatedTileIndex < this.SonicManager.sonicLevel.TileAnimations.length; animatedTileIndex++) {
                        this.Animations[animatedTileIndex] = new TileAnimation(this, this.SonicManager.sonicLevel.TileAnimations[animatedTileIndex]);
                        this.Animations[animatedTileIndex].init();
                    }
                };
                TileAnimationManager.prototype.TickAnimatedTiles = function () {
                    if (this.Animations == null)
                        this.Init();
                    for (var animation in this.Animations) {
                        if (this.Animations.hasOwnProperty(animation)) {
                            var tilePaletteAnimation = this.Animations[animation];
                            tilePaletteAnimation.tick();
                        }
                    }
                };
                TileAnimationManager.prototype.ClearCache = function () {
                    this.Animations = null;
                };
                TileAnimationManager.prototype.getCurrentFrame = function (tileAnimationIndex) {
                    return this.Animations[tileAnimationIndex].getCurrentFrame();
                };
                return TileAnimationManager;
            }());
            exports_1("TileAnimationManager", TileAnimationManager);
            TileAnimation = (function () {
                function TileAnimation(manager, animatedTileData) {
                    this.currentFrame = 0;
                    this.manager = manager;
                    this.animatedTileData = animatedTileData;
                    this.frames = new Array();
                    this.currentFrame = 0;
                }
                TileAnimation.prototype.getCurrentFrame = function () {
                    return this.frames[this.currentFrame];
                };
                TileAnimation.prototype.tick = function () {
                    var anni = this.animatedTileData;
                    if (anni.LastAnimatedFrame == null) {
                        anni.LastAnimatedFrame = 0;
                        anni.LastAnimatedIndex = 0;
                    }
                    if (anni.DataFrames[anni.LastAnimatedIndex].Ticks == 0 || (SonicManager_1.SonicManager.instance.drawTickCount - anni.LastAnimatedFrame) >= ((anni.AutomatedTiming > 0) ? anni.AutomatedTiming : anni.DataFrames[anni.LastAnimatedIndex].Ticks)) {
                        anni.LastAnimatedFrame = SonicManager_1.SonicManager.instance.drawTickCount;
                        anni.LastAnimatedIndex = (anni.LastAnimatedIndex + 1) % anni.DataFrames.length;
                        this.currentFrame = anni.LastAnimatedIndex;
                    }
                };
                TileAnimation.prototype.init = function () {
                    for (var index = 0; index < this.animatedTileData.DataFrames.length; index++) {
                        this.frames[index] = new TileAnimationFrame(index, this);
                    }
                };
                return TileAnimation;
            }());
            exports_1("TileAnimation", TileAnimation);
            TileAnimationFrame = (function () {
                function TileAnimationFrame(frameIndex, animation) {
                    this.frameIndex = 0;
                    this.animation = animation;
                    this.frameIndex = frameIndex;
                }
                TileAnimationFrame.prototype.frameData = function () {
                    return this.animation.animatedTileData.DataFrames[this.frameIndex];
                };
                return TileAnimationFrame;
            }());
            exports_1("TileAnimationFrame", TileAnimationFrame);
        }
    }
});
//# sourceMappingURL=TileAnimationManager.js.map