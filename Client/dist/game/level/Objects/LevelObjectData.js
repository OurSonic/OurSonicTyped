System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LevelObjectData;
    return {
        setters:[],
        execute: function() {
            LevelObjectData = (function () {
                function LevelObjectData() {
                    this.assets = [];
                    this.pieces = [];
                    this.projectiles = [];
                    this.pieceLayouts = [];
                    this.key = "";
                    this.description = "";
                    this.initScript = "";
                    this.tickScript = "";
                    this.collideScript = "";
                    this.hurtScript = "";
                }
                return LevelObjectData;
            }());
            exports_1("LevelObjectData", LevelObjectData);
        }
    }
});
