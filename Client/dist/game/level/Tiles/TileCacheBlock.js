System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TileCacheBlock, TileCacheBlockType;
    return {
        setters:[],
        execute: function() {
            TileCacheBlock = (function () {
                function TileCacheBlock(type) {
                    this.AnimatedKey = 0;
                    this.XPos = 0;
                    this.YPos = 0;
                    this.Type = type;
                }
                return TileCacheBlock;
            }());
            exports_1("TileCacheBlock", TileCacheBlock);
            (function (TileCacheBlockType) {
                TileCacheBlockType[TileCacheBlockType["Block"] = 0] = "Block";
                TileCacheBlockType[TileCacheBlockType["TilePiece"] = 1] = "TilePiece";
            })(TileCacheBlockType || (TileCacheBlockType = {}));
            exports_1("TileCacheBlockType", TileCacheBlockType);
        }
    }
});
//# sourceMappingURL=TileCacheBlock.js.map