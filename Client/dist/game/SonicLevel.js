System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicLevel, PaletteItem, PaletteItemPieces;
    return {
        setters:[],
        execute: function() {
            SonicLevel = (function () {
                function SonicLevel() {
                    this.curHeightMap = false;
                    this.levelWidth = 0;
                    this.levelHeight = 0;
                    this.curPaletteIndex = 0;
                    this.tiles = [];
                    this.tilePieces = [];
                    this.tileChunks = [];
                    this.chunkMap = [];
                    this.rings = [];
                    this.objects = [];
                    this.heightMaps = [];
                    this.tiles = [];
                    this.curHeightMap = true;
                    this.curPaletteIndex = 0;
                    this.levelWidth = 0;
                    this.levelHeight = 0;
                }
                SonicLevel.prototype.getChunkAt = function (x, y) {
                    return this.tileChunks[this.chunkMap[x][y]];
                };
                SonicLevel.prototype.clearCache = function () {
                    for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                        var tile = _a[_i];
                        tile.clearCache();
                    }
                    for (var _b = 0, _c = this.tileChunks; _b < _c.length; _b++) {
                        var chunk = _c[_b];
                        chunk.clearCache();
                    }
                };
                SonicLevel.prototype.getTile = function (tile) {
                    return this.tiles[tile];
                };
                SonicLevel.prototype.getTilePiece = function (block) {
                    return this.tilePieces[block];
                };
                SonicLevel.prototype.setChunkAt = function (x, y, tileChunk) {
                    this.chunkMap[x][y] = tileChunk.Index;
                };
                return SonicLevel;
            }());
            exports_1("SonicLevel", SonicLevel);
            PaletteItem = (function () {
                function PaletteItem() {
                    this.SkipIndex = 0;
                    this.TotalLength = 0;
                }
                return PaletteItem;
            }());
            exports_1("PaletteItem", PaletteItem);
            PaletteItemPieces = (function () {
                function PaletteItemPieces() {
                    this.PaletteIndex = 0;
                    this.PaletteMultiply = 0;
                    this.PaletteOffset = 0;
                }
                return PaletteItemPieces;
            }());
            exports_1("PaletteItemPieces", PaletteItemPieces);
        }
    }
});
//# sourceMappingURL=SonicLevel.js.map