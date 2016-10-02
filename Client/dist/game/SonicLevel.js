System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicLevel, PaletteItem, PaletteItemPieces;
    return {
        setters:[],
        execute: function() {
            SonicLevel = (function () {
                function SonicLevel() {
                    this.CurHeightMap = false;
                    this.LevelWidth = 0;
                    this.LevelHeight = 0;
                    this.CurPaletteIndex = 0;
                    this.Tiles = new Array();
                    this.TilePieces = new Array();
                    this.TileChunks = new Array();
                    this.ChunkMap = new Array(0);
                    this.Rings = new Array();
                    this.Objects = new Array();
                    this.HeightMaps = new Array();
                    this.Tiles = new Array();
                    this.CurHeightMap = true;
                    this.CurPaletteIndex = 0;
                    this.LevelWidth = 0;
                    this.LevelHeight = 0;
                }
                SonicLevel.prototype.getChunkAt = function (x, y) {
                    return this.TileChunks[this.ChunkMap[x][y]];
                };
                SonicLevel.prototype.ClearCache = function () {
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var tile = _a[_i];
                        tile.ClearCache();
                    }
                    for (var _b = 0, _c = this.TileChunks; _b < _c.length; _b++) {
                        var chunk = _c[_b];
                        chunk.clearCache();
                    }
                };
                SonicLevel.prototype.GetTile = function (tile) {
                    return this.Tiles[tile];
                };
                SonicLevel.prototype.GetTilePiece = function (block) {
                    return this.TilePieces[block];
                };
                SonicLevel.prototype.SetChunkAt = function (x, y, tileChunk) {
                    this.ChunkMap[x][y] = tileChunk.Index;
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
