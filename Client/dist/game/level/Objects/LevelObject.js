System.register(["../../SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicManager_1;
    var LevelObject;
    return {
        setters:[
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            LevelObject = (function () {
                function LevelObject(key) {
                    this.cacheCompiled = {};
                    this.cacheLast = {};
                    this.key = key;
                    this.initScript = "this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};";
                    this.pieces = [];
                    this.pieceLayouts = [];
                    this.projectiles = [];
                    this.assets = [];
                }
                LevelObject.prototype.init = function ($object, level, sonic) {
                    $object.reset();
                    this.evalMe("initScript").apply($object, [$object, level, sonic]);
                };
                LevelObject.prototype.onCollide = function ($object, level, sonic, sensor, piece) {
                    return this.evalMe("collideScript").apply($object, [$object, level, sonic, sensor, piece]);
                };
                LevelObject.prototype.onHurtSonic = function ($object, level, sonic, sensor, piece) {
                    return this.evalMe("hurtScript").apply($object, [$object, level, sonic, sensor, piece]);
                };
                LevelObject.prototype.tick = function ($object, level, sonic) {
                    if ($object.lastDrawTick != SonicManager_1.SonicManager.instance.tickCount - 1)
                        this.init($object, level, sonic);
                    $object.lastDrawTick = SonicManager_1.SonicManager.instance.tickCount;
                    this.evalMe("tickScript").apply($object, [$object, level, sonic]);
                    if ($object.state) {
                        $object.xsp = $object.state.xsp;
                        $object.ysp = $object.state.ysp;
                    }
                    $object.x += $object.xsp;
                    $object.y += $object.ysp;
                    return true;
                };
                LevelObject.prototype.die = function () {
                };
                LevelObject.prototype.evalMe = function (js) {
                    if (this.cacheLast[js] == null)
                        this.cacheLast[js] = null;
                    if (this.cacheLast[js] != this[js])
                        this.cacheCompiled[js] = null;
                    this.cacheLast[js] = this[js];
                    if (this.cacheCompiled[js] == null) {
                        this.cacheCompiled[js] = (eval("(function(object,level,sonic,sensor,piece){" + this[js] + "});"));
                    }
                    return this.cacheCompiled[js];
                };
                return LevelObject;
            }());
            exports_1("LevelObject", LevelObject);
        }
    }
});
//# sourceMappingURL=LevelObject.js.map