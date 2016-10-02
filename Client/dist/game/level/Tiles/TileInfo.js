System.register(["../../SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicManager_1;
    var TileInfo;
    return {
        setters:[
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            TileInfo = (function () {
                function TileInfo() {
                    this._Tile = 0;
                    this.Priority = false;
                    this.XFlip = false;
                    this.YFlip = false;
                    this.Palette = 0;
                    this.Index = 0;
                }
                TileInfo.prototype.GetTile = function () {
                    return SonicManager_1.SonicManager.instance.sonicLevel.getTile(this._Tile);
                };
                return TileInfo;
            }());
            exports_1("TileInfo", TileInfo);
        }
    }
});
//# sourceMappingURL=TileInfo.js.map