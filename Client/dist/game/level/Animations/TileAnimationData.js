System.register(["../../SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicManager_1;
    var TileAnimationData, TileAnimationDataFrame;
    return {
        setters:[
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            TileAnimationData = (function () {
                function TileAnimationData() {
                    /*   function animation(name, images) {
                 this.images = images;
                 this.name = name;
                 this.draw = function (canvas, x, y, scale, animationIndex) {
                     canvas.save();
                     let jv = (function (ind, imgs) {
                         let dj = 0;
                         for (let vm in imgs) {
                             if (dj == ind)
                                 return vm;
                             dj++;
             
                         }
                         return null;
                     })(animationIndex, this.images);
                     
                     canvas.drawImage(sonicManager.spriteCache.animationSprites[animationIndex + " " + name + scale.x + scale.y],
                         (x - this.images[jv].width / 2) * scale.x, (y - this.images[jv].height / 2) * scale.y);
                     canvas.restore();
                 };
             }*/
                    this.AnimationTileFile = 0;
                    this.NumberOfTiles = 0;
                    this.LastAnimatedIndex = 0;
                    this.LastAnimatedFrame = 0;
                    this.AnimationTileIndex = 0;
                    this.AutomatedTiming = 0;
                }
                TileAnimationData.prototype.GetAnimationFile = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.AnimatedTileFiles[this.AnimationTileFile];
                };
                return TileAnimationData;
            }());
            exports_1("TileAnimationData", TileAnimationData);
            TileAnimationDataFrame = (function () {
                function TileAnimationDataFrame() {
                    this.Ticks = 0;
                    this.StartingTileIndex = 0;
                }
                return TileAnimationDataFrame;
            }());
            exports_1("TileAnimationDataFrame", TileAnimationDataFrame);
        }
    }
});
