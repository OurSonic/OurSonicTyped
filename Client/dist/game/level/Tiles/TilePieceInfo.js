System.register(["../../SonicManager", "../../../SLData"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicManager_1, SLData_1;
    var TilePieceInfo;
    return {
        setters:[
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (SLData_1_1) {
                SLData_1 = SLData_1_1;
            }],
        execute: function() {
            TilePieceInfo = (function () {
                function TilePieceInfo() {
                    this.Block = 0;
                    this.XFlip = false;
                    this.YFlip = false;
                    this.Solid1 = SLData_1.Solidity.NotSolid;
                    this.Solid2 = SLData_1.Solidity.NotSolid;
                    this.Index = 0;
                }
                TilePieceInfo.prototype.GetTilePiece = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.GetTilePiece(this.Block);
                };
                TilePieceInfo.prototype.SetTilePiece = function (tp) {
                    if (this.Block == tp.Index)
                        return false;
                    this.Block = tp.Index;
                    return true;
                };
                TilePieceInfo.prototype.GetLayer1Angles = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.Angles[SonicManager_1.SonicManager.instance.sonicLevel.CollisionIndexes1[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer2Angles = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.Angles[SonicManager_1.SonicManager.instance.sonicLevel.CollisionIndexes2[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer1HeightMaps = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.HeightMaps[SonicManager_1.SonicManager.instance.sonicLevel.CollisionIndexes1[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer2HeightMaps = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.HeightMaps[SonicManager_1.SonicManager.instance.sonicLevel.CollisionIndexes2[this.Block]];
                };
                return TilePieceInfo;
            }());
            exports_1("TilePieceInfo", TilePieceInfo);
        }
    }
});
