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
                    this.Key = key;
                    this.InitScript = "this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};";
                    this.Pieces = [];
                    this.PieceLayouts = [];
                    this.Projectiles = [];
                    this.Assets = [];
                }
                LevelObject.prototype.Init = function ($object, level, sonic) {
                    $object.Reset();
                    this.evalMe("InitScript").apply($object, [$object, level, sonic]);
                };
                LevelObject.prototype.OnCollide = function ($object, level, sonic, sensor, piece) {
                    return this.evalMe("CollideScript").apply($object, [$object, level, sonic, sensor, piece]);
                };
                LevelObject.prototype.OnHurtSonic = function ($object, level, sonic, sensor, piece) {
                    return this.evalMe("HurtScript").apply($object, [$object, level, sonic, sensor, piece]);
                };
                LevelObject.prototype.Tick = function ($object, level, sonic) {
                    if ($object.lastDrawTick != SonicManager_1.SonicManager.instance.tickCount - 1)
                        this.Init($object, level, sonic);
                    $object.lastDrawTick = SonicManager_1.SonicManager.instance.tickCount;
                    this.evalMe("TickScript").apply($object, [$object, level, sonic]);
                    if ($object.State) {
                        $object.Xsp = $object.State.Xsp;
                        $object.Ysp = $object.State.Ysp;
                    }
                    $object.X += $object.Xsp;
                    $object.Y += $object.Ysp;
                    return true;
                };
                LevelObject.prototype.Die = function () {
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
