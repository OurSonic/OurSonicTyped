System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SpriteCache, SpriteCacheIndexes;
    return {
        setters:[],
        execute: function() {
            SpriteCache = (function () {
                function SpriteCache() {
                    this.Rings = new Array();
                    this.TileChunks = new Array();
                    this.Tilepieces = {};
                    this.Tiles = new Array();
                    this.SonicSprites = {};
                    this.HeightMaps = new Array();
                    this.HeightMapChunks = {};
                    this.Indexes = new SpriteCacheIndexes();
                }
                SpriteCache.prototype.ClearCache = function () {
                    this.HeightMaps = new Array();
                    this.HeightMapChunks = {};
                };
                return SpriteCache;
            }());
            exports_1("SpriteCache", SpriteCache);
            SpriteCacheIndexes = (function () {
                function SpriteCacheIndexes() {
                    this.Sprites = 0;
                    this.Tps = 0;
                    this.Tcs = 0;
                    this.Ss = 0;
                    this.Hms = 0;
                    this.Hmc = 0;
                    this.Tls = 0;
                    this.Px = 0;
                    this.Aes = 0;
                }
                return SpriteCacheIndexes;
            }());
            exports_1("SpriteCacheIndexes", SpriteCacheIndexes);
        }
    }
});
