var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("layout/directives/draggableDirective", ['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var DraggableDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DraggableDirective = (function () {
                function DraggableDirective(el) {
                    $(el.nativeElement).draggable({ cancel: ".window .inner-window" });
                }
                DraggableDirective = __decorate([
                    core_1.Directive({
                        selector: '[draggable]',
                    }),
                    __param(0, (core_1.Inject)), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
                ], DraggableDirective);
                return DraggableDirective;
                var _a;
            }());
            exports_1("DraggableDirective", DraggableDirective);
        }
    }
});
System.register("layout/windowComponent/WindowComponent", ['angular2/core', "layout/directives/draggableDirective"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_2, draggableDirective_1;
    var WindowComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (draggableDirective_1_1) {
                draggableDirective_1 = draggableDirective_1_1;
            }],
        execute: function() {
            WindowComponent = (function () {
                function WindowComponent(el) {
                    this.onclose = new core_2.EventEmitter();
                    this.visible = true;
                }
                WindowComponent.prototype.minimize = function () {
                    this.visible = false;
                };
                WindowComponent.prototype.maximize = function () {
                    this.visible = false;
                };
                WindowComponent.prototype.close = function () {
                    this.visible = false;
                    this.onclose.emit(true);
                };
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', Boolean)
                ], WindowComponent.prototype, "visible", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "width", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "height", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "left", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "top", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "windowTitle", void 0);
                __decorate([
                    core_2.Output(), 
                    __metadata('design:type', (typeof (_a = typeof core_2.EventEmitter !== 'undefined' && core_2.EventEmitter) === 'function' && _a) || Object)
                ], WindowComponent.prototype, "onclose", void 0);
                WindowComponent = __decorate([
                    core_2.Component({
                        selector: 'window',
                        templateUrl: 'app/layout/windowComponent/windowComponent.html',
                        directives: [draggableDirective_1.DraggableDirective],
                    }), 
                    __metadata('design:paramtypes', [(typeof (_b = typeof core_2.ElementRef !== 'undefined' && core_2.ElementRef) === 'function' && _b) || Object])
                ], WindowComponent);
                return WindowComponent;
                var _a, _b;
            }());
            exports_2("WindowComponent", WindowComponent);
        }
    }
});
System.register("layout/objectSelector/ObjectSelector", ['angular2/core', "layout/windowComponent/WindowComponent"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_3, WindowComponent_1;
    var ObjectSelector;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (WindowComponent_1_1) {
                WindowComponent_1 = WindowComponent_1_1;
            }],
        execute: function() {
            ObjectSelector = (function () {
                function ObjectSelector() {
                }
                ObjectSelector = __decorate([
                    core_3.Component({
                        selector: 'object-selector',
                        templateUrl: 'app/layout/objectSelector/objectSelector.html',
                        directives: [WindowComponent_1.WindowComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ObjectSelector);
                return ObjectSelector;
            }());
            exports_3("ObjectSelector", ObjectSelector);
        }
    }
});
System.register("layout/services/LevelService", ['angular2/core', 'angular2/http'], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_4, http_1;
    var LevelService, SonicLevelData;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            LevelService = (function () {
                function LevelService(http) {
                    this.http = http;
                    this._getLevelsUrl = 'http://localhost:8080/levels.json';
                }
                LevelService.prototype.getLevels = function () {
                    return this.http.get(this._getLevelsUrl)
                        .map(function (res) { return res.json(); });
                };
                LevelService = __decorate([
                    core_4.Injectable(), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
                ], LevelService);
                return LevelService;
                var _a;
            }());
            exports_4("LevelService", LevelService);
            SonicLevelData = (function () {
                function SonicLevelData() {
                }
                return SonicLevelData;
            }());
            exports_4("SonicLevelData", SonicLevelData);
        }
    }
});
System.register("layout/levelSelector/LevelSelector", ['angular2/core', "layout/windowComponent/WindowComponent", "layout/services/LevelService"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_5, WindowComponent_2, LevelService_1;
    var LevelSelector;
    return {
        setters:[
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (WindowComponent_2_1) {
                WindowComponent_2 = WindowComponent_2_1;
            },
            function (LevelService_1_1) {
                LevelService_1 = LevelService_1_1;
            }],
        execute: function() {
            LevelSelector = (function () {
                function LevelSelector(_levelService) {
                    this._levelService = _levelService;
                }
                LevelSelector.prototype.ngOnInit = function () {
                    var _this = this;
                    this._levelService.getLevels().subscribe(function (levels) {
                        _this.levels = levels;
                    });
                };
                LevelSelector.prototype.closedWindow = function (done) {
                    console.log(done);
                    debugger;
                };
                LevelSelector = __decorate([
                    core_5.Component({
                        selector: 'level-selector',
                        templateUrl: 'app/layout/levelSelector/levelSelector.html',
                        directives: [WindowComponent_2.WindowComponent],
                        providers: [LevelService_1.LevelService]
                    }), 
                    __metadata('design:paramtypes', [LevelService_1.LevelService])
                ], LevelSelector);
                return LevelSelector;
            }());
            exports_5("LevelSelector", LevelSelector);
        }
    }
});
System.register("layout/Layout", ['angular2/core', "layout/objectSelector/ObjectSelector", "layout/levelSelector/LevelSelector", 'rxjs/Rx'], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_6, ObjectSelector_1, LevelSelector_1;
    var Layout;
    return {
        setters:[
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (ObjectSelector_1_1) {
                ObjectSelector_1 = ObjectSelector_1_1;
            },
            function (LevelSelector_1_1) {
                LevelSelector_1 = LevelSelector_1_1;
            },
            function (_1) {}],
        execute: function() {
            Layout = (function () {
                function Layout() {
                }
                Layout = __decorate([
                    core_6.Component({
                        selector: 'layout',
                        templateUrl: 'app/layout/layout.html',
                        directives: [ObjectSelector_1.ObjectSelector, LevelSelector_1.LevelSelector]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Layout);
                return Layout;
            }());
            exports_6("Layout", Layout);
        }
    }
});
///<reference path="../../typings/jQuery.d.ts"/>
System.register("common/CanvasInformation", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var CanvasInformation;
    return {
        setters:[],
        execute: function() {
            CanvasInformation = (function () {
                function CanvasInformation(context, domCanvas) {
                    this.Context = context;
                    this.domCanvas = domCanvas;
                    this.canvas = domCanvas[0];
                }
                Object.defineProperty(CanvasInformation, "BlackPixel", {
                    get: function () {
                        if (CanvasInformation.blackPixel == null) {
                            var m = CanvasInformation.create(0, 0, false);
                            m.Context.fillStyle = "black";
                            m.Context.fillRect(0, 0, 1, 1);
                            CanvasInformation.blackPixel = m.canvas;
                        }
                        return CanvasInformation.blackPixel;
                    },
                    enumerable: true,
                    configurable: true
                });
                CanvasInformation.create = function (w, h, pixelated) {
                    var canvas = document.createElement("canvas");
                    return CanvasInformation.CreateFromElement(canvas, w, h, pixelated);
                };
                CanvasInformation.CreateFromElement = function (canvas, w, h, pixelated) {
                    if (w == 0)
                        w = 1;
                    if (h == 0)
                        h = 1;
                    canvas.width = w;
                    canvas.height = h;
                    var ctx = canvas.getContext("2d");
                    if (pixelated) {
                        ctx.mozImageSmoothingEnabled = false; /// future
                        ctx.msImageSmoothingEnabled = false; /// future
                        ctx.imageSmoothingEnabled = false; /// future
                    }
                    return new CanvasInformation(ctx, $(canvas));
                };
                return CanvasInformation;
            }());
            exports_7("CanvasInformation", CanvasInformation);
        }
    }
});
System.register("common/Utils", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Point, DoublePoint, IntersectingRectangle, Rectangle;
    return {
        setters:[],
        execute: function() {
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                Object.defineProperty(Point.prototype, "x", {
                    get: function () {
                        return this._x | 0;
                    },
                    set: function (val) {
                        this._x = val | 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Point.prototype, "y", {
                    get: function () {
                        return this._y | 0;
                    },
                    set: function (val) {
                        this._y = val | 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Point.Create = function (pos) {
                    return new Point(pos.x, pos.y);
                };
                Point.prototype.Offset = function (windowLocation) {
                    return new Point(this.x + windowLocation.x, this.y + windowLocation.y);
                };
                Point.prototype.NegatePoint = function (windowLocation) {
                    return new Point(this.x - windowLocation.x, this.y - windowLocation.y);
                };
                Point.prototype.Negate = function (x, y) {
                    return new Point(this.x - (x | 0), this.y - (y | 0));
                };
                Point.prototype.Set = function (x, y) {
                    this.x = x;
                    this.y = y;
                };
                return Point;
            }());
            exports_8("Point", Point);
            DoublePoint = (function () {
                function DoublePoint(x, y) {
                    this.x = x;
                    this.y = y;
                }
                DoublePoint.create = function (pos) {
                    return new DoublePoint(pos.x, pos.y);
                };
                DoublePoint.prototype.Offset = function (windowLocation) {
                    return new DoublePoint(this.x + windowLocation.x, this.y + windowLocation.y);
                };
                DoublePoint.prototype.NegatePoint = function (windowLocation) {
                    return new DoublePoint(this.x - windowLocation.x, this.y - windowLocation.y);
                };
                DoublePoint.prototype.Negate = function (x, y) {
                    return new DoublePoint(this.x - (x | 0), this.y - (y | 0));
                };
                DoublePoint.prototype.et = function (x, y) {
                    this.x = x;
                    this.y = y;
                };
                return DoublePoint;
            }());
            exports_8("DoublePoint", DoublePoint);
            IntersectingRectangle = (function (_super) {
                __extends(IntersectingRectangle, _super);
                function IntersectingRectangle(x, y, width, height) {
                    _super.call(this, x, y);
                    this.Width = width;
                    this.Height = height;
                }
                IntersectingRectangle.prototype.Intersects = function (p) {
                    return this.x < p.x && this.x + this.Width > p.x && this.y < p.y && this.y + this.Height > p.y;
                };
                IntersectingRectangle.IntersectsRect = function (r, p) {
                    return r.x < p.x && r.x + r.Width > p.x && r.y < p.y && r.y + r.Height > p.y;
                };
                IntersectingRectangle.IntersectRect = function (r1, r2) {
                    return !(r2.x > r1.x + r1.Width || r2.x + 0 < r1.x || r2.y > r1.y + r1.Height || r2.y + 0 < r1.y);
                };
                return IntersectingRectangle;
            }(Point));
            exports_8("IntersectingRectangle", IntersectingRectangle);
            Rectangle = (function (_super) {
                __extends(Rectangle, _super);
                function Rectangle(x, y, width, height) {
                    if (x === void 0) { x = 0; }
                    if (y === void 0) { y = 0; }
                    if (width === void 0) { width = 0; }
                    if (height === void 0) { height = 0; }
                    _super.call(this, x, y);
                    this.Width = width;
                    this.Height = height;
                }
                return Rectangle;
            }(Point));
            exports_8("Rectangle", Rectangle);
        }
    }
});
System.register("game/level/SonicImage", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var SonicImage;
    return {
        setters:[],
        execute: function() {
            SonicImage = (function () {
                function SonicImage(bytes, palette, width, height) {
                    this.Bytes = bytes;
                    this.Palette = palette;
                    this.Width = width;
                    this.Height = height;
                }
                return SonicImage;
            }());
            exports_9("SonicImage", SonicImage);
        }
    }
});
System.register("common/Enums", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var GameState, ClickState, ChunkLayerState, RotationMode;
    return {
        setters:[],
        execute: function() {
            (function (GameState) {
                GameState[GameState["Playing"] = 0] = "Playing";
                GameState[GameState["Editing"] = 1] = "Editing";
            })(GameState || (GameState = {}));
            exports_10("GameState", GameState);
            (function (ClickState) {
                ClickState[ClickState["Dragging"] = 0] = "Dragging";
                ClickState[ClickState["PlaceChunk"] = 1] = "PlaceChunk";
                ClickState[ClickState["PlaceRing"] = 2] = "PlaceRing";
                ClickState[ClickState["PlaceObject"] = 3] = "PlaceObject";
            })(ClickState || (ClickState = {}));
            exports_10("ClickState", ClickState);
            (function (ChunkLayerState) {
                ChunkLayerState[ChunkLayerState["Low"] = 0] = "Low";
                ChunkLayerState[ChunkLayerState["High"] = 1] = "High";
            })(ChunkLayerState || (ChunkLayerState = {}));
            exports_10("ChunkLayerState", ChunkLayerState);
            (function (RotationMode) {
                RotationMode[RotationMode["Floor"] = 134] = "Floor";
                RotationMode[RotationMode["RightWall"] = 224] = "RightWall";
                RotationMode[RotationMode["Ceiling"] = 314] = "Ceiling";
                RotationMode[RotationMode["LeftWall"] = 44] = "LeftWall";
            })(RotationMode || (RotationMode = {}));
            exports_10("RotationMode", RotationMode);
        }
    }
});
System.register("common/Color", [], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var Color;
    return {
        setters:[],
        execute: function() {
            /*[Serializable]*/
            Color = (function () {
                function Color(r, g, b, a) {
                    if (a === void 0) { a = 1; }
                    this.R = r;
                    this.G = g;
                    this.B = b;
                    this.A = a;
                }
                return Color;
            }());
            exports_11("Color", Color);
        }
    }
});
///<reference path="../../typings/Compress.d.ts"/>
System.register("common/Help", ["common/Utils", "common/CanvasInformation", "common/Color", "common/Enums", "game/SonicManager"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var Utils_1, CanvasInformation_1, Color_1, Enums_1, SonicManager_1;
    var Help;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            }],
        execute: function() {
            Help = (function () {
                function Help() {
                }
                Help.sin = function (f) {
                    return Help.cos_table[(f + 0x40) & 0xFF];
                };
                Help.cos = function (f) {
                    return Help.cos_table[(f) & 0xFF];
                };
                Help.mod = function (j, n) {
                    return ((j % n) + n) % n;
                };
                Help.scaleSprite = function (image, scale) {
                    var canv = CanvasInformation_1.CanvasInformation.create(image.width * scale.x, image.height * scale.y, true);
                    canv.Context.save();
                    canv.Context.scale(scale.x, scale.y);
                    canv.Context.drawImage(image, 0, 0);
                    canv.Context.restore();
                    return canv;
                };
                Help.scalePixelData = function (scale, data) {
                    var Uint8ClampedArray = data.data;
                    var colors = new Array(Uint8ClampedArray.length / 4 | 0);
                    for (var f = 0; f < Uint8ClampedArray.length; f += 4) {
                        colors[f / 4 | 0] = (Help.colorObjectFromData(Uint8ClampedArray, f));
                    }
                    var d = CanvasInformation_1.CanvasInformation.create(1, 1, false).Context.createImageData(data.width * scale.x, data.height * scale.y);
                    Help.setDataFromColors(d.data, colors, scale, data.width, colors[0]);
                    return d;
                };
                Help.setDataFromColors = function (data, colors, scale, width, transparent) {
                    for (var i = 0; i < colors.length; i++) {
                        var curX = i % width;
                        var curY = i / width | 0;
                        var g = colors[i];
                        var isTrans = false;
                        if (transparent) {
                            if (g.R == transparent.R && g.G == transparent.G && g.B == transparent.B)
                                isTrans = true;
                        }
                        for (var j = 0; j < scale.x; j++) {
                            for (var k = 0; k < scale.y; k++) {
                                var x = (curX * scale.x + j);
                                var y = (curY * scale.y + k);
                                var c = (x + y * (scale.x * width)) * 4;
                                if (isTrans) {
                                    data[c + 0] = 0;
                                    data[c + 1] = 0;
                                    data[c + 2] = 0;
                                    data[c + 3] = 0;
                                    continue;
                                }
                                data[c] = g.R | 0;
                                data[c + 1] = g.G | 0;
                                data[c + 2] = g.B | 0;
                                data[c + 3] = 255;
                            }
                        }
                    }
                };
                Help.getBase64Image = function (data) {
                    var canvas = document.createElement("canvas");
                    canvas.width = data.width;
                    canvas.height = data.height;
                    var ctx = canvas.getContext("2d");
                    ctx.putImageData(data, 0, 0);
                    var dataURL = canvas.toDataURL("image/png");
                    return dataURL;
                };
                Help.colorObjectFromData = function (data, c) {
                    var r = data[c];
                    var g = data[c + 1];
                    var b = data[c + 2];
                    var a = data[c + 3];
                    return new Color_1.Color(r, g, b, a);
                };
                Help.getImageData = function (image) {
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    var data = ctx.getImageData(0, 0, image.width, image.height);
                    return data;
                };
                Help.scaleCsImage = function (image, scale, complete) {
                    var df = image.Bytes;
                    var colors = new Array(df.length);
                    for (var f = 0; f < df.length; f++) {
                        var c = image.Palette[df[f]];
                        colors[f] = new Color_1.Color(c[0], c[1], c[2], c[3]);
                    }
                    var dc = CanvasInformation_1.CanvasInformation.create(1, 1, false);
                    var d = dc.Context.createImageData(image.Width * scale.x, image.Height * scale.y);
                    Help.setDataFromColors(d.data, colors, scale, image.Width, colors[0]);
                    return Help.loadSprite(Help.getBase64Image(d), complete);
                };
                Help.isLoaded = function (element) {
                    return element.getAttribute("loaded") == "true";
                };
                Help.loaded = function (element, set) {
                    element.setAttribute("loaded", set ? "true" : "false");
                };
                Help.loadSprite = function (src, complete) {
                    var sprite1 = new Image();
                    sprite1.addEventListener("load", function (e) {
                        Help.loaded(sprite1, true);
                        if (complete)
                            complete(sprite1);
                    }, false);
                    sprite1.src = src;
                    return sprite1;
                };
                Help.decodeString = function (lvl) {
                    return new Compressor().DecompressText(lvl);
                };
                Help.fixAngle = function (angle) {
                    var fixedAng = Math.floor((256 - angle) * 1.4062) % 360 | 0;
                    var flop = 360 - fixedAng;
                    return Help.degToRad(flop);
                };
                Help.degToRad = function (angle) {
                    return angle * Math.PI / 180;
                };
                Help.sign = function (m) {
                    return m == 0 ? 0 : (m < 0 ? -1 : 1);
                };
                Help.floor = function (spinDashSpeed) {
                    if (spinDashSpeed > 0)
                        return ~~spinDashSpeed;
                    return Math.floor(spinDashSpeed) | 0;
                };
                Help.max = function (f1, f2) {
                    return f1 < f2 ? f2 : f1;
                };
                Help.min = function (f1, f2) {
                    return f1 > f2 ? f2 : f1;
                };
                Help.getCursorPosition = function (ev) {
                    if (ev.originalEvent && ev.originalEvent.targetTouches && ev.originalEvent.targetTouches.length > 0)
                        ev = (ev.originalEvent.targetTouches[0]);
                    if (ev.pageX && ev.pageY)
                        return new Utils_1.Point(ev.pageX, ev.pageY);
                    return new Utils_1.Point(ev.clientX, ev.clientY /*, 0, ev.Which == 3*/);
                };
                Help.stringify = function (obj) {
                    return JSON.stringify(obj, function (key, value) {
                        if (key.indexOf("$") == 0)
                            return undefined;
                        if (key == "image")
                            return undefined;
                        if (key == "imageData")
                            return undefined;
                        if (key == "oldScale")
                            return undefined;
                        if (key == "sprite")
                            return undefined;
                        if (key == "sprites")
                            return undefined;
                        if (key == "index")
                            return undefined;
                        if (key == "_style")
                            return undefined;
                        else
                            return value;
                    });
                };
                Help.safeResize = function (block, width, height) {
                    var m = CanvasInformation_1.CanvasInformation.create(width, height, false);
                    m.Context.drawImage(block.canvas, 0, 0);
                    return m;
                };
                Help.getQueryString = function () {
                    var result = {};
                    var queryString = window.location.search.substring(1);
                    var re = new RegExp("/([^&=]+)=([^&]*)/g");
                    var m;
                    while ((m = re.exec(queryString)) != null) {
                        result[window.decodeURIComponent(m[1])] = window.decodeURIComponent(m[2]);
                    }
                    return result;
                };
                Help.merge = function (base, update) {
                    for (var i in update) {
                        base[i] = update[i];
                    }
                    return base;
                };
                Help.defaultWindowLocation = function (gameState, scale) {
                    switch (gameState) {
                        case Enums_1.GameState.Playing:
                            return new Utils_1.IntersectingRectangle(0, 0, 320, 224);
                        case Enums_1.GameState.Editing:
                            var x = 0;
                            var y = 0;
                            if (SonicManager_1.SonicManager.instance.sonicLevel && SonicManager_1.SonicManager.instance.sonicLevel.StartPositions && SonicManager_1.SonicManager.instance.sonicLevel.StartPositions[0]) {
                                x = SonicManager_1.SonicManager.instance.sonicLevel.StartPositions[0].x - 128 * scale.x;
                                y = SonicManager_1.SonicManager.instance.sonicLevel.StartPositions[0].y - 128 * scale.y;
                            }
                            return new Utils_1.IntersectingRectangle(x, y, window.innerWidth, window.innerHeight);
                    }
                    return null;
                };
                Help.cos_table = new Array(1.00000, 0.99970, 0.99880, 0.99729, 0.99518, 0.99248, 0.98918, 0.98528, 0.98079, 0.97570, 0.97003, 0.96378, 0.95694, 0.94953, 0.94154, 0.93299, 0.92388, 0.91421, 0.90399, 0.89322, 0.88192, 0.87009, 0.85773, 0.84485, 0.83147, 0.81758, 0.80321, 0.78835, 0.77301, 0.75721, 0.74095, 0.72425, 0.70711, 0.68954, 0.67156, 0.65317, 0.63439, 0.61523, 0.59570, 0.57581, 0.55557, 0.53500, 0.51410, 0.49290, 0.47140, 0.44961, 0.42755, 0.40524, 0.38268, 0.35990, 0.33689, 0.31368, 0.29028, 0.26671, 0.24298, 0.21910, 0.19509, 0.17096, 0.14673, 0.12241, 0.09802, 0.07356, 0.04907, 0.02454, 0.00000, -0.02454, -0.04907, -0.07356, -0.09802, -0.12241, -0.14673, -0.17096, -0.19509, -0.21910, -0.24298, -0.26671, -0.29028, -0.31368, -0.33689, -0.35990, -0.38268, -0.40524, -0.42755, -0.44961, -0.47140, -0.49290, -0.51410, -0.53500, -0.55557, -0.57581, -0.59570, -0.61523, -0.63439, -0.65317, -0.67156, -0.68954, -0.70711, -0.72425, -0.74095, -0.75721, -0.77301, -0.78835, -0.80321, -0.81758, -0.83147, -0.84485, -0.85773, -0.87009, -0.88192, -0.89322, -0.90399, -0.91421, -0.92388, -0.93299, -0.94154, -0.94953, -0.95694, -0.96378, -0.97003, -0.97570, -0.98079, -0.98528, -0.98918, -0.99248, -0.99518, -0.99729, -0.99880, -0.99970, -1.00000, -0.99970, -0.99880, -0.99729, -0.99518, -0.99248, -0.98918, -0.98528, -0.98079, -0.97570, -0.97003, -0.96378, -0.95694, -0.94953, -0.94154, -0.93299, -0.92388, -0.91421, -0.90399, -0.89322, -0.88192, -0.87009, -0.85773, -0.84485, -0.83147, -0.81758, -0.80321, -0.78835, -0.77301, -0.75721, -0.74095, -0.72425, -0.70711, -0.68954, -0.67156, -0.65317, -0.63439, -0.61523, -0.59570, -0.57581, -0.55557, -0.53500, -0.51410, -0.49290, -0.47140, -0.44961, -0.42756, -0.40524, -0.38268, -0.35990, -0.33689, -0.31368, -0.29028, -0.26671, -0.24298, -0.21910, -0.19509, -0.17096, -0.14673, -0.12241, -0.09802, -0.07356, -0.04907, -0.02454, -0.00000, 0.02454, 0.04907, 0.07356, 0.09802, 0.12241, 0.14673, 0.17096, 0.19509, 0.21910, 0.24298, 0.26671, 0.29028, 0.31368, 0.33689, 0.35990, 0.38268, 0.40524, 0.42756, 0.44961, 0.47140, 0.49290, 0.51410, 0.53500, 0.55557, 0.57581, 0.59570, 0.61523, 0.63439, 0.65317, 0.67156, 0.68954, 0.70711, 0.72425, 0.74095, 0.75721, 0.77301, 0.78835, 0.80321, 0.81758, 0.83147, 0.84485, 0.85773, 0.87009, 0.88192, 0.89322, 0.90399, 0.91421, 0.92388, 0.93299, 0.94154, 0.94953, 0.95694, 0.96378, 0.97003, 0.97570, 0.98079, 0.98528, 0.98918, 0.99248, 0.99518, 0.99729, 0.99880, 0.99970);
                return Help;
            }());
            exports_12("Help", Help);
        }
    }
});
System.register("SLData", [], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var SLData, AnimatedPaletteItem, AnimatedPalettePiece, SLDataRingEntry, SLDataCNZBumperEntry, Solidity, SLDataChunkBlock, SLDataObjectEntry, SLDataStartPositionEntry, SLDataAnimation, SLDataAnimationFrame, SLDataPatternIndex, ObjectModelData;
    return {
        setters:[],
        execute: function() {
            SLData = (function () {
                function SLData() {
                }
                return SLData;
            }());
            exports_13("SLData", SLData);
            AnimatedPaletteItem = (function () {
                function AnimatedPaletteItem() {
                }
                return AnimatedPaletteItem;
            }());
            exports_13("AnimatedPaletteItem", AnimatedPaletteItem);
            AnimatedPalettePiece = (function () {
                function AnimatedPalettePiece() {
                }
                return AnimatedPalettePiece;
            }());
            exports_13("AnimatedPalettePiece", AnimatedPalettePiece);
            SLDataRingEntry = (function () {
                function SLDataRingEntry() {
                }
                return SLDataRingEntry;
            }());
            exports_13("SLDataRingEntry", SLDataRingEntry);
            SLDataCNZBumperEntry = (function () {
                function SLDataCNZBumperEntry() {
                }
                return SLDataCNZBumperEntry;
            }());
            exports_13("SLDataCNZBumperEntry", SLDataCNZBumperEntry);
            (function (Solidity) {
                Solidity[Solidity["NotSolid"] = 0] = "NotSolid";
                Solidity[Solidity["TopSolid"] = 1] = "TopSolid";
                Solidity[Solidity["LRBSolid"] = 2] = "LRBSolid";
                Solidity[Solidity["AllSolid"] = 3] = "AllSolid";
            })(Solidity || (Solidity = {}));
            exports_13("Solidity", Solidity);
            SLDataChunkBlock = (function () {
                function SLDataChunkBlock() {
                }
                return SLDataChunkBlock;
            }());
            exports_13("SLDataChunkBlock", SLDataChunkBlock);
            SLDataObjectEntry = (function () {
                function SLDataObjectEntry() {
                }
                return SLDataObjectEntry;
            }());
            exports_13("SLDataObjectEntry", SLDataObjectEntry);
            SLDataStartPositionEntry = (function () {
                function SLDataStartPositionEntry() {
                }
                return SLDataStartPositionEntry;
            }());
            exports_13("SLDataStartPositionEntry", SLDataStartPositionEntry);
            SLDataAnimation = (function () {
                function SLDataAnimation() {
                }
                return SLDataAnimation;
            }());
            exports_13("SLDataAnimation", SLDataAnimation);
            SLDataAnimationFrame = (function () {
                function SLDataAnimationFrame() {
                }
                return SLDataAnimationFrame;
            }());
            exports_13("SLDataAnimationFrame", SLDataAnimationFrame);
            SLDataPatternIndex = (function () {
                function SLDataPatternIndex() {
                }
                return SLDataPatternIndex;
            }());
            exports_13("SLDataPatternIndex", SLDataPatternIndex);
            ObjectModelData = (function () {
                function ObjectModelData() {
                }
                return ObjectModelData;
            }());
            exports_13("ObjectModelData", ObjectModelData);
        }
    }
});
System.register("game/level/HeightMap", ["common/Utils", "game/SonicManager", "common/CanvasInformation", "common/Help", "common/Enums"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Utils_2, SonicManager_2, CanvasInformation_2, Help_1, Enums_2;
    var HeightMap;
    return {
        setters:[
            function (Utils_2_1) {
                Utils_2 = Utils_2_1;
            },
            function (SonicManager_2_1) {
                SonicManager_2 = SonicManager_2_1;
            },
            function (CanvasInformation_2_1) {
                CanvasInformation_2 = CanvasInformation_2_1;
            },
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (Enums_2_1) {
                Enums_2 = Enums_2_1;
            }],
        execute: function() {
            HeightMap = (function () {
                function HeightMap(heightMap, i) {
                    this.Width = 0;
                    this.Height = 0;
                    this.Index = 0;
                    this.Full = undefined;
                    this.Items = heightMap;
                    this.Width = 16;
                    this.Height = 16;
                    this.Index = i;
                    this.Full = undefined;
                }
                HeightMap.FullHeight = function (full) {
                    var h = new HeightMap(null, 0);
                    h.Full = full;
                    return h;
                };
                HeightMap.prototype.SetItem = function (x, y, rotationMode) {
                    var jx = 0;
                    var jy = 0;
                    switch (rotationMode) {
                        case Enums_2.RotationMode.Floor:
                            jx = x;
                            jy = y;
                            break;
                        case Enums_2.RotationMode.LeftWall:
                            jx = y;
                            jy = 15 - x;
                            break;
                        case Enums_2.RotationMode.Ceiling:
                            jx = x;
                            jy = 15 - y;
                            break;
                        case Enums_2.RotationMode.RightWall:
                            jx = y;
                            jy = x;
                            break;
                    }
                    this.Items[jx] = 16 - jy;
                };
                HeightMap.prototype.Draw = function (canvas, pos, xflip, yflip, solid, angle) {
                    if (this.Items == null)
                        return;
                    canvas.save();
                    var oPos = Utils_2.Point.Create(pos);
                    if (xflip) {
                        pos.x = -pos.x - 16;
                        canvas.scale(-1, 1);
                    }
                    if (yflip) {
                        pos.y = -pos.y - 16;
                        canvas.scale(1, -1);
                    }
                    var fd = SonicManager_2.SonicManager.instance.spriteCache.HeightMaps[this.Index + (solid << 20)];
                    if (this.Index != -1 && fd)
                        canvas.drawImage(fd.canvas, pos.x, pos.y);
                    else {
                        var ntcanvas = CanvasInformation_2.CanvasInformation.create(16, 16, false);
                        var ncanvas = ntcanvas.Context;
                        if (solid > 0) {
                            for (var x = 0; x < 16; x++) {
                                for (var y = 0; y < 16; y++) {
                                    var jx = 0;
                                    var jy = 0;
                                    if (HeightMap.ItemsGood(this.Items, x, y)) {
                                        jx = x;
                                        jy = y;
                                        var _x = jx;
                                        var _y = jy;
                                        ncanvas.lineWidth = 1;
                                        ncanvas.fillStyle = HeightMap.colors[solid];
                                        ncanvas.fillRect(_x, _y, 1, 1);
                                        if (angle != 255) {
                                            ncanvas.beginPath();
                                            ncanvas.lineWidth = 1;
                                            ncanvas.strokeStyle = "rgba(163,241,255,0.8)";
                                            ncanvas.moveTo(16 / 2, 16 / 2);
                                            ncanvas.lineTo(16 / 2 - Help_1.Help.sin(angle) * 8, 16 / 2 - Help_1.Help.cos(angle) * 8);
                                            ncanvas.stroke();
                                        }
                                    }
                                }
                            }
                        }
                        SonicManager_2.SonicManager.instance.spriteCache.HeightMaps[this.Index + (solid << 20)] = ntcanvas;
                        canvas.drawImage(ntcanvas.canvas, pos.x, pos.y);
                    }
                    canvas.restore();
                    pos.x = oPos.x;
                    pos.y = oPos.y;
                };
                HeightMap.ItemsGood = function (items, x, y) {
                    if (items[x] < 0)
                        return Math.abs(items[x]) >= y;
                    return items[x] >= 16 - y;
                };
                HeightMap.colors = new Array("", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)");
                return HeightMap;
            }());
            exports_14("HeightMap", HeightMap);
        }
    }
});
System.register("game/level/Tiles/Tile", ["common/CanvasInformation", "common/Utils", "game/SonicManager"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var CanvasInformation_3, Utils_3, SonicManager_3;
    var Tile;
    return {
        setters:[
            function (CanvasInformation_3_1) {
                CanvasInformation_3 = CanvasInformation_3_1;
            },
            function (Utils_3_1) {
                Utils_3 = Utils_3_1;
            },
            function (SonicManager_3_1) {
                SonicManager_3 = SonicManager_3_1;
            }],
        execute: function() {
            Tile = (function () {
                function Tile(colors) {
                    this.canAnimate = true;
                    this.index = 0;
                    this.isTileAnimated = false;
                    this.baseCaches = {};
                    this.animatedPaletteCaches = {};
                    this.colors = colors;
                    this.curPaletteIndexes = null;
                }
                Tile.prototype.drawBase = function (canvas, pos, xflip, yflip, palette, isAnimatedTile) {
                    if (isAnimatedTile === void 0) { isAnimatedTile = false; }
                    if (this.animatedTileIndexes != null && (!isAnimatedTile && this.animatedTileIndexes.length > 0))
                        return;
                    var baseCacheIndex = this.getBaseCacheIndex(xflip, yflip, palette);
                    var baseCache = this.baseCaches[baseCacheIndex];
                    if (baseCache == null) {
                        var squareSize = this.colors.length;
                        var j = void 0;
                        j = CanvasInformation_3.CanvasInformation.create(squareSize, squareSize, false);
                        if (pos.x < 0 || pos.y < 0)
                            return;
                        var oPos = new Utils_3.Point(0, 0);
                        if (xflip) {
                            oPos.x = -squareSize;
                            j.Context.scale(-1, 1);
                        }
                        if (yflip) {
                            oPos.y = -squareSize;
                            j.Context.scale(1, -1);
                        }
                        var palette_ = SonicManager_3.SonicManager.instance.sonicLevel.Palette;
                        var colorPaletteIndex = (palette + SonicManager_3.SonicManager.instance.indexedPalette) % palette_.length;
                        var x = oPos.x;
                        var y = oPos.y;
                        for (var _x = 0; _x < squareSize; _x++) {
                            for (var _y = 0; _y < squareSize; _y++) {
                                var colorIndex = this.colors[_x][_y];
                                if (colorIndex == 0)
                                    continue;
                                j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                                j.Context.fillRect(x + _x, y + _y, 1, 1);
                            }
                        }
                        this.baseCaches[baseCacheIndex] = baseCache = j;
                    }
                    canvas.drawImage(baseCache.canvas, pos.x, pos.y);
                };
                Tile.prototype.getBaseCacheIndex = function (xflip, yflip, palette) {
                    return (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                Tile.prototype.getAnimatedPaletteCacheIndex = function (xflip, yflip, palette, animatedPaletteIndex, frameIndex) {
                    return (frameIndex << 8) + (animatedPaletteIndex << 7) + (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                Tile.prototype.DrawAnimatedPalette = function (canvas, pos, xflip, yflip, palette, animatedPaletteIndex, isAnimatedTile) {
                    if (isAnimatedTile === void 0) { isAnimatedTile = false; }
                    if (this.animatedTileIndexes != null && (!isAnimatedTile && this.animatedTileIndexes.length > 0))
                        return;
                    var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xflip, yflip, palette, animatedPaletteIndex, SonicManager_3.SonicManager.instance.tilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
                    var animatedPaletteCache = this.animatedPaletteCaches[animatedPaletteCacheIndex];
                    if (animatedPaletteCache == null) {
                        var squareSize = this.colors.length;
                        var j = void 0;
                        j = CanvasInformation_3.CanvasInformation.create(squareSize, squareSize, false);
                        if (pos.x < 0 || pos.y < 0)
                            return;
                        var oPos = new Utils_3.Point(0, 0);
                        if (xflip) {
                            oPos.x = -squareSize;
                            j.Context.scale(-1, 1);
                        }
                        if (yflip) {
                            oPos.y = -squareSize;
                            j.Context.scale(1, -1);
                        }
                        var palette_ = SonicManager_3.SonicManager.instance.sonicLevel.Palette;
                        var colorPaletteIndex = (palette + SonicManager_3.SonicManager.instance.indexedPalette) % palette_.length;
                        var x = oPos.x;
                        var y = oPos.y;
                        for (var _x = 0; _x < squareSize; _x++) {
                            for (var _y = 0; _y < squareSize; _y++) {
                                var colorIndex = this.colors[_x][_y];
                                if (colorIndex == 0)
                                    continue;
                                if (this.paletteIndexesToBeAnimated[animatedPaletteIndex].indexOf(colorIndex) == -1)
                                    continue;
                                j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                                j.Context.fillRect(x + _x, y + _y, 1, 1);
                            }
                        }
                        this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = j;
                    }
                    canvas.drawImage(animatedPaletteCache.canvas, pos.x, pos.y);
                };
                Tile.prototype.drawAnimatedTile = function (canvas, pos, xflip, yflip, palette, animatedTileIndex) {
                    if (this.animatedTileIndexes.indexOf(animatedTileIndex) == -1)
                        return;
                    var tileAnimationFrame = SonicManager_3.SonicManager.instance.tileAnimationManager.getCurrentFrame(animatedTileIndex);
                    var tileAnimation = tileAnimationFrame.animation;
                    var tileAnimationData = tileAnimation.animatedTileData;
                    var animationIndex = tileAnimationData.AnimationTileIndex;
                    var frame = tileAnimationFrame.frameData();
                    if (!frame) {
                        frame = tileAnimation.animatedTileData.DataFrames[0];
                    }
                    var file = tileAnimationData.GetAnimationFile();
                    var va = file[frame.StartingTileIndex + (this.index - animationIndex)];
                    if (va != null) {
                        va.drawBase(canvas, pos, xflip, yflip, palette, true);
                    }
                    else {
                    }
                };
                Tile.prototype.ShouldTileAnimate = function () {
                    return this.isTileAnimated && this.canAnimate;
                };
                Tile.prototype.GetAllPaletteIndexes = function () {
                    if (this.curPaletteIndexes == null) {
                        var d = new Array();
                        for (var _x = 0; _x < this.colors.length; _x++) {
                            var color = this.colors[_x];
                            var _loop_1 = function(_y) {
                                var col = color[_y];
                                if (col == 0)
                                    return "continue";
                                if (d.filter(function (a) { return a != col; }).length == d.length)
                                    d.push(col);
                            };
                            for (var _y = 0; _y < color.length; _y++) {
                                var state_1 = _loop_1(_y);
                                if (state_1 === "continue") continue;
                            }
                        }
                        this.curPaletteIndexes = d.slice(0);
                    }
                    return this.curPaletteIndexes;
                };
                Tile.prototype.ClearCache = function () {
                    this.curPaletteIndexes = null;
                    this.baseCaches = {};
                };
                return Tile;
            }());
            exports_15("Tile", Tile);
        }
    }
});
System.register("game/level/Tiles/TileInfo", ["game/SonicManager"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var SonicManager_4;
    var TileInfo;
    return {
        setters:[
            function (SonicManager_4_1) {
                SonicManager_4 = SonicManager_4_1;
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
                    return SonicManager_4.SonicManager.instance.sonicLevel.GetTile(this._Tile);
                };
                return TileInfo;
            }());
            exports_16("TileInfo", TileInfo);
        }
    }
});
System.register("game/level/Tiles/TilePiece", ["common/Utils", "common/CanvasInformation", "game/SonicManager"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var Utils_4, CanvasInformation_4, SonicManager_5;
    var TilePiece;
    return {
        setters:[
            function (Utils_4_1) {
                Utils_4 = Utils_4_1;
            },
            function (CanvasInformation_4_1) {
                CanvasInformation_4 = CanvasInformation_4_1;
            },
            function (SonicManager_5_1) {
                SonicManager_5 = SonicManager_5_1;
            }],
        execute: function() {
            TilePiece = (function () {
                function TilePiece() {
                    this.onlyBackground = false;
                    this.onlyBackgroundSet = false;
                    this.onlyForeground = false;
                    this.onlyForegroundSet = false;
                    this.shouldAnimate = false;
                    this.Index = 0;
                    this.animatedPaletteCaches = {};
                }
                TilePiece.prototype.Init = function () {
                    this.OnlyBackground();
                    this.OnlyForeground();
                };
                TilePiece.prototype.OnlyBackground = function () {
                    if (this.onlyBackgroundSet)
                        return this.onlyBackground;
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var mj = _a[_i];
                        if (mj) {
                            if (mj.Priority) {
                                this.onlyBackgroundSet = true;
                                return (this.onlyBackground = false);
                            }
                        }
                    }
                    this.onlyBackgroundSet = true;
                    return (this.onlyBackground = true);
                };
                TilePiece.prototype.OnlyForeground = function () {
                    if (this.onlyForegroundSet)
                        return this.onlyForeground;
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var mj = _a[_i];
                        if (mj) {
                            if (!mj.Priority) {
                                this.onlyForegroundSet = true;
                                return (this.onlyForeground = false);
                            }
                        }
                    }
                    this.onlyForegroundSet = true;
                    return (this.onlyForeground = true);
                };
                TilePiece.prototype.DrawBase = function (canvas, position, layer, xFlip, yFlip) {
                    var drawOrderIndex = 0;
                    drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                    var tilePieceLength = 8;
                    var ac = CanvasInformation_4.CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
                    var i = 0;
                    var localPoint = new Utils_4.Point(0, 0);
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var tileItem = _a[_i];
                        var tile = tileItem.GetTile();
                        if (tile) {
                            if (tileItem.Priority == (layer == 1)) {
                                var _xf = !!xFlip !== !!tileItem.XFlip;
                                var _yf = !!yFlip !== !!tileItem.YFlip;
                                var df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                                localPoint.x = df[0] * tilePieceLength;
                                localPoint.y = df[1] * tilePieceLength;
                                tile.drawBase(ac.Context, localPoint, _xf, _yf, tileItem.Palette);
                            }
                        }
                        i++;
                    }
                    canvas.drawImage(ac.canvas, position.x, position.y);
                };
                TilePiece.prototype.getAnimatedPaletteCacheIndex = function (xflip, yflip, animatedPaletteIndex, frameIndex) {
                    return (frameIndex << 8) + (animatedPaletteIndex << 7) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                TilePiece.prototype.DrawAnimatedPalette = function (canvas, position, layer, xFlip, yFlip, animatedPaletteIndex) {
                    var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xFlip, yFlip, animatedPaletteIndex, SonicManager_5.SonicManager.instance.tilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
                    var animatedPaletteCache = this.animatedPaletteCaches[animatedPaletteCacheIndex];
                    if (animatedPaletteCache == null) {
                        var drawOrderIndex = 0;
                        drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                        var tilePieceLength = 8;
                        var ac = CanvasInformation_4.CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
                        var i = 0;
                        var localPoint = new Utils_4.Point(0, 0);
                        for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                            var tileItem = _a[_i];
                            var tile = tileItem.GetTile();
                            if (tile) {
                                if (tileItem.Priority == (layer == 1)) {
                                    var _xf = !!xFlip !== !!tileItem.XFlip;
                                    var _yf = !!yFlip !== !!tileItem.YFlip;
                                    var df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                                    localPoint.x = df[0] * tilePieceLength;
                                    localPoint.y = df[1] * tilePieceLength;
                                    tile.DrawAnimatedPalette(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedPaletteIndex);
                                }
                            }
                            i++;
                        }
                        this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = ac;
                    }
                    canvas.drawImage(animatedPaletteCache.canvas, position.x, position.y);
                };
                TilePiece.prototype.DrawAnimatedTile = function (canvas, position, layer, xFlip, yFlip, animatedTileIndex) {
                    var drawOrderIndex = 0;
                    drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                    var tilePieceLength = 8;
                    var ac = CanvasInformation_4.CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
                    var i = 0;
                    var localPoint = new Utils_4.Point(0, 0);
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var tileItem = _a[_i];
                        var tile = tileItem.GetTile();
                        if (tile) {
                            if (tileItem.Priority == (layer == 1)) {
                                var _xf = !!xFlip !== !!tileItem.XFlip;
                                var _yf = !!yFlip !== !!tileItem.YFlip;
                                var df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                                localPoint.x = df[0] * tilePieceLength;
                                localPoint.y = df[1] * tilePieceLength;
                                tile.drawAnimatedTile(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedTileIndex);
                            }
                        }
                        i++;
                    }
                    canvas.drawImage(ac.canvas, position.x, position.y);
                };
                TilePiece.prototype.ShouldAnimate = function () {
                    if (this.shouldAnimate == null) {
                        for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                            var t = _a[_i];
                            var tile = t.GetTile();
                            if (tile) {
                                if (tile.ShouldTileAnimate())
                                    return (this.shouldAnimate = true);
                            }
                        }
                        this.shouldAnimate = false;
                    }
                    return (this.shouldAnimate);
                };
                TilePiece.prototype.GetLayer1Angles = function () {
                    return SonicManager_5.SonicManager.instance.sonicLevel.Angles[SonicManager_5.SonicManager.instance.sonicLevel.CollisionIndexes1[this.Index]];
                };
                TilePiece.prototype.GetLayer2Angles = function () {
                    return SonicManager_5.SonicManager.instance.sonicLevel.Angles[SonicManager_5.SonicManager.instance.sonicLevel.CollisionIndexes2[this.Index]];
                };
                TilePiece.prototype.GetLayer1HeightMaps = function () {
                    return SonicManager_5.SonicManager.instance.sonicLevel.HeightMaps[SonicManager_5.SonicManager.instance.sonicLevel.CollisionIndexes1[this.Index]];
                };
                TilePiece.prototype.GetLayer2HeightMaps = function () {
                    return SonicManager_5.SonicManager.instance.sonicLevel.HeightMaps[SonicManager_5.SonicManager.instance.sonicLevel.CollisionIndexes2[this.Index]];
                };
                TilePiece.DrawInfo = [[0, 0], [1, 0], [0, 1], [1, 1]];
                TilePiece.DrawOrder = [[3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 1, 2, 3]];
                return TilePiece;
            }());
            exports_17("TilePiece", TilePiece);
        }
    }
});
System.register("game/level/Tiles/TilePieceInfo", ["game/SonicManager", "SLData"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var SonicManager_6, SLData_1;
    var TilePieceInfo;
    return {
        setters:[
            function (SonicManager_6_1) {
                SonicManager_6 = SonicManager_6_1;
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
                    return SonicManager_6.SonicManager.instance.sonicLevel.GetTilePiece(this.Block);
                };
                TilePieceInfo.prototype.SetTilePiece = function (tp) {
                    if (this.Block == tp.Index)
                        return false;
                    this.Block = tp.Index;
                    return true;
                };
                TilePieceInfo.prototype.GetLayer1Angles = function () {
                    return SonicManager_6.SonicManager.instance.sonicLevel.Angles[SonicManager_6.SonicManager.instance.sonicLevel.CollisionIndexes1[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer2Angles = function () {
                    return SonicManager_6.SonicManager.instance.sonicLevel.Angles[SonicManager_6.SonicManager.instance.sonicLevel.CollisionIndexes2[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer1HeightMaps = function () {
                    return SonicManager_6.SonicManager.instance.sonicLevel.HeightMaps[SonicManager_6.SonicManager.instance.sonicLevel.CollisionIndexes1[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer2HeightMaps = function () {
                    return SonicManager_6.SonicManager.instance.sonicLevel.HeightMaps[SonicManager_6.SonicManager.instance.sonicLevel.CollisionIndexes2[this.Block]];
                };
                return TilePieceInfo;
            }());
            exports_18("TilePieceInfo", TilePieceInfo);
        }
    }
});
System.register("game/level/Animations/TileAnimationData", ["game/SonicManager"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var SonicManager_7;
    var TileAnimationData, TileAnimationDataFrame;
    return {
        setters:[
            function (SonicManager_7_1) {
                SonicManager_7 = SonicManager_7_1;
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
                    return SonicManager_7.SonicManager.instance.sonicLevel.AnimatedTileFiles[this.AnimationTileFile];
                };
                return TileAnimationData;
            }());
            exports_19("TileAnimationData", TileAnimationData);
            TileAnimationDataFrame = (function () {
                function TileAnimationDataFrame() {
                    this.Ticks = 0;
                    this.StartingTileIndex = 0;
                }
                return TileAnimationDataFrame;
            }());
            exports_19("TileAnimationDataFrame", TileAnimationDataFrame);
        }
    }
});
System.register("game/level/Objects/LevelObjectAssetFrame", ["common/CanvasInformation"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var CanvasInformation_5;
    var LevelObjectAssetFrame;
    return {
        setters:[
            function (CanvasInformation_5_1) {
                CanvasInformation_5 = CanvasInformation_5_1;
            }],
        execute: function() {
            LevelObjectAssetFrame = (function () {
                function LevelObjectAssetFrame(name) {
                    this.Image = {};
                    this.name = name;
                    this.collisionMap = new Array(100);
                    this.hurtSonicMap = new Array(100);
                    for (var i = 0; i < 100; i++) {
                        this.collisionMap[i] = new Array(100);
                        this.hurtSonicMap[i] = new Array(100);
                    }
                }
                LevelObjectAssetFrame.prototype.SetWidth = function (w) {
                    this.width = w;
                    this.collisionMap = this.collisionMap.slice(0, w);
                    this.ClearCache();
                };
                LevelObjectAssetFrame.prototype.SetHeight = function (h) {
                    this.height = h;
                    for (var j = 0; j < this.width; j++) {
                        this.collisionMap[j] = this.collisionMap[j].slice(0, h);
                    }
                    this.ClearCache();
                };
                LevelObjectAssetFrame.prototype.SetOffset = function (ex, ey) {
                    this.offsetX = ex;
                    this.offsetY = ey;
                    this.ClearCache();
                };
                LevelObjectAssetFrame.prototype.DrawSimple = function (mainCanvas, pos, width, height, xflip, yflip) {
                    var c = this.GetCache(false, false, false);
                    mainCanvas.save();
                    mainCanvas.translate(pos.x, pos.y);
                    mainCanvas.scale((width / this.width) | 0, (height / this.height) | 0);
                    mainCanvas.drawImage(c.canvas, 0, 0);
                    mainCanvas.restore();
                };
                LevelObjectAssetFrame.prototype.GetCache = function (showOutline, showCollideMap, showHurtMap) {
                    var m = this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)];
                    if (m == null) {
                        var mj = CanvasInformation_5.CanvasInformation.create(this.width, this.height, false);
                        var canvas = mj.Context;
                        canvas.save();
                        canvas.strokeStyle = "#000000";
                        canvas.lineWidth = 1;
                        for (var x = 0; x < this.width; x++) {
                            for (var y = 0; y < this.height; y++) {
                                var ex = x;
                                var ey = y;
                                var d = this.colorMap[ex][ey];
                                var color = this.palette[d];
                                if (color == this.transparentColor) {
                                    canvas.fillStyle = "rgba(0,0,0,0)";
                                }
                                else {
                                    canvas.fillStyle = "#" + color;
                                }
                                canvas.fillRect(ex, ey, 1, 1);
                                if (showCollideMap) {
                                    if (this.collisionMap[ex][ey] > 0) {
                                        canvas.fillStyle = "rgba(30,34,255,0.6)";
                                        canvas.fillRect(ex, ey, 1, 1);
                                    }
                                }
                                if (showHurtMap) {
                                    if (this.hurtSonicMap[ex][ey] > 0) {
                                        canvas.fillStyle = "rgba(211,12,55,0.6)";
                                        canvas.fillRect(ex, ey, 1, 1);
                                    }
                                }
                            }
                        }
                        canvas.restore();
                        m = mj;
                        this.SetCache(mj, showOutline, showCollideMap, showHurtMap);
                    }
                    return m;
                };
                LevelObjectAssetFrame.prototype.ClearCache = function () {
                    this.Image = {};
                };
                LevelObjectAssetFrame.prototype.SetCache = function (image, showOutline, showCollideMap, showHurtMap) {
                    this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)] = image;
                };
                LevelObjectAssetFrame.prototype.DrawUI = function (_canvas, pos, showOutline, showCollideMap, showHurtMap, showOffset, xflip, yflip) {
                    var fd = this.GetCache(showOutline, showCollideMap, showHurtMap);
                    _canvas.save();
                    _canvas.translate(pos.x, pos.y);
                    if (xflip) {
                        if (yflip) {
                            _canvas.translate(fd.canvas.width / 2, fd.canvas.height / 2);
                            _canvas.rotate(-90 * Math.PI / 180);
                            _canvas.translate(-fd.canvas.width / 2, -fd.canvas.height / 2);
                            _canvas.translate(0, this.height);
                            _canvas.scale(1, -1);
                        }
                        else {
                            _canvas.translate(fd.canvas.width / 2, fd.canvas.height / 2);
                            _canvas.rotate(-90 * Math.PI / 180);
                            _canvas.translate(-fd.canvas.width / 2, -fd.canvas.height / 2);
                        }
                    }
                    else {
                        if (yflip) {
                            _canvas.translate(0, this.height);
                            _canvas.scale(1, -1);
                        }
                        else {
                        }
                    }
                    _canvas.drawImage(fd.canvas, 0, 0);
                    if (showOffset) {
                        _canvas.beginPath();
                        _canvas.moveTo(this.offsetX, 0);
                        _canvas.lineTo(this.offsetX, this.height);
                        _canvas.lineWidth = 1;
                        _canvas.strokeStyle = "#000000";
                        _canvas.stroke();
                        _canvas.beginPath();
                        _canvas.moveTo(0, this.offsetY);
                        _canvas.lineTo(this.width, this.offsetY);
                        _canvas.lineWidth = 1;
                        _canvas.strokeStyle = "#000000";
                        _canvas.stroke();
                    }
                    _canvas.restore();
                };
                return LevelObjectAssetFrame;
            }());
            exports_20("LevelObjectAssetFrame", LevelObjectAssetFrame);
        }
    }
});
System.register("game/level/Objects/LevelObjectAsset", [], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var LevelObjectAsset;
    return {
        setters:[],
        execute: function() {
            LevelObjectAsset = (function () {
                function LevelObjectAsset(name) {
                    this.frames = new Array();
                    this.name = name;
                }
                return LevelObjectAsset;
            }());
            exports_21("LevelObjectAsset", LevelObjectAsset);
        }
    }
});
System.register("game/level/Objects/LevelObjectProjectile", [], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var LevelObjectProjectile;
    return {
        setters:[],
        execute: function() {
            LevelObjectProjectile = (function () {
                function LevelObjectProjectile(name) {
                    this.name = name;
                }
                return LevelObjectProjectile;
            }());
            exports_22("LevelObjectProjectile", LevelObjectProjectile);
        }
    }
});
System.register("game/level/Objects/LevelObjectPiece", [], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var LevelObjectPiece;
    return {
        setters:[],
        execute: function() {
            LevelObjectPiece = (function () {
                function LevelObjectPiece(name) {
                    this.name = name;
                }
                return LevelObjectPiece;
            }());
            exports_23("LevelObjectPiece", LevelObjectPiece);
        }
    }
});
System.register("game/level/Objects/LevelObject", ["game/SonicManager"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var SonicManager_8;
    var LevelObject;
    return {
        setters:[
            function (SonicManager_8_1) {
                SonicManager_8 = SonicManager_8_1;
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
                    if ($object.lastDrawTick != SonicManager_8.SonicManager.instance.tickCount - 1)
                        this.Init($object, level, sonic);
                    $object.lastDrawTick = SonicManager_8.SonicManager.instance.tickCount;
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
            exports_24("LevelObject", LevelObject);
        }
    }
});
System.register("game/level/Objects/LevelObjectPieceLayoutPiece", [], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var LevelObjectPieceLayoutPiece;
    return {
        setters:[],
        execute: function() {
            LevelObjectPieceLayoutPiece = (function () {
                function LevelObjectPieceLayoutPiece(pieceIndex) {
                    this.PieceIndex = pieceIndex;
                }
                return LevelObjectPieceLayoutPiece;
            }());
            exports_25("LevelObjectPieceLayoutPiece", LevelObjectPieceLayoutPiece);
        }
    }
});
System.register("game/level/Objects/LevelObjectPieceLayout", ["game/SonicManager", "common/Utils"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var SonicManager_9, Utils_5;
    var LevelObjectPieceLayout;
    return {
        setters:[
            function (SonicManager_9_1) {
                SonicManager_9 = SonicManager_9_1;
            },
            function (Utils_5_1) {
                Utils_5 = Utils_5_1;
            }],
        execute: function() {
            LevelObjectPieceLayout = (function () {
                function LevelObjectPieceLayout(name) {
                    this.name = name;
                    this.width = 350;
                    this.height = 280;
                    this.pieces = new Array();
                }
                LevelObjectPieceLayout.prototype.Update = function () {
                    for (var _i = 0, _a = SonicManager_9.SonicManager.instance.sonicLevel.Objects; _i < _a.length; _i++) {
                        var t = _a[_i];
                        t.Reset();
                    }
                };
                LevelObjectPieceLayout.prototype.DrawUI = function (canvas, showImages, selectedPieceIndex, levelObject) {
                    canvas.save();
                    if (!showImages) {
                        canvas.strokeStyle = "#000000";
                        canvas.lineWidth = 2;
                        canvas.beginPath();
                        canvas.moveTo(-1000, 0);
                        canvas.lineTo(1000, 0);
                        canvas.closePath();
                        canvas.stroke();
                        canvas.beginPath();
                        canvas.moveTo(0, -1000);
                        canvas.lineTo(0, 1000);
                        canvas.closePath();
                        canvas.stroke();
                        for (var i = 1; i < this.pieces.length; i++) {
                            var j = this.pieces[i];
                            canvas.beginPath();
                            canvas.moveTo(j.X, j.Y);
                            canvas.lineTo(this.pieces[i - 1].X, this.pieces[i - 1].Y);
                            canvas.stroke();
                        }
                    }
                    for (var _i = 0, _a = this.pieces; _i < _a.length; _i++) {
                        var levelObjectPieceLayoutPiece = _a[_i];
                        if (showImages) {
                            var piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                            var asset = levelObject.Assets[piece.assetIndex];
                            if (asset.frames.length > 0) {
                                var frm = asset.frames[0];
                                frm.DrawUI(canvas, new Utils_5.Point(levelObjectPieceLayoutPiece.X - frm.offsetX, levelObjectPieceLayoutPiece.Y - frm.offsetY), false, false, false, false, piece.xflip, piece.yflip);
                            }
                        }
                        else {
                            var drawRadial = void 0;
                            drawRadial = SonicManager_9.SonicManager.instance.mainCanvas.Context.createRadialGradient(0, 0, 0, 10, 10, 50);
                            drawRadial.addColorStop(0, "white");
                            if (selectedPieceIndex == levelObjectPieceLayoutPiece.PieceIndex)
                                drawRadial.addColorStop(1, "yellow");
                            else
                                drawRadial.addColorStop(1, "red");
                            canvas.fillStyle = drawRadial;
                            canvas.beginPath();
                            canvas.arc(levelObjectPieceLayoutPiece.X, levelObjectPieceLayoutPiece.Y, 10, 0, Math.PI * 2, true);
                            canvas.closePath();
                            canvas.fill();
                        }
                    }
                    canvas.restore();
                };
                LevelObjectPieceLayout.prototype.Draw = function (canvas, x, y, framework, instance, showHeightMap) {
                    for (var _i = 0, _a = instance.Pieces; _i < _a.length; _i++) {
                        var j = _a[_i];
                        if (!j.visible)
                            continue;
                        var piece = framework.Pieces[j.pieceIndex];
                        var asset = framework.Assets[piece.assetIndex];
                        if (asset.frames.length > 0) {
                            var frm = asset.frames[j.frameIndex];
                            frm.DrawUI(canvas, new Utils_5.Point((x) - (frm.offsetX), (y) - (frm.offsetY)), false, showHeightMap, showHeightMap, false, instance.Xflip !== !!piece.xflip, instance.Yflip !== !!piece.yflip);
                        }
                    }
                };
                LevelObjectPieceLayout.prototype.GetRectangle = function (levelObject) {
                    var left = 100000000;
                    var top = 100000000;
                    var right = -100000000;
                    var bottom = -100000000;
                    for (var _i = 0, _a = this.pieces; _i < _a.length; _i++) {
                        var levelObjectPieceLayoutPiece = _a[_i];
                        var piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                        var asset = levelObject.Assets[piece.assetIndex];
                        var frame = asset.frames[piece.frameIndex];
                        var pieceX = levelObjectPieceLayoutPiece.X - frame.offsetX;
                        var pieceY = levelObjectPieceLayoutPiece.Y - frame.offsetY;
                        var pieceWidth = frame.width;
                        var pieceHeight = frame.height;
                        if (pieceX < left) {
                            left = pieceX;
                        }
                        if (pieceY < top) {
                            top = pieceY;
                        }
                        if (pieceX + pieceWidth > right) {
                            right = pieceX + pieceWidth;
                        }
                        if (pieceY + pieceHeight > bottom) {
                            bottom = pieceY + pieceHeight;
                        }
                    }
                    return new Utils_5.Rectangle(left, top, right - left, bottom - top);
                };
                return LevelObjectPieceLayout;
            }());
            exports_26("LevelObjectPieceLayout", LevelObjectPieceLayout);
        }
    }
});
System.register("game/level/Objects/LevelObjectData", [], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
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
            exports_27("LevelObjectData", LevelObjectData);
        }
    }
});
System.register("game/level/Objects/ObjectManager", ["common/Help", "game/level/Objects/LevelObjectAsset", "game/level/Objects/LevelObjectAssetFrame", "game/level/Objects/LevelObjectProjectile", "game/level/Objects/LevelObject", "game/level/Objects/LevelObjectPieceLayout"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var Help_2, LevelObjectAsset_1, LevelObjectAssetFrame_1, LevelObjectProjectile_1, LevelObject_1, LevelObjectPieceLayout_1;
    var ObjectManager;
    return {
        setters:[
            function (Help_2_1) {
                Help_2 = Help_2_1;
            },
            function (LevelObjectAsset_1_1) {
                LevelObjectAsset_1 = LevelObjectAsset_1_1;
            },
            function (LevelObjectAssetFrame_1_1) {
                LevelObjectAssetFrame_1 = LevelObjectAssetFrame_1_1;
            },
            function (LevelObjectProjectile_1_1) {
                LevelObjectProjectile_1 = LevelObjectProjectile_1_1;
            },
            function (LevelObject_1_1) {
                LevelObject_1 = LevelObject_1_1;
            },
            function (LevelObjectPieceLayout_1_1) {
                LevelObjectPieceLayout_1 = LevelObjectPieceLayout_1_1;
            }],
        execute: function() {
            ObjectManager = (function () {
                function ObjectManager(sonicManager) {
                    this.sonicManager = sonicManager;
                }
                ObjectManager.prototype.Init = function () {
                };
                ObjectManager.ExtendObject = function (d) {
                    var obj = Help_2.Help.merge(new LevelObject_1.LevelObject(d.key), {
                        CollideScript: d.collideScript,
                        HurtScript: d.hurtScript,
                        InitScript: d.initScript,
                        TickScript: d.tickScript
                    });
                    obj.Description = d.description;
                    obj.Assets = new Array();
                    for (var i = 0; i < d.assets.length; i++) {
                        var asset = d.assets[i];
                        var levelObjectAsset = Help_2.Help.merge(new LevelObjectAsset_1.LevelObjectAsset(asset.name), { name: asset.name });
                        levelObjectAsset.frames = new Array();
                        for (var index = 0; index < asset.frames.length; index++) {
                            var fr = asset.frames[index];
                            levelObjectAsset.frames[index] = Help_2.Help.merge(new LevelObjectAssetFrame_1.LevelObjectAssetFrame(fr.name), {
                                offsetX: fr.offsetX,
                                width: fr.width,
                                transparentColor: fr.transparentColor,
                                height: fr.height,
                                offsetY: fr.offsetY,
                                hurtSonicMap: fr.hurtSonicMap,
                                collisionMap: fr.collisionMap,
                                colorMap: fr.colorMap,
                                palette: fr.palette
                            });
                        }
                        obj.Assets[i] = levelObjectAsset;
                    }
                    obj.Pieces = new Array();
                    for (var index = 0; index < d.pieces.length; index++) {
                        var piece = d.pieces[index];
                        obj.Pieces[index] = piece;
                    }
                    obj.PieceLayouts = new Array();
                    for (var index = 0; index < d.pieceLayouts.length; index++) {
                        var pl = d.pieceLayouts[index];
                        obj.PieceLayouts[index] = Help_2.Help.merge(new LevelObjectPieceLayout_1.LevelObjectPieceLayout(pl.name), {
                            height: pl.height,
                            width: pl.width
                        });
                        obj.PieceLayouts[index].pieces = new Array();
                        for (var i = 0; i < d.pieceLayouts[index].pieces.length; i++) {
                            obj.PieceLayouts[index].pieces[i] = d.pieceLayouts[index].pieces[i];
                        }
                    }
                    obj.Projectiles = new Array();
                    for (var index = 0; index < d.projectiles.length; index++) {
                        var proj = d.projectiles[index];
                        proj = Help_2.Help.merge(new LevelObjectProjectile_1.LevelObjectProjectile(proj.name), {
                            x: proj.x,
                            y: proj.y,
                            xsp: proj.xsp,
                            ysp: proj.ysp,
                            xflip: proj.xflip,
                            yflip: proj.yflip,
                            assetIndex: proj.assetIndex,
                            frameIndex: proj.frameIndex
                        });
                        obj.Projectiles[index] = proj;
                    }
                    return obj;
                };
                ObjectManager.broken = Help_2.Help.loadSprite("assets/sprites/broken.png", function (e) {
                });
                return ObjectManager;
            }());
            exports_28("ObjectManager", ObjectManager);
        }
    }
});
System.register("game/level/Objects/LevelObjectInfo", ["common/Utils", "game/SonicManager", "game/level/Objects/ObjectManager"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var Utils_6, SonicManager_10, ObjectManager_1;
    var LevelObjectInfo;
    return {
        setters:[
            function (Utils_6_1) {
                Utils_6 = Utils_6_1;
            },
            function (SonicManager_10_1) {
                SonicManager_10 = SonicManager_10_1;
            },
            function (ObjectManager_1_1) {
                ObjectManager_1 = ObjectManager_1_1;
            }],
        execute: function() {
            LevelObjectInfo = (function () {
                function LevelObjectInfo(o) {
                    this._rect = new Utils_6.Rectangle(0, 0, 0, 0);
                    this.lastDrawTick = 0;
                    this.X = 0;
                    this.Y = 0;
                    this.Xsp = 0;
                    this.Ysp = 0;
                    this.Xflip = false;
                    this.Yflip = false;
                    this.Subdata = 0;
                    this.UpperNibble = 0;
                    this.LowerNibble = 0;
                    this.PieceLayoutIndex = 0;
                    this.Dead = false;
                    this.Index = 0;
                    this.O = o;
                    this.X = o.X;
                    this.Y = o.Y;
                    this.Xflip = o.XFlip;
                    this.Yflip = o.YFlip;
                    this.Subdata = o.SubType;
                    this.Key = o.ID.toString();
                    this.UpperNibble = this.Subdata >> 4;
                    this.LowerNibble = this.Subdata & 0xf;
                }
                LevelObjectInfo.prototype.Log = function (txt, level) {
                    if (level === void 0) { level = 100; }
                    if (!this.Debug)
                        this.Debug = [];
                    if (level == 0)
                        this.Debug.push(" -- " + txt + " -- ");
                    else
                        this.Debug.push(txt);
                    if (this.ConsoleLog)
                        this.ConsoleLog(this.Debug);
                };
                LevelObjectInfo.prototype.SetPieceLayoutIndex = function (ind) {
                    this.PieceLayoutIndex = ind;
                    var pcs = this.ObjectData.PieceLayouts[this.PieceLayoutIndex].pieces;
                    this.Pieces = [];
                    for (var _i = 0, pcs_1 = pcs; _i < pcs_1.length; _i++) {
                        var t = pcs_1[_i];
                        //todo look into this...
                        this.Pieces.push(t);
                    }
                };
                LevelObjectInfo.prototype.SetObjectData = function (obj) {
                    this.ObjectData = obj;
                    if (this.ObjectData.PieceLayouts.length > this.PieceLayoutIndex && this.ObjectData.PieceLayouts[this.PieceLayoutIndex].pieces.length > 0)
                        this.SetPieceLayoutIndex(this.PieceLayoutIndex);
                };
                LevelObjectInfo.prototype.Tick = function ($object, level, sonic) {
                    if (this.Dead || !this.ObjectData)
                        return false;
                    try {
                        return this.ObjectData.Tick($object, level, sonic);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.MainPieceLayout = function () {
                    return this.ObjectData.PieceLayouts[this.PieceLayoutIndex];
                };
                LevelObjectInfo.prototype.GetRect = function () {
                    if (this.ObjectData.PieceLayouts.length == 0) {
                        this._rect.x = this.X;
                        this._rect.y = this.Y;
                        this._rect.Width = ObjectManager_1.ObjectManager.broken.width;
                        this._rect.Height = ObjectManager_1.ObjectManager.broken.height;
                        return this._rect;
                    }
                    return this.ObjectData.PieceLayouts[this.PieceLayoutIndex].GetRectangle(this.ObjectData);
                };
                LevelObjectInfo.prototype.Draw = function (canvas, x, y, showHeightMap) {
                    if (this.Dead || !this.ObjectData)
                        return;
                    if (this.ObjectData.PieceLayouts.length == 0) {
                        canvas.drawImage(ObjectManager_1.ObjectManager.broken, (x - ObjectManager_1.ObjectManager.broken.width / 2), (y - ObjectManager_1.ObjectManager.broken.height / 2), ObjectManager_1.ObjectManager.broken.width, ObjectManager_1.ObjectManager.broken.height);
                        return;
                    }
                    var levelObjectPieceLayout = this.MainPieceLayout();
                    levelObjectPieceLayout.Draw(canvas, x, y, this.ObjectData, this, showHeightMap);
                    if (this.ConsoleLog != null) {
                        var gr = this.GetRect();
                        canvas.save();
                        canvas.fillStyle = "rgba(228,228,12,0.4)";
                        var wd = 1;
                        canvas.fillRect(gr.x - this.X + x - (gr.Width / 2) - wd, gr.y - this.Y + y - (gr.Height / 2) - wd, gr.Width - (gr.x - this.X) + wd * 2, gr.Height - (gr.y - this.Y) + wd * 2);
                        canvas.restore();
                    }
                };
                LevelObjectInfo.prototype.Reset = function () {
                    this.X = this.O.X;
                    this.Y = this.O.Y;
                    this.Xsp = 0;
                    this.Ysp = 0;
                    this.State = null;
                    this.Xflip = this.O.XFlip;
                    this.Yflip = this.O.YFlip;
                    this.Dead = false;
                    this.PieceLayoutIndex = 0;
                    this.Subdata = this.O.SubType;
                    this.UpperNibble = this.Subdata >> 4;
                    this.LowerNibble = this.Subdata & 0xf;
                    if (this.ObjectData.PieceLayouts.length > this.PieceLayoutIndex && this.ObjectData.PieceLayouts[this.PieceLayoutIndex].pieces.length > 0)
                        this.SetPieceLayoutIndex(this.PieceLayoutIndex);
                };
                LevelObjectInfo.prototype.Collides = function (sonic) {
                    return this.Collision(sonic, false);
                };
                LevelObjectInfo.prototype.HurtsSonic = function (sonic) {
                    return this.Collision(sonic, true);
                };
                LevelObjectInfo.prototype.Kill = function () {
                    this.Dead = true;
                };
                LevelObjectInfo.prototype.Collision = function (sonic, isHurtMap) {
                    if (this.Dead || !this.ObjectData || this.ObjectData.PieceLayouts.length == 0)
                        return null;
                    var pcs = this.Pieces;
                    var mX = ((sonic.x) - this.X) | 0;
                    var mY = ((sonic.y) - this.Y) | 0;
                    for (var _i = 0, pcs_2 = pcs; _i < pcs_2.length; _i++) {
                        var j = pcs_2[_i];
                        var piece = this.ObjectData.Pieces[j.pieceIndex];
                        var asset = this.ObjectData.Assets[piece.assetIndex];
                        if (asset.frames.length > 0) {
                            var frm = asset.frames[j.frameIndex];
                            var map = isHurtMap ? frm.hurtSonicMap : frm.collisionMap;
                            if (this.twoDArray(map, (mX + frm.offsetX), (mY + frm.offsetY), this.Xflip !== !!piece.xflip, this.Yflip !== !!piece.xflip) == true)
                                return j;
                        }
                    }
                    return null;
                };
                LevelObjectInfo.prototype.twoDArray = function (map, x, y, xflip, yflip) {
                    if (!map || x < 0 || y < 0 || x > map.length)
                        return false;
                    var d = map[x];
                    if (!d || y > d.length)
                        return false;
                    return d[y] > 0;
                };
                LevelObjectInfo.prototype.Collide = function (sonic, sensor, piece) {
                    try {
                        return this.ObjectData.OnCollide(this, SonicManager_10.SonicManager.instance.sonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.HurtSonic = function (sonic, sensor, piece) {
                    try {
                        return this.ObjectData.OnHurtSonic(this, SonicManager_10.SonicManager.instance.sonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                return LevelObjectInfo;
            }());
            exports_29("LevelObjectInfo", LevelObjectInfo);
        }
    }
});
System.register("game/level/Ring", ["common/Utils", "game/SonicManager", "common/Enums"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var Utils_7, SonicManager_11, Enums_3;
    var Ring;
    return {
        setters:[
            function (Utils_7_1) {
                Utils_7 = Utils_7_1;
            },
            function (SonicManager_11_1) {
                SonicManager_11 = SonicManager_11_1;
            },
            function (Enums_3_1) {
                Enums_3 = Enums_3_1;
            }],
        execute: function() {
            Ring = (function (_super) {
                __extends(Ring, _super);
                function Ring(active) {
                    _super.call(this, 0, 0);
                    this.Active = false;
                    this.AnimationIndex = 0;
                    this.TickCount = 0;
                    this.Ysp = 0;
                    this.Xsp = 0;
                    this.Active = active;
                }
                Ring.prototype.Draw = function (canvas, pos) {
                    if (this.Active) {
                        this.Ysp += 0.09375;
                        this.x += this.Xsp;
                        this.y += this.Ysp;
                        var wl = SonicManager_11.SonicManager.instance.windowLocation;
                        if (this.x < wl.x || this.y < wl.y || this.x > wl.x + wl.Width || this.y > wl.y + wl.Height) {
                            this.TickCount = 0xfffffff;
                            return;
                        }
                        if (SonicManager_11.SonicManager.instance.drawTickCount > SonicManager_11.SonicManager.instance.sonicToon.sonicLastHitTick + 64 && Utils_7.IntersectingRectangle.IntersectsRect(SonicManager_11.SonicManager.instance.sonicToon.myRec, new Utils_7.Rectangle(this.x - 8, this.y - 8, 8 * 2, 2 * 8))) {
                            this.TickCount = 0xfffffff;
                            SonicManager_11.SonicManager.instance.sonicToon.rings++;
                            return;
                        }
                        this.TickCount++;
                    }
                    if (SonicManager_11.SonicManager.instance.currentGameState == Enums_3.GameState.Playing)
                        this.AnimationIndex = ((SonicManager_11.SonicManager.instance.drawTickCount % ((this.Active ? 4 : 8) * 4)) / (this.Active ? 4 : 8)) | 0;
                    else
                        this.AnimationIndex = 0;
                    var sprites = null;
                    if (SonicManager_11.SonicManager.instance.spriteCache.Rings)
                        sprites = SonicManager_11.SonicManager.instance.spriteCache.Rings;
                    else
                        throw ("bad ring animation");
                    var sps = sprites[this.AnimationIndex];
                    canvas.drawImage(sps.canvas, (pos.x - 8), (pos.y - 8));
                };
                return Ring;
            }(Utils_7.Point));
            exports_30("Ring", Ring);
        }
    }
});
System.register("game/SonicLevel", [], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
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
            exports_31("SonicLevel", SonicLevel);
            PaletteItem = (function () {
                function PaletteItem() {
                    this.SkipIndex = 0;
                    this.TotalLength = 0;
                }
                return PaletteItem;
            }());
            exports_31("PaletteItem", PaletteItem);
            PaletteItemPieces = (function () {
                function PaletteItemPieces() {
                    this.PaletteIndex = 0;
                    this.PaletteMultiply = 0;
                    this.PaletteOffset = 0;
                }
                return PaletteItemPieces;
            }());
            exports_31("PaletteItemPieces", PaletteItemPieces);
        }
    }
});
System.register("game/level/Tiles/TilePaletteAnimationManager", [], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var TilePaletteAnimationManager, TilePaletteAnimation, TilePaletteAnimationFrame;
    return {
        setters:[],
        execute: function() {
            TilePaletteAnimationManager = (function () {
                function TilePaletteAnimationManager(sonicManager) {
                    this.SonicManager = sonicManager;
                    this.Init();
                }
                TilePaletteAnimationManager.prototype.Init = function () {
                    this.Animations = {};
                    for (var animatedPaletteIndex = 0; animatedPaletteIndex < this.SonicManager.sonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                        this.Animations[animatedPaletteIndex] = new TilePaletteAnimation(this, this.SonicManager.sonicLevel.AnimatedPalettes[animatedPaletteIndex]);
                        this.Animations[animatedPaletteIndex].Init();
                    }
                };
                TilePaletteAnimationManager.prototype.ClearCache = function () {
                    this.Animations = null;
                };
                TilePaletteAnimationManager.prototype.TickAnimatedPalettes = function () {
                    if (this.Animations == null)
                        this.Init();
                    for (var animation in this.Animations) {
                        var tilePaletteAnimation = this.Animations[animation];
                        tilePaletteAnimation.Tick();
                    }
                };
                TilePaletteAnimationManager.prototype.getCurrentFrame = function (paletteAnimationIndex) {
                    return this.Animations[paletteAnimationIndex].GetCurrentFrame();
                };
                TilePaletteAnimationManager.prototype.GetPaletteAnimation = function (paletteAnimationIndex) {
                    return this.Animations[paletteAnimationIndex];
                };
                return TilePaletteAnimationManager;
            }());
            exports_32("TilePaletteAnimationManager", TilePaletteAnimationManager);
            TilePaletteAnimation = (function () {
                function TilePaletteAnimation(manager, animatedPaletteData) {
                    this.CurrentFrame = 0;
                    this.Manager = manager;
                    this.AnimatedPaletteData = animatedPaletteData;
                    this.Frames = new Array();
                }
                TilePaletteAnimation.prototype.GetCurrentFrame = function () {
                    return this.Frames[this.CurrentFrame];
                };
                TilePaletteAnimation.prototype.Tick = function () {
                    var pal = this.AnimatedPaletteData;
                    if (pal.SkipIndex == 0)
                        return;
                    if (pal.TotalLength == 0)
                        return;
                    for (var j = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
                        if (this.Manager.SonicManager.drawTickCount % (pal.TotalLength + pal.SkipIndex) == j) {
                            this.CurrentFrame = j / pal.SkipIndex;
                        }
                    }
                };
                TilePaletteAnimation.prototype.Init = function () {
                    var pal = this.AnimatedPaletteData;
                    if (pal.SkipIndex == 0)
                        return;
                    if (pal.TotalLength == 0)
                        return;
                    for (var j = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
                        var frameIndex = j / pal.SkipIndex;
                        if (this.Frames[frameIndex] == null) {
                            this.Frames[frameIndex] = new TilePaletteAnimationFrame(frameIndex, this);
                        }
                    }
                };
                return TilePaletteAnimation;
            }());
            exports_32("TilePaletteAnimation", TilePaletteAnimation);
            TilePaletteAnimationFrame = (function () {
                function TilePaletteAnimationFrame(frameIndex, animation) {
                    this.FrameIndex = 0;
                    this.Animation = animation;
                    this.FrameIndex = frameIndex;
                }
                TilePaletteAnimationFrame.prototype.SetPalette = function () {
                    var levelPalette = this.Animation.Manager.SonicManager.sonicLevel.Palette;
                    this.clonePalette(levelPalette);
                    var pal = this.Animation.AnimatedPaletteData;
                    for (var index = 0; index < pal.Pieces.length; index++) {
                        var palettePiece = pal.Pieces[index];
                        var colorIndex = this.FrameIndex + (pal.Pieces.length * index);
                        var replaceIndex = (palettePiece.PaletteOffset) / 2 | 0;
                        var color = pal.Palette[colorIndex];
                        if (color != null)
                            levelPalette[palettePiece.PaletteIndex][replaceIndex] = color;
                        else
                            levelPalette[palettePiece.PaletteIndex][replaceIndex] = "#000000";
                    }
                };
                TilePaletteAnimationFrame.prototype.clonePalette = function (levelPalette) {
                    this.tempPalette = new Array(levelPalette.length);
                    for (var index = 0; index < levelPalette.length; index++) {
                        var canvasElements = levelPalette[index];
                        this.tempPalette[index] = new Array(canvasElements.length);
                        for (var index2 = 0; index2 < canvasElements.length; index2++) {
                            this.tempPalette[index][index2] = canvasElements[index2];
                        }
                    }
                };
                TilePaletteAnimationFrame.prototype.ClearPalette = function () {
                    this.Animation.Manager.SonicManager.sonicLevel.Palette = this.tempPalette;
                    this.tempPalette = null;
                };
                return TilePaletteAnimationFrame;
            }());
            exports_32("TilePaletteAnimationFrame", TilePaletteAnimationFrame);
        }
    }
});
System.register("game/level/Tiles/TileAnimationManager", ["game/SonicManager"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var SonicManager_12;
    var TileAnimationManager, TileAnimation, TileAnimationFrame;
    return {
        setters:[
            function (SonicManager_12_1) {
                SonicManager_12 = SonicManager_12_1;
            }],
        execute: function() {
            TileAnimationManager = (function () {
                function TileAnimationManager(sonicManager) {
                    this.SonicManager = sonicManager;
                    this.Init();
                }
                TileAnimationManager.prototype.Init = function () {
                    this.Animations = {};
                    for (var animatedTileIndex = 0; animatedTileIndex < this.SonicManager.sonicLevel.TileAnimations.length; animatedTileIndex++) {
                        this.Animations[animatedTileIndex] = new TileAnimation(this, this.SonicManager.sonicLevel.TileAnimations[animatedTileIndex]);
                        this.Animations[animatedTileIndex].init();
                    }
                };
                TileAnimationManager.prototype.TickAnimatedTiles = function () {
                    if (this.Animations == null)
                        this.Init();
                    for (var animation in this.Animations) {
                        if (this.Animations.hasOwnProperty(animation)) {
                            var tilePaletteAnimation = this.Animations[animation];
                            tilePaletteAnimation.tick();
                        }
                    }
                };
                TileAnimationManager.prototype.ClearCache = function () {
                    this.Animations = null;
                };
                TileAnimationManager.prototype.getCurrentFrame = function (tileAnimationIndex) {
                    return this.Animations[tileAnimationIndex].getCurrentFrame();
                };
                return TileAnimationManager;
            }());
            exports_33("TileAnimationManager", TileAnimationManager);
            TileAnimation = (function () {
                function TileAnimation(manager, animatedTileData) {
                    this.currentFrame = 0;
                    this.manager = manager;
                    this.animatedTileData = animatedTileData;
                    this.frames = new Array();
                    this.currentFrame = 0;
                }
                TileAnimation.prototype.getCurrentFrame = function () {
                    return this.frames[this.currentFrame];
                };
                TileAnimation.prototype.tick = function () {
                    var anni = this.animatedTileData;
                    if (anni.LastAnimatedFrame == null) {
                        anni.LastAnimatedFrame = 0;
                        anni.LastAnimatedIndex = 0;
                    }
                    if (anni.DataFrames[anni.LastAnimatedIndex].Ticks == 0 || (SonicManager_12.SonicManager.instance.drawTickCount - anni.LastAnimatedFrame) >= ((anni.AutomatedTiming > 0) ? anni.AutomatedTiming : anni.DataFrames[anni.LastAnimatedIndex].Ticks)) {
                        anni.LastAnimatedFrame = SonicManager_12.SonicManager.instance.drawTickCount;
                        anni.LastAnimatedIndex = (anni.LastAnimatedIndex + 1) % anni.DataFrames.length;
                        this.currentFrame = anni.LastAnimatedIndex;
                    }
                };
                TileAnimation.prototype.init = function () {
                    for (var index = 0; index < this.animatedTileData.DataFrames.length; index++) {
                        this.frames[index] = new TileAnimationFrame(index, this);
                    }
                };
                return TileAnimation;
            }());
            exports_33("TileAnimation", TileAnimation);
            TileAnimationFrame = (function () {
                function TileAnimationFrame(frameIndex, animation) {
                    this.frameIndex = 0;
                    this.animation = animation;
                    this.frameIndex = frameIndex;
                }
                TileAnimationFrame.prototype.frameData = function () {
                    return this.animation.animatedTileData.DataFrames[this.frameIndex];
                };
                return TileAnimationFrame;
            }());
            exports_33("TileAnimationFrame", TileAnimationFrame);
        }
    }
});
System.register("game/level/Tiles/TileChunk", ["common/Utils", "game/SonicManager", "common/CanvasInformation", "common/Enums"], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var Utils_8, SonicManager_13, CanvasInformation_6, Enums_4;
    var TileChunk, TileChunkDebugDrawOptions, ChunkLayer, PaletteAnimationCanvasFrames, PaletteAnimationCanvasFrame, TileAnimationCanvasFrames, TileAnimationCanvasFrame;
    return {
        setters:[
            function (Utils_8_1) {
                Utils_8 = Utils_8_1;
            },
            function (SonicManager_13_1) {
                SonicManager_13 = SonicManager_13_1;
            },
            function (CanvasInformation_6_1) {
                CanvasInformation_6 = CanvasInformation_6_1;
            },
            function (Enums_4_1) {
                Enums_4 = Enums_4_1;
            }],
        execute: function() {
            TileChunk = (function () {
                function TileChunk() {
                    this.myLocalPoint = new Utils_8.Point(0, 0);
                    this.IsOnlyBackground = null;
                }
                TileChunk.prototype.GetTilePieceAt = function (x, y, large) {
                    return this.GetTilePieceInfo(x, y, large).GetTilePiece();
                };
                TileChunk.prototype.SetTilePieceAt = function (x, y, tp, large) {
                    if (this.GetTilePieceInfo(x, y, large).SetTilePiece(tp))
                        this.clearCache();
                };
                TileChunk.prototype.GetTilePieceInfo = function (x, y, large) {
                    if (large) {
                        return this.TilePieces[(x / TileChunk.TilePiecesSquareSize) | 0][(y / TileChunk.TilePiecesSquareSize) | 0];
                    }
                    else {
                        return this.TilePieces[x][y];
                    }
                };
                TileChunk.prototype.onlyBackground = function () {
                    if (!this.IsOnlyBackground) {
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (!tilePiece.OnlyBackground())
                                return (this.IsOnlyBackground = false);
                        }
                        this.IsOnlyBackground = true;
                        return this.IsOnlyBackground;
                    }
                    return this.IsOnlyBackground;
                };
                TileChunk.prototype.OnlyForeground = function () {
                    if (!this.IsOnlyForeground) {
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (!tilePiece.OnlyForeground()) {
                                return (this.IsOnlyForeground = false);
                            }
                        }
                        this.IsOnlyForeground = true;
                        return this.IsOnlyForeground;
                    }
                    return this.IsOnlyForeground;
                };
                TileChunk.prototype.isEmpty = function () {
                    if (!this.Empty) {
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (tilePiece.Index != 0) {
                                return (this.Empty = false);
                            }
                        }
                        this.Empty = true;
                    }
                    return this.Empty;
                };
                TileChunk.prototype.EachPiece = function () {
                    var __result = [];
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var tilePiece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                            if (tilePiece != null) {
                                __result.push(tilePiece);
                            }
                        }
                    }
                    return __result;
                };
                TileChunk.prototype.hasPixelAnimations = function () {
                    return this.getAllPaletteAnimationIndexes().length > 0;
                };
                TileChunk.prototype.HasTileAnimations = function () {
                    return this.getAllTileAnimationIndexes().length > 0;
                };
                TileChunk.prototype.getAllPaletteAnimationIndexes = function () {
                    if (this.paletteAnimationIndexes == null) {
                        this.paletteAnimationIndexes = [];
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (tilePiece.AnimatedPaletteIndexes == null)
                                continue;
                            for (var _b = 0, _c = tilePiece.AnimatedPaletteIndexes; _b < _c.length; _b++) {
                                var animatedPaletteIndex = _c[_b];
                                if (this.paletteAnimationIndexes.indexOf(animatedPaletteIndex) == -1) {
                                    this.paletteAnimationIndexes.push(animatedPaletteIndex);
                                }
                            }
                        }
                    }
                    return this.paletteAnimationIndexes;
                };
                TileChunk.prototype.getAllTileAnimationIndexes = function () {
                    if (this.tileAnimationIndexes == null) {
                        this.tileAnimationIndexes = [];
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            for (var _b = 0, _c = tilePiece.Tiles; _b < _c.length; _b++) {
                                var tileInfo = _c[_b];
                                var tile = tileInfo.GetTile();
                                if (tile == null)
                                    continue;
                                if (tile.animatedTileIndexes == null)
                                    continue;
                                for (var _d = 0, _e = tile.animatedTileIndexes; _d < _e.length; _d++) {
                                    var animatedTileIndex = _e[_d];
                                    if (this.tileAnimationIndexes.indexOf(animatedTileIndex) == -1) {
                                        this.tileAnimationIndexes.push(animatedTileIndex);
                                    }
                                }
                            }
                        }
                    }
                    return this.tileAnimationIndexes;
                };
                TileChunk.prototype.neverAnimates = function () {
                    return !(this.HasTileAnimations() || this.hasPixelAnimations());
                };
                TileChunk.prototype.draw = function (canvas, position, layer) {
                    canvas.save();
                    {
                        canvas.drawImage(this.baseCanvasCache[layer].canvas, position.x, position.y);
                        if (this.hasPixelAnimations()) {
                            var paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                            for (var _i = 0, _a = this.getAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                                var paletteAnimationIndex = _a[_i];
                                var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                                if (paletteAnimationCanvasFrames == null)
                                    continue;
                                var currentFrame = SonicManager_13.SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                                this.currentPaletteAnimationFrameIndexCache[paletteAnimationIndex] = currentFrame.FrameIndex;
                                var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.frames[currentFrame.FrameIndex];
                                var canvasLayerToDraw = paletteAnimationCanvasFrame.canvas.canvas;
                                canvas.drawImage(canvasLayerToDraw, position.x + paletteAnimationCanvasFrames.position.x, position.y + paletteAnimationCanvasFrames.position.y);
                            }
                        }
                        if (this.HasTileAnimations()) {
                            var tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                            for (var _b = 0, _c = this.getAllTileAnimationIndexes(); _b < _c.length; _b++) {
                                var tileAnimationIndex = _c[_b];
                                var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                                if (tileAnimationCanvasFrames == null)
                                    continue;
                                var currentFrame = SonicManager_13.SonicManager.instance.tileAnimationManager.getCurrentFrame(tileAnimationIndex);
                                this.currentTileAnimationFrameIndexCache[tileAnimationIndex] = currentFrame.frameIndex;
                                var tileAnimationCanvasFrame = tileAnimationCanvasFrames.frames[currentFrame.frameIndex];
                                var canvasLayerToDraw = tileAnimationCanvasFrame.canvas.canvas;
                                canvas.drawImage(canvasLayerToDraw, position.x + tileAnimationCanvasFrames.position.x, position.y + tileAnimationCanvasFrames.position.y);
                            }
                        }
                    }
                    canvas.restore();
                };
                TileChunk.prototype.drawTilePiecesAnimatedPalette = function (canvas, layer, piecesSquareSize, animatedPaletteIndex) {
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (piece.AnimatedPaletteIndexes.indexOf(animatedPaletteIndex) == -1)
                                continue;
                            if (layer == Enums_4.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            this.myLocalPoint.x = pieceX * piecesSquareSize;
                            this.myLocalPoint.y = pieceY * piecesSquareSize;
                            piece.DrawAnimatedPalette(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedPaletteIndex);
                        }
                    }
                };
                TileChunk.prototype.drawTilePiecesAnimatedTile = function (canvas, layer, piecesSquareSize, animatedTileIndex) {
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (piece.AnimatedTileIndexes.indexOf(animatedTileIndex) == -1)
                                continue;
                            if (layer == Enums_4.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            this.myLocalPoint.x = pieceX * piecesSquareSize;
                            this.myLocalPoint.y = pieceY * piecesSquareSize;
                            piece.DrawAnimatedTile(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedTileIndex);
                        }
                    }
                };
                TileChunk.prototype.drawTilePiecesBase = function (canvas, layer, piecesSquareSize) {
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (layer == Enums_4.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            this.myLocalPoint.x = pieceX * piecesSquareSize;
                            this.myLocalPoint.y = pieceY * piecesSquareSize;
                            piece.DrawBase(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip);
                        }
                    }
                };
                /*cache */
                TileChunk.prototype.clearCache = function () {
                    this.initCache();
                    this.warmCache();
                };
                TileChunk.prototype.initCache = function () {
                    this.baseCanvasCache = new ChunkLayer();
                    this.paletteAnimationCanvasesCache = new ChunkLayer();
                    this.tileAnimationCanvasesCache = new ChunkLayer();
                    this.tileAnimationCanvasesCache[Enums_4.ChunkLayerState.Low] = {};
                    this.tileAnimationCanvasesCache[Enums_4.ChunkLayerState.High] = {};
                    this.paletteAnimationCanvasesCache[Enums_4.ChunkLayerState.Low] = {};
                    this.paletteAnimationCanvasesCache[Enums_4.ChunkLayerState.High] = {};
                    this.currentTileAnimationFrameIndexCache = [];
                    this.currentPaletteAnimationFrameIndexCache = [];
                };
                TileChunk.prototype.warmCache = function () {
                    this.cacheBase(Enums_4.ChunkLayerState.Low);
                    this.cacheBase(Enums_4.ChunkLayerState.High);
                    if (this.hasPixelAnimations()) {
                        this.cachePaletteAnimation(Enums_4.ChunkLayerState.Low);
                        this.cachePaletteAnimation(Enums_4.ChunkLayerState.High);
                    }
                    if (this.HasTileAnimations()) {
                        this.cacheTileAnimation(Enums_4.ChunkLayerState.Low);
                        this.cacheTileAnimation(Enums_4.ChunkLayerState.High);
                    }
                };
                TileChunk.prototype.cacheBase = function (layer) {
                    if (layer == Enums_4.ChunkLayerState.Low ? (this.OnlyForeground()) : (this.onlyBackground()))
                        return;
                    this.baseCanvasCache[layer] = CanvasInformation_6.CanvasInformation.create(TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, false);
                    this.drawTilePiecesBase(this.baseCanvasCache[layer].Context, layer, TileChunk.TilePiecesSquareSize);
                };
                TileChunk.prototype.cachePaletteAnimation = function (layer) {
                    var paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                    for (var _i = 0, _a = this.getAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                        var paletteAnimationIndex = _a[_i];
                        var rect = this.getAnimationPaletteSurfaceInformation(paletteAnimationIndex, layer);
                        if (rect == null) {
                            continue;
                        }
                        var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex] = new PaletteAnimationCanvasFrames(paletteAnimationIndex);
                        var tilePaletteAnimation = SonicManager_13.SonicManager.instance.tilePaletteAnimationManager.Animations[paletteAnimationIndex];
                        paletteAnimationCanvasFrames.position = new Utils_8.Point(rect.x * TileChunk.TilePiecesSquareSize, rect.y * TileChunk.TilePiecesSquareSize);
                        for (var _b = 0, _c = tilePaletteAnimation.Frames; _b < _c.length; _b++) {
                            var currentFrame = _c[_b];
                            tilePaletteAnimation.CurrentFrame = currentFrame.FrameIndex;
                            var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.frames[currentFrame.FrameIndex] = new PaletteAnimationCanvasFrame();
                            currentFrame.SetPalette();
                            var tilePaletteCanvas = CanvasInformation_6.CanvasInformation.create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                            paletteAnimationCanvasFrame.canvas = tilePaletteCanvas;
                            paletteAnimationCanvasFrame.canvas.Context.save();
                            paletteAnimationCanvasFrame.canvas.Context.translate(-rect.x * TileChunk.TilePiecesSquareSize, -rect.y * TileChunk.TilePiecesSquareSize);
                            this.drawTilePiecesAnimatedPalette(tilePaletteCanvas.Context, layer, TileChunk.TilePiecesSquareSize, paletteAnimationIndex);
                            paletteAnimationCanvasFrame.canvas.Context.restore();
                            currentFrame.ClearPalette();
                        }
                        tilePaletteAnimation.CurrentFrame = 0;
                    }
                };
                TileChunk.prototype.cacheTileAnimation = function (layer) {
                    var tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                    for (var _i = 0, _a = this.getAllTileAnimationIndexes(); _i < _a.length; _i++) {
                        var tileAnimationIndex = _a[_i];
                        var rect = this.getAnimationTileSurfaceInformation(tileAnimationIndex, layer);
                        if (rect == null) {
                            continue;
                        }
                        var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex] = new TileAnimationCanvasFrames(tileAnimationIndex);
                        var tileAnimation = SonicManager_13.SonicManager.instance.tileAnimationManager.Animations[tileAnimationIndex];
                        tileAnimationCanvasFrames.position = new Utils_8.Point(rect.x * TileChunk.TilePiecesSquareSize, rect.y * TileChunk.TilePiecesSquareSize);
                        for (var _b = 0, _c = tileAnimation.frames; _b < _c.length; _b++) {
                            var currentFrame = _c[_b];
                            var tileAnimationCanvasFrame = tileAnimationCanvasFrames.frames[currentFrame.frameIndex] = new TileAnimationCanvasFrame();
                            var tileTileCanvas = CanvasInformation_6.CanvasInformation.create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                            tileAnimationCanvasFrame.canvas = tileTileCanvas;
                            tileAnimation.currentFrame = currentFrame.frameIndex;
                            tileAnimationCanvasFrame.canvas.Context.save();
                            tileAnimationCanvasFrame.canvas.Context.translate(-rect.x * TileChunk.TilePiecesSquareSize, -rect.y * TileChunk.TilePiecesSquareSize);
                            this.drawTilePiecesAnimatedTile(tileTileCanvas.Context, layer, TileChunk.TilePiecesSquareSize, tileAnimationIndex);
                            tileAnimationCanvasFrame.canvas.Context.restore();
                        }
                        tileAnimation.currentFrame = 0;
                    }
                };
                TileChunk.prototype.getAnimationTileSurfaceInformation = function (tileAnimationIndex, layer) {
                    var lowestX = 10000000;
                    var highestX = -10000000;
                    var lowestY = 10000000;
                    var highestY = -10000000;
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (layer == Enums_4.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            if (piece.AnimatedTileIndexes.indexOf(tileAnimationIndex) == -1)
                                continue;
                            if (pieceX < lowestX)
                                lowestX = pieceX;
                            if (pieceX > highestX)
                                highestX = pieceX;
                            if (pieceY < lowestY)
                                lowestY = pieceY;
                            if (pieceY > highestY)
                                highestY = pieceY;
                        }
                    }
                    if (lowestX == 10000000)
                        return null;
                    return new Utils_8.Rectangle(lowestX, lowestY, highestX - lowestX + 1, highestY - lowestY + 1);
                };
                TileChunk.prototype.getAnimationPaletteSurfaceInformation = function (paletteAnimationIndex, layer) {
                    var lowestX = 10000000;
                    var highestX = -10000000;
                    var lowestY = 10000000;
                    var highestY = -10000000;
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var piece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                            if (piece == null)
                                continue;
                            if (layer == Enums_4.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            if (piece.AnimatedPaletteIndexes.indexOf(paletteAnimationIndex) == -1)
                                continue;
                            if (pieceX < lowestX)
                                lowestX = pieceX;
                            if (pieceX > highestX)
                                highestX = pieceX;
                            if (pieceY < lowestY)
                                lowestY = pieceY;
                            if (pieceY > highestY)
                                highestY = pieceY;
                        }
                    }
                    if (lowestX == 10000000)
                        return null;
                    return new Utils_8.Rectangle(lowestX, lowestY, highestX - lowestX + 1, highestY - lowestY + 1);
                };
                /*debug*/
                TileChunk.prototype.DrawAnimationDebug = function (canvas, position, layer, debugDrawOptions) {
                    if (debugDrawOptions == null)
                        return;
                    canvas.save();
                    canvas.fillStyle = "White";
                    canvas.textBaseline = "top";
                    {
                        var yOffset = layer == Enums_4.ChunkLayerState.Low ? 0 : 64;
                        if (debugDrawOptions.showBaseData) {
                            canvas.fillText("Base", position.x + 0, position.y + yOffset);
                        }
                        if (debugDrawOptions.showPaletteAnimationData) {
                            if (this.hasPixelAnimations()) {
                                var paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                                for (var _i = 0, _a = this.getAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                                    var paletteAnimationIndex = _a[_i];
                                    var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                                    if (paletteAnimationCanvasFrames == null)
                                        continue;
                                    var currentFrame = SonicManager_13.SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                                    canvas.fillText("Palette " + paletteAnimationIndex + "-" + currentFrame.FrameIndex, position.x + 25, position.y + yOffset + (paletteAnimationIndex * 13));
                                }
                            }
                        }
                        if (debugDrawOptions.showTileAnimationData) {
                            if (this.HasTileAnimations()) {
                                var tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                                for (var _b = 0, _c = this.getAllTileAnimationIndexes(); _b < _c.length; _b++) {
                                    var tileAnimationIndex = _c[_b];
                                    var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                                    if (tileAnimationCanvasFrames == null)
                                        continue;
                                    var currentFrame = SonicManager_13.SonicManager.instance.tileAnimationManager.getCurrentFrame(tileAnimationIndex);
                                    canvas.fillText("Tile " + tileAnimationIndex + "-" + currentFrame.frameIndex, position.x + 75, position.y + yOffset + (tileAnimationIndex * 13));
                                }
                            }
                        }
                    }
                    if (debugDrawOptions.putlineChunk) {
                        canvas.strokeStyle = "black";
                        canvas.strokeRect(position.x, position.y, 128, 128);
                    }
                    if (debugDrawOptions.outlineTiles) {
                        canvas.strokeStyle = "green";
                        for (var x = 0; x < TileChunk.TileSideLength; x++) {
                            for (var y = 0; y < TileChunk.TileSideLength; y++) {
                                canvas.strokeRect(position.x + (x * TileChunk.TileSquareSize), position.y + (y * TileChunk.TileSquareSize), TileChunk.TileSquareSize, TileChunk.TileSquareSize);
                            }
                        }
                    }
                    if (debugDrawOptions.outlineTilePieces) {
                        canvas.strokeStyle = "purple";
                        for (var x = 0; x < TileChunk.TilePieceSideLength; x++) {
                            for (var y = 0; y < TileChunk.TilePieceSideLength; y++) {
                                canvas.strokeRect(position.x + (x * TileChunk.TilePiecesSquareSize), position.y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                            }
                        }
                    }
                    if (debugDrawOptions.outlineTile != null) {
                    }
                    if (debugDrawOptions.outlineTilePiece != null) {
                        canvas.strokeStyle = "yellow";
                        for (var x = 0; x < TileChunk.TilePieceSideLength; x++) {
                            for (var y = 0; y < TileChunk.TilePieceSideLength; y++) {
                                var tilePieceInfo = this.GetTilePieceInfo(x, y, false);
                                if (tilePieceInfo == null)
                                    continue;
                                var tilePiece = tilePieceInfo.GetTilePiece();
                                if (tilePiece == null)
                                    continue;
                                if (tilePiece.Index == debugDrawOptions.outlineTilePiece.Block) {
                                    canvas.strokeRect(position.x + (x * TileChunk.TilePiecesSquareSize), position.y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                                }
                            }
                        }
                    }
                    canvas.restore();
                };
                TileChunk.prototype.Debug_DrawCache = function () {
                    var numWide = 10;
                    var numOfChunks = 0;
                    for (var i = 0; i < 2; i++) {
                        var chunkLayer = i;
                        if (this.baseCanvasCache[chunkLayer] != null)
                            numOfChunks++;
                        for (var paletteAnimationCanvasCache in this.paletteAnimationCanvasesCache[chunkLayer]) {
                            for (var frame in this.paletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache].frames) {
                                numOfChunks++;
                            }
                        }
                        for (var tileAnimationCanvasCache in this.tileAnimationCanvasesCache[chunkLayer]) {
                            for (var frame in this.tileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache].frames) {
                                numOfChunks++;
                            }
                        }
                    }
                    var canvas = CanvasInformation_6.CanvasInformation.create((numWide * 128), (Math.ceil(numOfChunks / numWide) | 0) * 128, false);
                    canvas.Context.fillStyle = "#111111";
                    canvas.Context.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
                    numOfChunks = 0;
                    canvas.Context.strokeStyle = "#FFFFFF";
                    canvas.Context.lineWidth = 4;
                    for (var i = 0; i < 2; i++) {
                        var chunkLayer = i;
                        canvas.Context.strokeStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "Green" : "Yellow";
                        if (this.baseCanvasCache[chunkLayer] != null) {
                            var context = canvas.Context;
                            context.save();
                            var x = ((numOfChunks % numWide) * 128) | 0;
                            var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                            context.translate(x, y);
                            canvas.Context.fillStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "#333333" : "#777777";
                            context.fillRect(0, 0, 128, 128);
                            context.drawImage(this.baseCanvasCache[chunkLayer].canvas, 0, 0);
                            context.strokeRect(0, 0, 128, 128);
                            context.restore();
                            numOfChunks++;
                        }
                        canvas.Context.strokeStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "pink" : "purple";
                        for (var paletteAnimationCanvasCache in this.paletteAnimationCanvasesCache[chunkLayer]) {
                            var m = this.paletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache];
                            for (var f in m.frames) {
                                var frame = m.frames[f];
                                var context = canvas.Context;
                                context.save();
                                var x = ((numOfChunks % numWide) * 128) | 0;
                                var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                                context.translate(x, y);
                                canvas.Context.fillStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "#333333" : "#777777";
                                context.fillRect(0, 0, 128, 128);
                                context.drawImage(frame.canvas.canvas, m.position.x, m.position.y);
                                context.strokeRect(0, 0, 128, 128);
                                context.restore();
                                numOfChunks++;
                            }
                        }
                        canvas.Context.strokeStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "red" : "orange";
                        for (var tileAnimationCanvasCache in this.tileAnimationCanvasesCache[chunkLayer]) {
                            var m = this.tileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache];
                            for (var f in m.frames) {
                                var frame = m.frames[f];
                                var context = canvas.Context;
                                context.save();
                                var x = ((numOfChunks % numWide) * 128) | 0;
                                var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                                context.translate(x, y);
                                canvas.Context.fillStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "#333333" : "#777777";
                                context.fillRect(0, 0, 128, 128);
                                context.drawImage(frame.canvas.canvas, m.position.y, m.position.y);
                                context.strokeRect(0, 0, 128, 128);
                                context.restore();
                                numOfChunks++;
                            }
                        }
                    }
                    canvas.Context.strokeStyle = "blue";
                    canvas.Context.strokeRect(0, 0, canvas.canvas.width, canvas.canvas.height);
                    canvas.Context.fillStyle = "white";
                    canvas.Context.font = "20px bold";
                    canvas.Context.fillText("Number Of Chunks: " + numOfChunks, 50, 50);
                    return canvas;
                };
                TileChunk.TilePiecesSquareSize = 16;
                TileChunk.TileSquareSize = 8;
                TileChunk.Size = TileChunk.TilePiecesSquareSize * TileChunk.TilePieceSideLength;
                TileChunk.TilePieceSideLength = 8;
                TileChunk.TileSideLength = 16;
                return TileChunk;
            }());
            exports_34("TileChunk", TileChunk);
            TileChunkDebugDrawOptions = (function () {
                function TileChunkDebugDrawOptions() {
                }
                return TileChunkDebugDrawOptions;
            }());
            exports_34("TileChunkDebugDrawOptions", TileChunkDebugDrawOptions);
            ChunkLayer = (function () {
                function ChunkLayer() {
                }
                return ChunkLayer;
            }());
            exports_34("ChunkLayer", ChunkLayer);
            PaletteAnimationCanvasFrames = (function () {
                function PaletteAnimationCanvasFrames(paletteAnimationIndex) {
                    this.paletteAnimationIndex = paletteAnimationIndex;
                    this.frames = {};
                }
                return PaletteAnimationCanvasFrames;
            }());
            exports_34("PaletteAnimationCanvasFrames", PaletteAnimationCanvasFrames);
            PaletteAnimationCanvasFrame = (function () {
                function PaletteAnimationCanvasFrame() {
                }
                return PaletteAnimationCanvasFrame;
            }());
            exports_34("PaletteAnimationCanvasFrame", PaletteAnimationCanvasFrame);
            TileAnimationCanvasFrames = (function () {
                function TileAnimationCanvasFrames(tileAnimationIndex) {
                    this.tileAnimationIndex = tileAnimationIndex;
                    this.frames = {};
                }
                return TileAnimationCanvasFrames;
            }());
            exports_34("TileAnimationCanvasFrames", TileAnimationCanvasFrames);
            TileAnimationCanvasFrame = (function () {
                function TileAnimationCanvasFrame() {
                }
                return TileAnimationCanvasFrame;
            }());
            exports_34("TileAnimationCanvasFrame", TileAnimationCanvasFrame);
        }
    }
});
System.register("game/sonic/SensorManager", ["SLData", "game/level/HeightMap", "common/Help", "game/SonicManager", "common/Enums"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var SLData_2, HeightMap_1, Help_3, SonicManager_14, Enums_5;
    var SensorManager, Sensor, SensorM;
    return {
        setters:[
            function (SLData_2_1) {
                SLData_2 = SLData_2_1;
            },
            function (HeightMap_1_1) {
                HeightMap_1 = HeightMap_1_1;
            },
            function (Help_3_1) {
                Help_3 = Help_3_1;
            },
            function (SonicManager_14_1) {
                SonicManager_14 = SonicManager_14_1;
            },
            function (Enums_5_1) {
                Enums_5 = Enums_5_1;
            }],
        execute: function() {
            SensorManager = (function () {
                function SensorManager() {
                    this.sensors = {};
                    this.sensorResults = {};
                }
                SensorManager.prototype.addSensor = function (letter, sensor) {
                    this.sensors[letter] = (sensor);
                    this.sensorResults[letter] = null;
                    return sensor;
                };
                SensorManager.prototype.createVerticalSensor = function (letter, x, y1, y2, color, ignoreSolid) {
                    if (ignoreSolid === void 0) { ignoreSolid = false; }
                    return this.addSensor(letter, new Sensor(x, x, y1, y2, this, color, ignoreSolid, letter));
                };
                SensorManager.prototype.createHorizontalSensor = function (letter, y, x1, x2, color, ignoreSolid) {
                    if (ignoreSolid === void 0) { ignoreSolid = false; }
                    return this.addSensor(letter, new Sensor(x1, x2, y, y, this, color, ignoreSolid, letter));
                };
                SensorManager.prototype.check = function (character) {
                    var none = false;
                    for (var i in this.sensors) {
                        this.sensorResults[i] = this.sensors[i].check(character);
                        none = none || (this.sensorResults[i] != null);
                    }
                    return none;
                };
                SensorManager.prototype.getResult = function (mn) {
                    return this.sensorResults[mn];
                };
                SensorManager.prototype.draw = function (canvas, sonic) {
                    for (var sensor in this.sensors) {
                        this.sensors[sensor].draw(canvas, sonic, this.sensorResults[sensor]);
                    }
                };
                SensorManager.prototype.buildChunk = function (chunk, isLayerOne) {
                    if (isLayerOne) {
                        if (chunk.HeightBlocks1)
                            return;
                        var hb1 = chunk.HeightBlocks1 = new Array(128);
                        var ab1 = chunk.AngleMap1 = new Array(8);
                        for (var _1 = 0; _1 < 128; _1++) {
                            hb1[_1] = new Array(128);
                            for (var _2 = 0; _2 < 128; _2++) {
                                hb1[_1][_2] = 0;
                            }
                        }
                        for (var _1 = 0; _1 < 8; _1++) {
                            ab1[_1] = new Array(8);
                            for (var _2 = 0; _2 < 8; _2++) {
                                ab1[_1][_2] = 0;
                            }
                        }
                        for (var _y = 0; _y < 8; _y++) {
                            for (var _x = 0; _x < 8; _x++) {
                                var tp = chunk.TilePieces[_x][_y];
                                ab1[_x][_y] = tp.GetLayer1Angles();
                                if (!(ab1[_x][_y] == 0 || ab1[_x][_y] == 255 || ab1[_x][_y] == 1)) {
                                    if (tp.XFlip) {
                                        if (tp.YFlip) {
                                            ab1[_x][_y] = 192 - ab1[_x][_y] + 192;
                                            ab1[_x][_y] = 128 - ab1[_x][_y] + 128;
                                        }
                                        else
                                            ab1[_x][_y] = 128 - ab1[_x][_y] + 128;
                                    }
                                    else {
                                        if (tp.YFlip)
                                            ab1[_x][_y] = 192 - ab1[_x][_y] + 192;
                                        else
                                            ab1[_x][_y] = (ab1[_x][_y]);
                                    }
                                }
                                var heightMask = tp.GetLayer1HeightMaps();
                                var heightMaskItems = null;
                                if (heightMask == null)
                                    continue;
                                var mj = void 0;
                                if (heightMask.Full !== undefined) {
                                    mj = heightMask.Full === false ? 0 : tp.Solid1;
                                    for (var __y = 0; __y < 16; __y++) {
                                        for (var __x = 0; __x < 16; __x++) {
                                            hb1[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                                        }
                                    }
                                }
                                else {
                                    heightMaskItems = heightMask.Items;
                                }
                                for (var __y = 0; __y < 16; __y++) {
                                    for (var __x = 0; __x < 16; __x++) {
                                        var jx = 0;
                                        var jy = 0;
                                        if (tp.XFlip) {
                                            if (tp.YFlip) {
                                                jx = 15 - __x;
                                                jy = 15 - __y;
                                            }
                                            else {
                                                jx = 15 - __x;
                                                jy = __y;
                                            }
                                        }
                                        else {
                                            if (tp.YFlip) {
                                                jx = __x;
                                                jy = 15 - __y;
                                            }
                                            else {
                                                jx = __x;
                                                jy = __y;
                                            }
                                        }
                                        if (heightMask.Full === undefined) {
                                            switch (tp.Solid1) {
                                                case 0:
                                                    hb1[(_x * 16 + jx)][(_y * 16 + jy)] = 0;
                                                    break;
                                                case 1:
                                                case 2:
                                                case 3:
                                                    hb1[(_x * 16 + jx)][(_y * 16 + jy)] = HeightMap_1.HeightMap.ItemsGood(heightMaskItems, __x, __y) ? tp.Solid1 : 0;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (chunk.HeightBlocks2)
                            return;
                        var hb2 = chunk.HeightBlocks2 = new Array(128);
                        var ab2 = chunk.AngleMap2 = new Array(8);
                        for (var _1 = 0; _1 < 128; _1++) {
                            hb2[_1] = new Array(128);
                        }
                        for (var _1 = 0; _1 < 8; _1++) {
                            ab2[_1] = new Array(8);
                        }
                        for (var _y = 0; _y < 8; _y++) {
                            for (var _x = 0; _x < 8; _x++) {
                                var tp = chunk.TilePieces[_x][_y];
                                ab2[_x][_y] = tp.GetLayer2Angles();
                                if (!(ab2[_x][_y] == 0 || ab2[_x][_y] == 255 || ab2[_x][_y] == 1)) {
                                    if (tp.XFlip) {
                                        if (tp.YFlip) {
                                            ab2[_x][_y] = 192 - ab2[_x][_y] + 192;
                                            ab2[_x][_y] = 128 - ab2[_x][_y] + 128;
                                        }
                                        else
                                            ab2[_x][_y] = 128 - ab2[_x][_y] + 128;
                                    }
                                    else {
                                        if (tp.YFlip)
                                            ab2[_x][_y] = 192 - ab2[_x][_y] + 192;
                                        else
                                            ab2[_x][_y] = (ab2[_x][_y]);
                                    }
                                }
                                var hd2 = tp.GetLayer2HeightMaps();
                                if (hd2 == null)
                                    continue;
                                var mj = void 0;
                                var hd2Items = null;
                                if (hd2.Full !== undefined) {
                                    mj = hd2.Full === false ? 0 : tp.Solid2;
                                    for (var __y = 0; __y < 16; __y++) {
                                        for (var __x = 0; __x < 16; __x++) {
                                            hb2[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                                        }
                                    }
                                }
                                else
                                    hd2Items = hd2.Items;
                                for (var __y = 0; __y < 16; __y++) {
                                    for (var __x = 0; __x < 16; __x++) {
                                        var jx = 0;
                                        var jy = 0;
                                        if (tp.XFlip) {
                                            if (tp.YFlip) {
                                                jx = 15 - __x;
                                                jy = 15 - __y;
                                            }
                                            else {
                                                jx = 15 - __x;
                                                jy = __y;
                                            }
                                        }
                                        else {
                                            if (tp.YFlip) {
                                                jx = __x;
                                                jy = 15 - __y;
                                            }
                                            else {
                                                jx = __x;
                                                jy = __y;
                                            }
                                        }
                                        if (hd2.Full === undefined) {
                                            switch (tp.Solid2) {
                                                case 0:
                                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = SLData_2.Solidity.NotSolid;
                                                    break;
                                                case 1:
                                                case 2:
                                                case 3:
                                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = HeightMap_1.HeightMap.ItemsGood(hd2Items, __x, __y) ? tp.Solid2 : 0;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                return SensorManager;
            }());
            exports_35("SensorManager", SensorManager);
            Sensor = (function () {
                function Sensor(x1, x2, y1, y2, manager, color, ignoreSolid, letter) {
                    this.__currentM = new SensorM(0, 0);
                    this.value = 0;
                    this.angle = 0;
                    this.chosen = false;
                    this.ignoreSolid = false;
                    this.x1 = 0;
                    this.x2 = 0;
                    this.y1 = 0;
                    this.y2 = 0;
                    this.x1 = x1;
                    this.x2 = x2;
                    this.y1 = y1;
                    this.y2 = y2;
                    this.manager = manager;
                    this.color = color;
                    this.ignoreSolid = ignoreSolid;
                    this.letter = letter;
                }
                Sensor.prototype.checkCollisionLineWrap = function (x1, x2, y1, y2, ignoreSolid) {
                    var _x = (x1 / 128) | 0;
                    var _y = Help_3.Help.mod((y1 / 128) | 0, SonicManager_14.SonicManager.instance.sonicLevel.LevelHeight);
                    var tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x, _y);
                    this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                    var curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                    var cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                    var __x = x1 - _x * 128;
                    var __y = y1 - _y * 128;
                    var length = 0;
                    if (y1 == y2) {
                        if (Math.max(x1, x2) > SonicManager_14.SonicManager.instance.sonicLevel.LevelWidth * 128) {
                            this.__currentM.value = SonicManager_14.SonicManager.instance.sonicLevel.LevelWidth * 128 - 20;
                            this.__currentM.angle = 0xff;
                            return this.__currentM;
                        }
                        if (x1 < x2) {
                            length = x2 - x1;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__x - i < 0) {
                                            if (_x - 1 < 0) {
                                                this.__currentM.value = 0;
                                                this.__currentM.angle = 0xFF;
                                                return this.__currentM;
                                            }
                                            tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x - 1, _y);
                                            this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __x += 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[(__x - i)][__y] >= 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.letter)) {
                                        this.__currentM.value = x1 - i;
                                        this.__currentM.angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__x + i >= 128) {
                                        tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x + 1, _y);
                                        this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __x -= 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[(__x + i)][__y] >= 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.letter)) {
                                    this.__currentM.value = x1 + i;
                                    this.__currentM.angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                        else {
                            length = x1 - x2;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__x + i >= 128) {
                                            tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x + 1, _y);
                                            this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __x -= 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[(__x + i)][__y] >= 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.letter)) {
                                        this.__currentM.value = x1 + i;
                                        this.__currentM.angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__x - i < 0) {
                                        if (_x - 1 < 0) {
                                            this.__currentM.value = 0;
                                            this.__currentM.angle = 0xFF;
                                            return this.__currentM;
                                        }
                                        tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x - 1, _y);
                                        this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __x += 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[(__x - i)][__y] >= 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.letter)) {
                                    this.__currentM.value = x1 - i;
                                    this.__currentM.angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                    }
                    else {
                        if (y1 < y2) {
                            length = y2 - y1;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__y - i < 0) {
                                            tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x, Help_3.Help.mod((_y - 1), SonicManager_14.SonicManager.instance.sonicLevel.LevelHeight));
                                            this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __y += 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[__x][__y - i] > 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 - i, this.letter)) {
                                        this.__currentM.value = y1 - i;
                                        this.__currentM.angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__y + i >= 128) {
                                        tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x, (_y + 1) % SonicManager_14.SonicManager.instance.sonicLevel.LevelHeight);
                                        this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __y -= 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[__x][__y + i] >= 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                                    if (curh[__x][__y + i] == 1 && SonicManager_14.SonicManager.instance.sonicToon.inAir && SonicManager_14.SonicManager.instance.sonicToon.ysp < 0)
                                        continue;
                                    this.__currentM.value = y1 + i;
                                    this.__currentM.angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                        else {
                            length = y1 - y2;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__y + i >= 128) {
                                            tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x, (_y + 1) % SonicManager_14.SonicManager.instance.sonicLevel.LevelHeight);
                                            this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __y -= 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[__x][__y + i] >= 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                                        this.__currentM.value = y1 + i;
                                        this.__currentM.angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__y - i < 0) {
                                        tc = SonicManager_14.SonicManager.instance.sonicLevel.getChunkAt(_x, Help_3.Help.mod((_y - 1), SonicManager_14.SonicManager.instance.sonicLevel.LevelHeight));
                                        this.manager.buildChunk(tc, SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.instance.sonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __y += 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[__x][__y - i] > 1 || SonicManager_14.SonicManager.instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.letter)) {
                                    this.__currentM.value = y1 - i;
                                    this.__currentM.angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                    }
                    return null;
                };
                Sensor.prototype.draw = function (canvas, character, sensorResult) {
                    var x = Help_3.Help.floor(character.x) - SonicManager_14.SonicManager.instance.windowLocation.x;
                    var y = Help_3.Help.floor(character.y) - SonicManager_14.SonicManager.instance.windowLocation.y;
                    canvas.beginPath();
                    if (sensorResult && sensorResult.chosen) {
                        canvas.strokeStyle = "#FFF76D";
                        canvas.lineWidth = 4;
                    }
                    else {
                        canvas.strokeStyle = this.color;
                        canvas.lineWidth = 2;
                    }
                    switch (character.mode) {
                        case Enums_5.RotationMode.Floor:
                            canvas.moveTo((x + this.x1), (y + this.y1));
                            canvas.lineTo((x + this.x2), (y + this.y2));
                            break;
                        case Enums_5.RotationMode.LeftWall:
                            canvas.moveTo((x - this.y1), (y + this.x1));
                            canvas.lineTo((x - this.y2), (y + this.x2));
                            break;
                        case Enums_5.RotationMode.Ceiling:
                            canvas.moveTo((x - this.x1), (y - this.y1));
                            canvas.lineTo((x - this.x2), (y - this.y2));
                            break;
                        case Enums_5.RotationMode.RightWall:
                            canvas.moveTo((x + this.y1), (y - this.x1));
                            canvas.lineTo((x + this.y2), (y - this.x2));
                            break;
                    }
                    canvas.closePath();
                    canvas.stroke();
                };
                Sensor.prototype.check = function (character) {
                    var _y2 = character.inAir ? this.y2 : this.y2;
                    var m = null;
                    var x = Help_3.Help.floor(character.x);
                    var y = Help_3.Help.floor(character.y);
                    switch (character.mode) {
                        case Enums_5.RotationMode.Floor:
                            m = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + _y2, this.ignoreSolid);
                            break;
                        case Enums_5.RotationMode.LeftWall:
                            m = this.checkCollisionLineWrap(x - this.y1, x - _y2, y + this.x1, y + this.x2, this.ignoreSolid);
                            break;
                        case Enums_5.RotationMode.Ceiling:
                            m = this.checkCollisionLineWrap(x - this.x1, x - this.x2, y - this.y1, y - _y2, this.ignoreSolid);
                            break;
                        case Enums_5.RotationMode.RightWall:
                            m = this.checkCollisionLineWrap(x + this.y1, x + _y2, y - this.x1, y - this.x2, this.ignoreSolid);
                            break;
                    }
                    if (m != null) {
                        m.letter = this.letter;
                        if (m.angle == 255 || m.angle == 0 || m.angle == 1) {
                            if (character.mode == Enums_5.RotationMode.Floor)
                                m.angle = 255;
                            if (character.mode == Enums_5.RotationMode.LeftWall)
                                m.angle = 64;
                            if (character.mode == Enums_5.RotationMode.Ceiling)
                                m.angle = 128;
                            if (character.mode == Enums_5.RotationMode.RightWall)
                                m.angle = 192;
                        }
                    }
                    return m;
                };
                return Sensor;
            }());
            exports_35("Sensor", Sensor);
            SensorM = (function () {
                function SensorM(value, angle) {
                    this.value = 0;
                    this.angle = 0;
                    this.chosen = false;
                    this.value = value;
                    this.angle = angle;
                }
                return SensorM;
            }());
            exports_35("SensorM", SensorM);
        }
    }
});
System.register("game/sonic/SonicConstants", ["common/Help"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var Help_4;
    var SonicConstants;
    return {
        setters:[
            function (Help_4_1) {
                Help_4 = Help_4_1;
            }],
        execute: function() {
            SonicConstants = (function () {
                function SonicConstants() {
                }
                SonicConstants.Sonic = function () {
                    var sc = Help_4.Help.merge(new SonicConstants(), {
                        acc: 0.046875,
                        dec: 0.5,
                        slp: 0.125,
                        frc: 0.046875,
                        rdec: 0.125,
                        rfrc: 0.0234375,
                        slpRollingUp: 0.078125,
                        slpRollingDown: 0.3125,
                        jmp: -6.5,
                        grv: 0.21875,
                        air: 0.09375,
                        topSpeed: 6
                    });
                    return sc;
                };
                return SonicConstants;
            }());
            exports_36("SonicConstants", SonicConstants);
        }
    }
});
System.register("game/sonic/Sonic", ["common/Utils", "game/sonic/SensorManager", "common/Enums", "game/SonicManager", "common/Help", "game/level/Ring", "game/sonic/SonicConstants"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var Utils_9, SensorManager_1, Enums_6, SonicManager_15, Help_5, Ring_1, SonicConstants_1;
    var Sonic, Watcher;
    return {
        setters:[
            function (Utils_9_1) {
                Utils_9 = Utils_9_1;
            },
            function (SensorManager_1_1) {
                SensorManager_1 = SensorManager_1_1;
            },
            function (Enums_6_1) {
                Enums_6 = Enums_6_1;
            },
            function (SonicManager_15_1) {
                SonicManager_15 = SonicManager_15_1;
            },
            function (Help_5_1) {
                Help_5 = Help_5_1;
            },
            function (Ring_1_1) {
                Ring_1 = Ring_1_1;
            },
            function (SonicConstants_1_1) {
                SonicConstants_1 = SonicConstants_1_1;
            }],
        execute: function() {
            Sonic = (function () {
                function Sonic() {
                    this.obtainedRing = {};
                    this.ticking = false;
                    this.x = 0;
                    this.y = 0;
                    this.rings = 0;
                    this.debugging = false;
                    this.jumping = false;
                    this.crouching = false;
                    this.holdingLeft = false;
                    this.holdingRight = false;
                    this.holdingUp = false;
                    this.xsp = 0;
                    this.ysp = 0;
                    this.gsp = 0;
                    this.rolling = false;
                    this.inAir = false;
                    this.wasInAir = false;
                    this.holdingJump = false;
                    this.justHit = false;
                    this.hLock = 0;
                    this.mode = Enums_6.RotationMode.Floor;
                    this.facing = false;
                    this.breaking = 0;
                    this.ducking = false;
                    this.spinDash = false;
                    this.spinDashSpeed = 0;
                    this.angle = 0;
                    this.currentlyBall = false;
                    this.halfSize = new Utils_9.Point(20, 20);
                    this.offsetFromImage = new Utils_9.Point(0, 0);
                    this.objectCollision = new Utils_9.Point(0, 0);
                    this.ringCollisionRect = new Utils_9.Rectangle(0, 0, 0, 0);
                    this.watcher = new Watcher();
                    this.physicsVariables = SonicConstants_1.SonicConstants.Sonic();
                    var sonicManager = SonicManager_15.SonicManager.instance;
                    this.sonicLevel = sonicManager.sonicLevel;
                    this.x = this.sonicLevel.StartPositions[0].x;
                    this.y = this.sonicLevel.StartPositions[0].y;
                    this.sensorManager = new SensorManager_1.SensorManager();
                    this.haltSmoke = new Array();
                    this.rings = 7;
                    this.sensorManager.createVerticalSensor("a", -9, 0, 36, "#F202F2");
                    this.sensorManager.createVerticalSensor("b", 9, 0, 36, "#02C2F2");
                    this.sensorManager.createVerticalSensor("c", -9, 0, -20, "#2D2C21");
                    this.sensorManager.createVerticalSensor("d", 9, 0, -20, "#C24222");
                    this.sensorManager.createHorizontalSensor("m1", 4, 0, -12, "#212C2E");
                    this.sensorManager.createHorizontalSensor("m2", 4, 0, 13, "#22Ffc1");
                    this.spriteState = "normal";
                    this.myRec = new Utils_9.Rectangle(0, 0, 0, 0);
                    this.sonicLastHitTick = -100000;
                }
                Sonic.prototype.updateMode = function () {
                    if (this.angle <= 0x22 || this.angle >= 0xDE)
                        this.mode = Enums_6.RotationMode.Floor;
                    else if (this.angle > 0x22 && this.angle < 0x59)
                        this.mode = Enums_6.RotationMode.LeftWall;
                    else if (this.angle >= 0x59 && this.angle < 0xA1)
                        this.mode = Enums_6.RotationMode.Ceiling;
                    else if (this.angle > 0xA1 && this.angle < 0xDE)
                        this.mode = Enums_6.RotationMode.RightWall;
                    this.myRec.x = (this.x - 10) | 0;
                    this.myRec.y = (this.y - 20) | 0;
                    this.myRec.Width = 10 * 2;
                    this.myRec.Height = 20 * 2;
                    if (this.inAir)
                        this.mode = Enums_6.RotationMode.Floor;
                };
                Sonic.prototype.tick = function (sonicLevel) {
                    if (this.debugging) {
                        var debugSpeed = this.watcher.Multiply(15);
                        if (this.holdingRight)
                            this.x += debugSpeed;
                        if (this.holdingLeft)
                            this.x -= debugSpeed;
                        if (this.crouching)
                            this.y += debugSpeed;
                        if (this.holdingUp)
                            this.y -= debugSpeed;
                        this.x = ((sonicLevel.LevelWidth * 128) + (this.x)) % (sonicLevel.LevelWidth * 128);
                        this.y = ((sonicLevel.LevelHeight * 128) + (this.y)) % (sonicLevel.LevelHeight * 128);
                        return;
                    }
                    this.updateMode();
                    if (this.hLock > 0) {
                        this.hLock--;
                        this.holdingRight = false;
                        this.holdingLeft = false;
                    }
                    if (this.inAir) {
                        if (this.angle != 0xff) {
                            this.angle = (0xff + (this.angle + ((this.angle > 0xff / 2) ? 2 : -2))) % 0xff;
                            if (this.angle >= 0xfd || this.angle <= 0x01)
                                this.angle = 0xff;
                        }
                    }
                    this.effectPhysics();
                    this.checkCollisionWithRings();
                    this.updateSprite();
                    this.sensorManager.check(this);
                    var sensorM1 = this.sensorManager.getResult("m1");
                    var sensorM2 = this.sensorManager.getResult("m2");
                    var best = this.getBestSensor(sensorM1, sensorM2, this.mode);
                    if (best != null) {
                        switch (this.mode) {
                            case Enums_6.RotationMode.Floor:
                                this.x = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter == "m1" ? 12 : -12)));
                                this.gsp = 0;
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                            case Enums_6.RotationMode.LeftWall:
                                this.y = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter == "m1" ? 12 : -12)));
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                            case Enums_6.RotationMode.Ceiling:
                                this.x = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter == "m1" ? -12 : 12)));
                                this.gsp = 0;
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                            case Enums_6.RotationMode.RightWall:
                                this.y = (best.value + (sensorM2 != null && sensorM1 != null && (sensorM1.value == sensorM2.value) ? 12 : (best.letter == "m1" ? -12 : 12)));
                                this.gsp = 0;
                                if (this.inAir)
                                    this.xsp = 0;
                                break;
                        }
                    }
                    this.sensorManager.check(this);
                    var sensorA = this.sensorManager.getResult("a");
                    var sensorB = this.sensorManager.getResult("b");
                    var fy;
                    var fx;
                    var hSize = this.getHalfImageSize();
                    if (!this.inAir) {
                        best = this.getBestSensor(sensorA, sensorB, this.mode);
                        if (best == null)
                            this.inAir = true;
                        else {
                            this.justHit = false;
                            switch (this.mode) {
                                case Enums_6.RotationMode.Floor:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.y = fy = best.value - hSize.y;
                                    break;
                                case Enums_6.RotationMode.LeftWall:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.x = fx = best.value + hSize.x;
                                    break;
                                case Enums_6.RotationMode.Ceiling:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.y = fy = best.value + hSize.y;
                                    break;
                                case Enums_6.RotationMode.RightWall:
                                    best.chosen = true;
                                    this.angle = best.angle;
                                    this.x = fx = best.value - hSize.x;
                                    break;
                            }
                        }
                        this.updateMode();
                    }
                    else {
                        if (sensorA == null && sensorB == null)
                            this.inAir = true;
                        else {
                            if ((sensorA != null && sensorA.value >= 0) && (sensorB != null && sensorB.value >= 0)) {
                                if (sensorA.value < sensorB.value) {
                                    if (this.y + (20) >= sensorA.value) {
                                        this.angle = sensorA.angle;
                                        this.y = fy = sensorA.value - hSize.y;
                                        this.rolling = this.currentlyBall = false;
                                        this.inAir = false;
                                    }
                                }
                                else {
                                    if (sensorB.value > -1) {
                                        if (this.y + (20) >= sensorB.value) {
                                            this.angle = sensorB.angle;
                                            this.y = fy = sensorB.value - hSize.y;
                                            this.rolling = this.currentlyBall = false;
                                            this.inAir = false;
                                        }
                                    }
                                }
                            }
                            else if ((sensorA != null) && sensorA.value > -1) {
                                if (this.y + (20) >= sensorA.value) {
                                    this.angle = sensorA.angle;
                                    this.y = fy = sensorA.value - hSize.y;
                                    this.rolling = this.currentlyBall = false;
                                    this.inAir = false;
                                }
                            }
                            else if (sensorB != null && sensorB.value > -1) {
                                if (this.y + (20) >= sensorB.value) {
                                    this.angle = sensorB.angle;
                                    this.y = fy = sensorB.value - hSize.y;
                                    this.rolling = this.currentlyBall = false;
                                    this.inAir = false;
                                }
                            }
                        }
                        this.updateMode();
                        var cur = SonicManager_15.SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
                        var __h = cur.height / 2;
                        this.sensorManager.check(this);
                        var sensorC = this.sensorManager.getResult("c");
                        var sensorD = this.sensorManager.getResult("d");
                        if ((sensorC == null && sensorD == null)) {
                        }
                        else {
                            if (sensorD != null && (sensorC != null) && (sensorC.value >= 0 && sensorD.value >= 0)) {
                                if (sensorC.value < sensorD.value) {
                                    if (this.y + (__h) >= sensorC.value) {
                                        if (this.ysp < 0) {
                                            if (sensorC.angle > 0x40 && sensorC.angle < 0xC0) {
                                                this.angle = sensorC.angle;
                                                this.gsp = this.ysp;
                                                this.inAir = false;
                                                this.wasInAir = false;
                                            }
                                            else
                                                this.ysp = 0;
                                            this.y = fy = sensorC.value + __h;
                                        }
                                    }
                                }
                                else {
                                    if (this.y + (__h) >= sensorD.value) {
                                        if (this.ysp < 0) {
                                            if (sensorD.angle > 0x40 && sensorD.angle < 0xC0) {
                                                this.angle = sensorD.angle;
                                                this.gsp = -this.ysp;
                                                this.inAir = false;
                                                this.wasInAir = false;
                                            }
                                            else
                                                this.ysp = 0;
                                            this.y = fy = sensorD.value + __h;
                                        }
                                    }
                                }
                            }
                            else if (sensorC != null && sensorC.value > -1) {
                                if (this.y + (__h) >= sensorC.value) {
                                    if (this.ysp < 0) {
                                        if (sensorC.angle > 0x40 && sensorC.angle < 0xC0) {
                                            this.angle = sensorC.angle;
                                            this.gsp = this.ysp;
                                            this.inAir = false;
                                            this.wasInAir = false;
                                        }
                                        else
                                            this.ysp = 0;
                                        this.y = fy = sensorC.value + __h;
                                    }
                                }
                            }
                            else if (sensorD != null && sensorD.value > -1) {
                                if (this.y + (__h) >= sensorD.value) {
                                    if (this.ysp < 0) {
                                        if (sensorD.angle > 0x40 && sensorD.angle < 0xC0) {
                                            this.angle = sensorD.angle;
                                            this.gsp = -this.ysp;
                                            this.inAir = false;
                                            this.wasInAir = false;
                                        }
                                        else
                                            this.ysp = 0;
                                        this.y = fy = sensorD.value + __h;
                                    }
                                }
                            }
                            this.updateMode();
                        }
                    }
                };
                Sonic.prototype.getBestSensor = function (sensor1, sensor2, mode) {
                    if (sensor1 == null && sensor2 == null)
                        return null;
                    if (sensor1 == null)
                        return sensor2;
                    if (sensor2 == null)
                        return sensor1;
                    switch (mode) {
                        case Enums_6.RotationMode.Floor:
                            return sensor1.value < sensor2.value ? sensor1 : sensor2;
                        case Enums_6.RotationMode.LeftWall:
                            return sensor1.value > sensor2.value ? sensor1 : sensor2;
                        case Enums_6.RotationMode.Ceiling:
                            return sensor1.value > sensor2.value ? sensor1 : sensor2;
                        case Enums_6.RotationMode.RightWall:
                            return sensor1.value < sensor2.value ? sensor1 : sensor2;
                    }
                    return null;
                };
                Sonic.prototype.invulnerable = function () {
                    var mc = SonicManager_15.SonicManager.instance.drawTickCount - this.sonicLastHitTick;
                    if (mc < 120) {
                        if (mc % 8 < 4)
                            return true;
                    }
                    return false;
                };
                Sonic.prototype.getHalfImageSize = function () {
                    return this.halfSize;
                };
                Sonic.prototype.getOffsetFromImage = function () {
                    var cur = SonicManager_15.SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
                    var xOffset = 0;
                    var yOffset = 0;
                    if (cur.height != 40) {
                        var n = void 0;
                        switch (this.mode) {
                            case Enums_6.RotationMode.Floor:
                                n = 0;
                                yOffset = (40 - ((cur.height + n))) / 2;
                                break;
                            case Enums_6.RotationMode.LeftWall:
                                n = 15;
                                xOffset = -(40 - ((cur.height + n))) / 2;
                                break;
                            case Enums_6.RotationMode.Ceiling:
                                n = 8;
                                yOffset = -(40 - ((cur.height + n))) / 2;
                                break;
                            case Enums_6.RotationMode.RightWall:
                                n = 9;
                                xOffset = (40 - ((cur.height + n))) / 2;
                                break;
                        }
                    }
                    this.offsetFromImage.x = xOffset;
                    this.offsetFromImage.y = yOffset;
                    return this.offsetFromImage;
                };
                Sonic.prototype.updateSprite = function () {
                    var absgsp = Math.abs(this.gsp);
                    var word = this.spriteState.substring(0, this.spriteState.length - 1);
                    var j = parseInt(this.spriteState.substring(this.spriteState.length - 1, this.spriteState.length));
                    if (this.breaking > 0) {
                        if (this.gsp > 0 || this.gsp == 0 || this.spriteState == "breaking3") {
                            this.facing = false;
                            this.breaking = 0;
                        }
                    }
                    else if (this.breaking < 0) {
                        if (this.gsp < 0 || this.gsp == 0 || this.spriteState == "breaking3") {
                            this.breaking = 0;
                            this.facing = true;
                        }
                    }
                    var epsilon = 0.00001;
                    if (this.justHit) {
                        if (word != "hit") {
                            this.spriteState = "hit0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0))
                            this.spriteState = "hit1";
                    }
                    else if (this.spinDash) {
                        if (word != "spindash") {
                            this.spriteState = "spindash0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % Math.floor(2 - absgsp) | 0) == 0)
                            this.spriteState = "spindash" + ((j + 1) % 6);
                    }
                    else if (Math.abs(absgsp - 0) < epsilon && !this.inAir) {
                        if (this.ducking) {
                            if (word != "duck") {
                                this.spriteState = "duck0";
                                this.runningTick = 1;
                            }
                            else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                                this.spriteState = "duck1";
                        }
                        else if (this.holdingUp) {
                            if (word != "lookingup") {
                                this.spriteState = "lookingup0";
                                this.runningTick = 1;
                            }
                            else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                                this.spriteState = "lookingup1";
                        }
                        else {
                            this.spriteState = "normal";
                            this.currentlyBall = false;
                            this.rolling = false;
                            this.runningTick = 0;
                        }
                    }
                    else if (this.breaking != 0) {
                        if (word != "breaking") {
                            this.spriteState = "breaking0";
                            this.runningTick = 1;
                        }
                        else if ((this.runningTick++) % (7) == 0) {
                            this.spriteState = "breaking" + ((j + 1) % 4);
                            if (j == 0)
                                this.haltSmoke.push(new Utils_9.Point(this.x, this.y));
                        }
                    }
                    else if (this.currentlyBall) {
                        if (word != "balls") {
                            this.spriteState = "balls0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % Math.floor(8 - absgsp) == 0) || (8 - absgsp < 1))
                            this.spriteState = "balls" + ((j + 1) % 5);
                    }
                    else if (absgsp < 6) {
                        if (word != "running") {
                            this.spriteState = "running0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                            this.spriteState = "running" + ((j + 1) % 8);
                    }
                    else if (absgsp >= 6) {
                        if (word != "fastrunning") {
                            this.spriteState = "fastrunning0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                            this.spriteState = "fastrunning" + ((j + 1) % 4);
                    }
                };
                Sonic.prototype.effectPhysics = function () {
                    this.watcher.Tick();
                    var physics = this.physicsVariables;
                    var max = physics.topSpeed;
                    if (!this.jumping) {
                        if (!this.inAir && this.wasJumping)
                            this.wasJumping = false;
                    }
                    if (this.inAir && !this.wasInAir) {
                        this.wasInAir = true;
                        var offset = this.getOffsetFromImage();
                    }
                    if (!this.inAir && this.wasInAir) {
                        this.wasInAir = false;
                        if ((this.angle >= 0xF0 || this.angle <= 0x0F))
                            this.gsp = (this.xsp);
                        else if ((this.angle > 0xE2 && this.angle <= 0xEF) || (this.angle >= 0x10 && this.angle <= 0x1F))
                            this.gsp = (this.ysp);
                        else if ((this.angle >= 0xC0 && this.angle <= 0xE2))
                            this.gsp = (-this.ysp);
                        else if ((this.angle >= 0x20 && this.angle <= 0x3F))
                            this.gsp = (this.ysp);
                        this.xsp = 0;
                        this.ysp = 0;
                    }
                    if (!this.inAir && !this.rolling && !this.spinDash) {
                        if (!this.holdingLeft && !this.holdingRight && !this.justHit) {
                            this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.frc)) * (this.gsp > 0 ? 1 : -1));
                        }
                        this.oldSign = Help_5.Help.sign(this.gsp);
                        this.gsp += this.watcher.Multiply(physics.slp) * -Help_5.Help.sin(this.angle);
                        if (this.oldSign != Help_5.Help.sign(this.gsp) && this.oldSign != 0)
                            this.hLock = 30;
                        if (this.holdingRight && !this.holdingLeft && !this.justHit) {
                            this.facing = true;
                            if (this.gsp >= 0) {
                                this.gsp += this.watcher.Multiply(physics.acc);
                                if (this.gsp > max)
                                    this.gsp = max;
                            }
                            else {
                                this.gsp += this.watcher.Multiply(physics.dec);
                                if (Math.abs(this.gsp) > 4.5) {
                                    this.facing = false;
                                    this.breaking = 1;
                                    this.runningTick = 0;
                                }
                            }
                        }
                        if (this.holdingLeft && !this.holdingRight && !this.justHit) {
                            this.facing = false;
                            if (this.gsp <= 0) {
                                this.gsp -= this.watcher.Multiply(physics.acc);
                                if (this.gsp < -max)
                                    this.gsp = -max;
                            }
                            else {
                                this.gsp -= this.watcher.Multiply(physics.dec);
                                if (Math.abs(this.gsp) > 4.5) {
                                    this.facing = true;
                                    this.breaking = -1;
                                    this.runningTick = 0;
                                }
                            }
                        }
                    }
                    this.ducking = false;
                    if (this.crouching) {
                        if (Math.abs(this.gsp) > 1.03125) {
                            this.rolling = true;
                            this.currentlyBall = true;
                        }
                        else
                            this.ducking = true;
                    }
                    else {
                        if (this.spinDash) {
                            this.gsp = (8 + Help_5.Help.floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
                            this.spinDash = false;
                            this.rolling = true;
                            this.currentlyBall = true;
                        }
                    }
                    if (!this.inAir && this.rolling) {
                        if (this.holdingLeft && !this.justHit) {
                            if (this.gsp > 0) {
                                if (this.rolling)
                                    this.gsp = (Help_5.Help.max(0, this.gsp - this.watcher.Multiply(physics.rdec)));
                            }
                        }
                        if (this.holdingRight && !this.justHit) {
                            if (this.gsp < 0) {
                                if (this.rolling)
                                    this.gsp = (Help_5.Help.min(0, this.gsp + this.watcher.Multiply(physics.rdec)));
                            }
                        }
                        this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.Multiply(physics.rfrc)) * (this.gsp > 0 ? 1 : -1));
                        this.oldSign = Help_5.Help.sign(this.gsp);
                        var ang = Help_5.Help.sin(this.angle);
                        if ((ang > 0) == (this.gsp > 0))
                            this.gsp += this.watcher.Multiply(-physics.slpRollingUp) * ang;
                        else
                            this.gsp += this.watcher.Multiply(-physics.slpRollingDown) * ang;
                        if (this.gsp > max * 2.5)
                            this.gsp = max * 2.5;
                        if (this.gsp < -max * 2.5)
                            this.gsp = -max * 2.5;
                        if (this.oldSign != Help_5.Help.sign(this.gsp) && this.oldSign != 0)
                            this.hLock = 30;
                        if (Math.abs(this.gsp) < 0.53125) {
                            this.rolling = false;
                            this.currentlyBall = false;
                        }
                    }
                    if (this.inAir) {
                        if (this.holdingRight && !this.holdingLeft && !this.justHit) {
                            this.facing = true;
                            if (this.xsp >= 0) {
                                this.xsp += this.watcher.Multiply(physics.air);
                                if (this.xsp > max)
                                    this.xsp = max;
                            }
                            else {
                                this.xsp += this.watcher.Multiply(physics.air);
                            }
                        }
                        if (this.holdingLeft && !this.holdingRight && !this.justHit) {
                            this.facing = false;
                            if (this.xsp <= 0) {
                                this.xsp -= this.watcher.Multiply(physics.air);
                                if (this.xsp < -max)
                                    this.xsp = -max;
                            }
                            else {
                            }
                        }
                        if (this.wasInAir)
                            if (this.jumping) {
                            }
                            else {
                            }
                        this.ysp += this.justHit ? 0.1875 : physics.grv;
                        if (this.ysp < 0 && this.ysp > -4) {
                            if (Math.abs(this.xsp) > 0.125)
                                this.xsp *= 0.96875;
                        }
                        if (this.ysp > 16)
                            this.ysp = 16;
                    }
                    if (this.wasInAir && this.jumping) {
                    }
                    else if (this.jumping && !this.wasJumping) {
                        this.wasJumping = true;
                        if (this.ducking) {
                            this.spinDash = true;
                            this.spinDashSpeed += 2;
                            if (this.spinDashSpeed > 8)
                                this.spinDashSpeed = 8;
                            this.spriteState = "spindash0";
                        }
                        else {
                            this.inAir = true;
                            this.currentlyBall = true;
                            this.xsp = physics.jmp * Help_5.Help.sin(this.angle) + this.gsp * Help_5.Help.cos(this.angle);
                            this.ysp = physics.jmp * Help_5.Help.cos(this.angle);
                            if (Math.abs(this.xsp) < .17)
                                this.xsp = 0;
                        }
                    }
                    if (!this.inAir) {
                        if (this.spinDash)
                            this.gsp = 0;
                        this.xsp = this.gsp * Help_5.Help.cos(this.angle);
                        this.ysp = this.gsp * -Help_5.Help.sin(this.angle);
                        if (Math.abs(this.gsp) < 2.5 && this.mode != Enums_6.RotationMode.Floor) {
                            if (this.mode == Enums_6.RotationMode.RightWall)
                                this.x += 0;
                            else if (this.mode == Enums_6.RotationMode.LeftWall)
                                this.x += 0;
                            else if (this.mode == Enums_6.RotationMode.Ceiling)
                                this.y += 0;
                            var oldMode = this.mode;
                            this.updateMode();
                            this.mode = Enums_6.RotationMode.Floor;
                            this.hLock = 30;
                            this.inAir = true;
                        }
                    }
                    if (this.xsp > 0 && this.xsp < 0.008) {
                        this.gsp = 0;
                        this.xsp = 0;
                    }
                    if (this.xsp < 0 && this.xsp > -0.008) {
                        this.gsp = 0;
                        this.xsp = 0;
                    }
                    this.x = ((this.sonicLevel.LevelWidth * 128) + (this.x + this.xsp)) % (this.sonicLevel.LevelWidth * 128);
                    this.y = ((this.sonicLevel.LevelHeight * 128) + (this.y + this.ysp)) % (this.sonicLevel.LevelHeight * 128);
                };
                Sonic.prototype.draw = function (canvas) {
                    var fx = (this.x) | 0;
                    var fy = (this.y) | 0;
                    if (this.invulnerable())
                        return;
                    var cur = SonicManager_15.SonicManager.instance.spriteCache.SonicSprites[this.spriteState];
                    if (cur == null) {
                    }
                    if (Help_5.Help.isLoaded(cur)) {
                        canvas.save();
                        var offset = this.getOffsetFromImage();
                        canvas.translate((fx - SonicManager_15.SonicManager.instance.windowLocation.x + offset.x), ((fy - SonicManager_15.SonicManager.instance.windowLocation.y + offset.y)));
                        if (SonicManager_15.SonicManager.instance.showHeightMap) {
                            var mul = 10;
                            var xj = this.xsp * mul;
                            var yj = this.ysp * mul;
                            var distance = Math.sqrt((yj * yj) + (xj * xj));
                            canvas.save();
                            canvas.moveTo(xj, yj);
                            canvas.beginPath();
                            canvas.fillStyle = "rgba(163,241,255,1)";
                            canvas.strokeStyle = "rgba(163,241,255,1)";
                            canvas.arc(xj, yj, distance / 8, 0, 2 * Math.PI, true);
                            canvas.closePath();
                            canvas.fill();
                            canvas.stroke();
                            canvas.restore();
                        }
                        if (!this.facing) {
                            canvas.scale(-1, 1);
                            if (!this.currentlyBall && !this.spinDash)
                                canvas.rotate(-Help_5.Help.fixAngle(this.angle));
                            canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                            if (this.spinDash) {
                                canvas.drawImage(SonicManager_15.SonicManager.instance.spriteCache.SonicSprites[("spinsmoke" + ((SonicManager_15.SonicManager.instance.drawTickCount % 14) / 2 | 0))], (-cur.width / 2) - 19, -cur.height / 2 + (offset.y) - 6, cur.width, cur.height);
                            }
                        }
                        else {
                            if (!this.currentlyBall && !this.spinDash)
                                canvas.rotate(Help_5.Help.fixAngle(this.angle));
                            canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                            if (this.spinDash) {
                                canvas.drawImage(SonicManager_15.SonicManager.instance.spriteCache.SonicSprites[("spinsmoke" + ((SonicManager_15.SonicManager.instance.drawTickCount % 14) / 2 | 0))], (-cur.width / 2) - 19, -cur.height / 2 + (offset.y) - 6, cur.width, cur.height);
                            }
                        }
                        canvas.restore();
                        if (SonicManager_15.SonicManager.instance.showHeightMap)
                            this.sensorManager.draw(canvas, this);
                        for (var i = 0; i < this.haltSmoke.length; i++) {
                            var lo = this.haltSmoke[i];
                            canvas.drawImage(SonicManager_15.SonicManager.instance.spriteCache.SonicSprites[("haltsmoke" + ((SonicManager_15.SonicManager.instance.drawTickCount % (4 * 6)) / 6 | 0))], ((lo.x - SonicManager_15.SonicManager.instance.windowLocation.x - 15)), ((lo.y + 12 - SonicManager_15.SonicManager.instance.windowLocation.y + offset.y)));
                            if ((((SonicManager_15.SonicManager.instance.drawTickCount + 6) % (4 * 6)) / 6 | 0) == 0) {
                                this.haltSmoke.splice(i, 1);
                            }
                        }
                    }
                };
                Sonic.prototype.DrawUI = function (canvas, pos) {
                    canvas.save();
                    {
                        if (canvas.font != "13pt Arial bold")
                            canvas.font = "13pt Arial bold";
                        canvas.fillStyle = "White";
                        canvas.fillText("Rings: " + this.rings, pos.x + 90, pos.y + 45);
                        canvas.fillText("Angle: " + this.angle.toString(16), pos.x + 90, pos.y + 75);
                        canvas.fillText("Position: " + (this.x) + ", " + (this.y), pos.x + 90, pos.y + 105);
                        canvas.fillText("Speed: g: " + this.gsp.toFixed(3) + " x:" + this.xsp.toFixed(3) + " y:" + this.ysp.toFixed(3), pos.x + 90, pos.y + 135);
                        canvas.fillText("Mode: " + this.mode.toString(), pos.x + 90, pos.y + 165);
                        canvas.fillText("Multiplier: " + this.watcher.mult, pos.x + 90, pos.y + 195);
                        if (this.inAir)
                            canvas.fillText("air ", pos.x + 220, pos.y + 45);
                        if (this.hLock > 0)
                            canvas.fillText("HLock: " + this.hLock, pos.x + 90, pos.y + 195);
                    }
                    canvas.restore();
                };
                Sonic.prototype.Hit = function (x, y) {
                    if (SonicManager_15.SonicManager.instance.drawTickCount - this.sonicLastHitTick < 120)
                        return;
                    this.justHit = true;
                    this.ysp = -4;
                    this.xsp = 2 * ((this.x - x) < 0 ? -1 : 1);
                    this.sonicLastHitTick = SonicManager_15.SonicManager.instance.drawTickCount;
                    var t = 0;
                    var angle = 101.25;
                    var n = false;
                    var speed = 4;
                    while (t < this.rings) {
                        var ring = new Ring_1.Ring(true);
                        SonicManager_15.SonicManager.instance.activeRings.push(ring);
                        ring.x = this.x | 0;
                        ring.y = this.y - 10 | 0;
                        ring.Ysp = -Math.sin(angle) * speed;
                        ring.Xsp = Math.cos(angle) * speed;
                        if (n) {
                            ring.Ysp *= -1;
                            angle += 22.5;
                        }
                        n = !n;
                        t++;
                        if (t == 16) {
                            speed = 2;
                            angle = 101.25;
                        }
                    }
                    this.rings = 0;
                };
                Sonic.prototype.Debug = function () {
                    this.debugging = !this.debugging;
                    this.xsp = 0;
                    this.gsp = 0;
                    this.ysp = 0;
                    this.spriteState = "normal";
                };
                Sonic.prototype.PressUp = function () {
                    this.holdingUp = true;
                };
                Sonic.prototype.ReleaseUp = function () {
                    this.holdingUp = false;
                };
                Sonic.prototype.PressCrouch = function () {
                    this.crouching = true;
                };
                Sonic.prototype.ReleaseCrouch = function () {
                    this.crouching = false;
                };
                Sonic.prototype.PressLeft = function () {
                    this.holdingLeft = true;
                };
                Sonic.prototype.ReleaseLeft = function () {
                    this.holdingLeft = false;
                };
                Sonic.prototype.PressRight = function () {
                    this.holdingRight = true;
                };
                Sonic.prototype.ReleaseRight = function () {
                    this.holdingRight = false;
                };
                Sonic.prototype.PressJump = function () {
                    this.jumping = true;
                };
                Sonic.prototype.ReleaseJump = function () {
                    this.jumping = false;
                };
                Sonic.prototype.CheckCollisionWithObjects = function (x, y, letter) {
                    this.objectCollision.x = x;
                    this.objectCollision.y = y;
                    var me = this.objectCollision;
                    var levelObjectInfos = SonicManager_15.SonicManager.instance.inFocusObjects;
                    for (var _i = 0, levelObjectInfos_1 = levelObjectInfos; _i < levelObjectInfos_1.length; _i++) {
                        var ob = levelObjectInfos_1[_i];
                        var dj = ob.Collides(me);
                        var dj2 = ob.HurtsSonic(me);
                        if (dj)
                            return ob.Collide(this, letter, dj);
                        if (dj2)
                            return ob.HurtSonic(this, letter, dj2);
                    }
                    return false;
                };
                Sonic.prototype.checkCollisionWithRings = function () {
                    var me = this.myRec;
                    this.ringCollisionRect.x = 0;
                    this.ringCollisionRect.y = 0;
                    this.ringCollisionRect.Width = 8 * 2;
                    this.ringCollisionRect.Height = 8 * 2;
                    var rings = SonicManager_15.SonicManager.instance.sonicLevel.Rings;
                    for (var index = 0; index < rings.length; index++) {
                        var ring = rings[index];
                        var pos = ring;
                        if (this.obtainedRing[index])
                            continue;
                        this.ringCollisionRect.x = pos.x;
                        this.ringCollisionRect.y = pos.y;
                        if (Utils_9.IntersectingRectangle.IntersectRect(me, this.ringCollisionRect)) {
                            this.rings++;
                            this.obtainedRing[index] = true;
                        }
                    }
                };
                Sonic.prototype.CheckCollisionLine = function (p0, p1, p2, p3) {
                    return null;
                };
                return Sonic;
            }());
            exports_37("Sonic", Sonic);
            Watcher = (function () {
                function Watcher() {
                    this.lastTick = 0;
                    this.mult = 1;
                }
                Watcher.prototype.Tick = function () {
                    if (true || SonicManager_15.SonicManager.instance.inHaltMode) {
                        this.mult = 1;
                        return;
                    }
                    var ticks = new Date().getTime();
                    var offset = 0;
                    if (this.lastTick == 0)
                        offset = 16;
                    else
                        offset = ticks - this.lastTick;
                    this.lastTick = ticks;
                    this.mult = (offset / 16) | 0;
                };
                Watcher.prototype.Multiply = function (v) {
                    return this.mult * v;
                };
                return Watcher;
            }());
            exports_37("Watcher", Watcher);
        }
    }
});
System.register("game/level/SpriteCache", [], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
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
            exports_38("SpriteCache", SpriteCache);
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
            exports_38("SpriteCacheIndexes", SpriteCacheIndexes);
        }
    }
});
System.register("game/level/Animations/AnimationInstance", [], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var AnimationInstance;
    return {
        setters:[],
        execute: function() {
            AnimationInstance = (function () {
                function AnimationInstance() {
                }
                AnimationInstance.prototype.Tick = function () {
                };
                AnimationInstance.prototype.Draw = function (canvas, i, i1) {
                };
                return AnimationInstance;
            }());
            exports_39("AnimationInstance", AnimationInstance);
        }
    }
});
System.register("common/SpriteLoader", [], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var SpriteLoader, SpriteLoaderStep;
    return {
        setters:[],
        execute: function() {
            SpriteLoader = (function () {
                function SpriteLoader(completed, update) {
                    this.done = false;
                    this.stepIndex = 0;
                    this.steps = new Array();
                    this.tickIndex = 0;
                    this.myCompleted = completed;
                    this.myUpdate = update;
                }
                SpriteLoader.prototype.Tick = function () {
                    var _this = this;
                    if (this.stepIndex == this.steps.length) {
                        if (!this.done) {
                            this.done = true;
                            this.myCompleted();
                        }
                        return true;
                    }
                    var stp = this.steps[this.stepIndex];
                    if (!stp)
                        return true;
                    if ((this.tickIndex % stp.Iterations.length / 12 | 0) == 0)
                        this.myUpdate("Caching: " + stp.Title + " " + ((this.tickIndex / stp.Iterations.length) * 100) + "%");
                    if (stp.Iterations.length > this.tickIndex) {
                        stp.Method(stp.Iterations[this.tickIndex++], function () {
                            if (stp.OnFinish()) {
                                _this.stepIndex++;
                                _this.tickIndex = 0;
                            }
                        });
                    }
                    return false;
                };
                SpriteLoader.prototype.AddStep = function (title, method, onFinish, disable) {
                    if (disable)
                        return -1;
                    this.steps.push(new SpriteLoaderStep(title, method, onFinish));
                    return this.steps.length - 1;
                };
                SpriteLoader.prototype.AddIterationToStep = function (spriteStep, i) {
                    if (spriteStep == -1)
                        return;
                    this.steps[spriteStep].Iterations.push(i);
                };
                return SpriteLoader;
            }());
            exports_40("SpriteLoader", SpriteLoader);
            SpriteLoaderStep = (function () {
                function SpriteLoaderStep(title, method, onFinish) {
                    this.Title = title;
                    this.Method = method;
                    this.OnFinish = onFinish;
                    this.Iterations = new Array();
                }
                return SpriteLoaderStep;
            }());
            exports_40("SpriteLoaderStep", SpriteLoaderStep);
        }
    }
});
System.register("game/level/SonicBackground", [], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var SonicBackground;
    return {
        setters:[],
        execute: function() {
            SonicBackground = (function () {
                function SonicBackground() {
                    this.Width = 0;
                    this.Height = 0;
                }
                SonicBackground.prototype.Draw = function (canvas, point, wOffset) {
                };
                return SonicBackground;
            }());
            exports_41("SonicBackground", SonicBackground);
        }
    }
});
System.register("game/SonicManager", ["common/Utils", "common/CanvasInformation", "game/SonicEngine", "common/Enums", "common/Help", "game/level/HeightMap", "game/level/Objects/ObjectManager", "game/SonicLevel", "game/level/Objects/LevelObjectInfo", "game/level/Ring", "game/level/SpriteCache", "game/level/Animations/TileAnimationData", "game/level/Tiles/TilePaletteAnimationManager", "game/level/Tiles/TileAnimationManager", "game/level/Tiles/TileChunk", "common/SpriteLoader", "game/level/Objects/LevelObject", "game/level/Objects/LevelObjectData", "game/level/Tiles/Tile", "game/level/Tiles/TilePiece", "game/level/Tiles/TileInfo", "game/level/Tiles/TilePieceInfo"], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var Utils_10, CanvasInformation_7, SonicEngine_1, Enums_7, Help_6, HeightMap_2, ObjectManager_2, SonicLevel_1, LevelObjectInfo_1, Ring_2, SpriteCache_1, TileAnimationData_1, TilePaletteAnimationManager_1, TileAnimationManager_1, TileChunk_1, SpriteLoader_1, LevelObject_2, LevelObjectData_1, Tile_1, TilePiece_1, TileInfo_1, TilePieceInfo_1;
    var SonicManager, tempArrays, tempBArrays, tempCnvs, posLookups, colsLookups, imageDataCaches;
    function getArray(size) {
        var tmp = tempArrays[size];
        if (tmp) {
            return tmp;
        }
        tmp = tempArrays[size] = new Uint8ClampedArray(size * 4);
        for (var s = 0; s < size * 4; s++) {
            tmp[s] = 255;
        }
        return tmp;
    }
    function getInt32Array(size) {
        var tmp = tempBArrays[size];
        if (tmp) {
            return tmp;
        }
        return tempBArrays[size] = new Uint32Array(size);
    }
    function getCnv(width, height) {
        var s = (width + " " + height);
        var tempCnv = tempCnvs[s];
        if (tempCnv) {
            return tempCnv;
        }
        var newCanvas = document.createElement('canvas');
        newCanvas.width = width;
        newCanvas.height = height;
        var newContext = newCanvas.getContext('2d');
        newContext.mozImageSmoothingEnabled = false; /// future
        newContext.msImageSmoothingEnabled = false; /// future
        newContext.imageSmoothingEnabled = false; /// future
        return tempCnvs[s] = {
            canvas: newCanvas,
            context: newContext
        };
    }
    function getPosLookup(width, height) {
        var posLookup = posLookups[width * height];
        if (posLookup)
            return posLookup;
        var posLookup = posLookups[width * height] = {
            left: new Uint32Array(width * height),
            right: new Uint32Array(width * height),
            top: new Uint32Array(width * height),
            bottom: new Uint32Array(width * height),
            middle: new Uint32Array(width * height)
        };
        var cc = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                posLookup.top[cc] = _top(x, y, width, height);
                posLookup.left[cc] = _left(x, y, width, height);
                posLookup.middle[cc] = ((y) * width + (x)) * 4;
                posLookup.right[cc] = _right(x, y, width, height);
                posLookup.bottom[cc] = _bottom(x, y, width, height);
                cc++;
            }
        }
        return posLookup;
    }
    function getColsLookup(imageData, width, height) {
        var cols = getInt32Array(width * height * 4);
        var pixels_ = imageData;
        var cc = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                cols[cc] = (((pixels_[(y * width + x) * 4] << 8) + pixels_[(y * width + x) * 4 + 1]) << 8) + pixels_[(y * width + x) * 4 + 2];
                cc += 4;
            }
        }
        return cols;
    }
    function imageDataCache(canvas, width, height) {
        var s = ((width) + " " + (height));
        if (imageDataCaches[s]) {
            return imageDataCaches[s];
        }
        return imageDataCaches[s] = canvas.createImageData(width, height);
    }
    function _top(x, y, width, height) {
        if (y <= 0)
            return ((y) * width + (x)) * 4;
        else
            return ((y - 1) * width + (x)) * 4;
    }
    function _left(x, y, width, height) {
        if (x <= 0)
            return ((y) * width + (x)) * 4;
        else
            return ((y) * width + (x - 1)) * 4;
    }
    function _right(x, y, width, height) {
        if (x + 1 >= width)
            return ((y) * width + (x)) * 4;
        else
            return ((y) * width + (x + 1)) * 4;
    }
    function _bottom(x, y, width, height) {
        if (y + 1 >= height)
            return ((y) * width + (x)) * 4;
        else
            return ((y + 1) * width + (x)) * 4;
    }
    function doPixelCompare(pixels_, width, height, width2, height2, pixels2_, posLookup, colsLookup) {
        var cc = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var Bid = posLookup.top[cc];
                var Did = posLookup.left[cc];
                var Eid = posLookup.middle[cc];
                var Fid = posLookup.right[cc];
                var Hid = posLookup.bottom[cc];
                cc++;
                /*
                 var B = (((pixels_[Bid] << 8) + pixels_[Bid + 1]) << 8) + pixels_[Bid + 2];
                 var D = (((pixels_[Did] << 8) + pixels_[Did + 1]) << 8) + pixels_[Did + 2];
                 var F = (((pixels_[Fid] << 8) + pixels_[Fid + 1]) << 8) + pixels_[Fid + 2];
                 var H = (((pixels_[Hid] << 8) + pixels_[Hid + 1]) << 8) + pixels_[Hid + 2];
                 */
                var B = colsLookup[Bid];
                var D = colsLookup[Did];
                var F = colsLookup[Fid];
                var H = colsLookup[Hid];
                var E0, E1, E2, E3;
                if (B !== (H) && D !== (F)) {
                    E0 = D == (B) ? Did : Eid;
                    E1 = B == (F) ? Fid : Eid;
                    E2 = D == (H) ? Did : Eid;
                    E3 = H == (F) ? Fid : Eid;
                }
                else {
                    E0 = Eid;
                    E1 = Eid;
                    E2 = Eid;
                    E3 = Eid;
                }
                var tl = (((y * 2) * width2 + (x * 2)) * 4);
                var tr = (((y * 2) * width2 + (x * 2 + 1)) * 4);
                var bl = (((y * 2 + 1) * width2 + (x * 2)) * 4);
                var br = (((y * 2 + 1) * width2 + (x * 2 + 1)) * 4);
                pixels2_[tl] = pixels_[E0];
                pixels2_[tr] = pixels_[E1];
                pixels2_[bl] = pixels_[E2];
                pixels2_[br] = pixels_[E3];
                pixels2_[tl + 1] = pixels_[E0 + 1];
                pixels2_[tr + 1] = pixels_[E1 + 1];
                pixels2_[bl + 1] = pixels_[E2 + 1];
                pixels2_[br + 1] = pixels_[E3 + 1];
                pixels2_[tl + 2] = pixels_[E0 + 2];
                pixels2_[tr + 2] = pixels_[E1 + 2];
                pixels2_[bl + 2] = pixels_[E2 + 2];
                pixels2_[br + 2] = pixels_[E3 + 2];
            }
        }
    }
    return {
        setters:[
            function (Utils_10_1) {
                Utils_10 = Utils_10_1;
            },
            function (CanvasInformation_7_1) {
                CanvasInformation_7 = CanvasInformation_7_1;
            },
            function (SonicEngine_1_1) {
                SonicEngine_1 = SonicEngine_1_1;
            },
            function (Enums_7_1) {
                Enums_7 = Enums_7_1;
            },
            function (Help_6_1) {
                Help_6 = Help_6_1;
            },
            function (HeightMap_2_1) {
                HeightMap_2 = HeightMap_2_1;
            },
            function (ObjectManager_2_1) {
                ObjectManager_2 = ObjectManager_2_1;
            },
            function (SonicLevel_1_1) {
                SonicLevel_1 = SonicLevel_1_1;
            },
            function (LevelObjectInfo_1_1) {
                LevelObjectInfo_1 = LevelObjectInfo_1_1;
            },
            function (Ring_2_1) {
                Ring_2 = Ring_2_1;
            },
            function (SpriteCache_1_1) {
                SpriteCache_1 = SpriteCache_1_1;
            },
            function (TileAnimationData_1_1) {
                TileAnimationData_1 = TileAnimationData_1_1;
            },
            function (TilePaletteAnimationManager_1_1) {
                TilePaletteAnimationManager_1 = TilePaletteAnimationManager_1_1;
            },
            function (TileAnimationManager_1_1) {
                TileAnimationManager_1 = TileAnimationManager_1_1;
            },
            function (TileChunk_1_1) {
                TileChunk_1 = TileChunk_1_1;
            },
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            },
            function (LevelObject_2_1) {
                LevelObject_2 = LevelObject_2_1;
            },
            function (LevelObjectData_1_1) {
                LevelObjectData_1 = LevelObjectData_1_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (TilePiece_1_1) {
                TilePiece_1 = TilePiece_1_1;
            },
            function (TileInfo_1_1) {
                TileInfo_1 = TileInfo_1_1;
            },
            function (TilePieceInfo_1_1) {
                TilePieceInfo_1 = TilePieceInfo_1_1;
            }],
        execute: function() {
            SonicManager = (function () {
                function SonicManager(engine, gameCanvas, resize) {
                    var _this = this;
                    this.sonicSprites = {};
                    SonicManager.instance = this;
                    this.engine = engine;
                    this.engine.canvasWidth = $(window).width();
                    this.engine.canvasHeight = $(window).height();
                    gameCanvas.domCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
                    gameCanvas.domCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
                    jQuery.getJSON("assets/content/sprites/sonic.js", function (data) {
                        _this.sonicSprites = data;
                    });
                    this.objectManager = new ObjectManager_2.ObjectManager(this);
                    this.objectManager.Init();
                    var scl = 2;
                    this.scale = new Utils_10.Point(scl, scl);
                    this.realScale = new Utils_10.DoublePoint(1, 1);
                    this.mainCanvas = gameCanvas;
                    this.windowLocation = Help_6.Help.defaultWindowLocation(Enums_7.GameState.Editing, this.scale);
                    this.bigWindowLocation = Help_6.Help.defaultWindowLocation(Enums_7.GameState.Editing, this.scale);
                    this.bigWindowLocation.Width = (this.bigWindowLocation.Width * 1.8) | 0;
                    this.bigWindowLocation.Height = (this.bigWindowLocation.Height * 1.8) | 0;
                    this.tileAnimations = new Array();
                    this.animationInstances = new Array();
                    this.showHeightMap = false;
                    this.goodRing = new Ring_2.Ring(false);
                    this.activeRings = new Array();
                    this.forceResize = resize;
                    this.background = null;
                    this.currentGameState = Enums_7.GameState.Editing;
                    this.screenOffset = new Utils_10.Point(this.mainCanvas.domCanvas.width() / 2 - this.windowLocation.Width / 2, this.mainCanvas.domCanvas.height() / 2 - this.windowLocation.Height / 2);
                    this.clickState = Enums_7.ClickState.PlaceChunk;
                    this.tickCount = 0;
                    this.drawTickCount = 0;
                    this.inHaltMode = false;
                    this.waitingForTickContinue = false;
                    this.waitingForDrawContinue = false;
                    this.tileChunkDebugDrawOptions = new TileChunk_1.TileChunkDebugDrawOptions();
                }
                SonicManager.prototype.OnClick = function (Event) {
                    this.clicking = true;
                    if (this.effectClick(Event))
                        return true;
                    return false;
                };
                SonicManager.prototype.effectClick = function (event) {
                    var e = new Utils_10.Point((event.clientX / this.scale.x / this.realScale.x + this.windowLocation.x), (event.clientY / this.scale.y / this.realScale.y + this.windowLocation.y));
                    var ey;
                    var ex;
                    if (event.ctrlKey) {
                        ex = e.x / 128 | 0;
                        ey = e.y / 128 | 0;
                        var ch = this.sonicLevel.getChunkAt(ex, ey);
                        //            if (this.UIManager.UIManagerAreas.TilePieceArea != null)
                        //                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, this.UIManager.UIManagerAreas.TilePieceArea.Data, true);
                        return true;
                    }
                    if (event.shiftKey) {
                        ex = e.x / 128 | 0;
                        ey = e.y / 128 | 0;
                        var ch = this.sonicLevel.getChunkAt(ex, ey);
                        //            if (this.UIManager.UIManagerAreas.TileChunkArea != null)
                        //                this.SonicLevel.SetChunkAt(ex, ey, this.UIManager.UIManagerAreas.TileChunkArea.Data);
                        return true;
                    }
                    if (event.button == 0) {
                        switch (this.clickState) {
                            case Enums_7.ClickState.Dragging:
                                return true;
                            case Enums_7.ClickState.PlaceChunk:
                                ex = e.x / 128 | 0;
                                ey = e.y / 128 | 0;
                                var ch = this.sonicLevel.getChunkAt(ex, ey);
                                var tp = ch.GetTilePieceAt(e.x - ex * 128, e.y - ey * 128, true);
                                var dontClear = false;
                                //                    if (this.UIManager.UIManagerAreas.TileChunkArea != null) {
                                //                        if (this.UIManager.UIManagerAreas.TileChunkArea.Data == ch)
                                //                            dontClear = true;
                                //                        this.UIManager.UIManagerAreas.TileChunkArea.Data = ch;
                                //                    }
                                //                    if (this.UIManager.UIManagerAreas.TilePieceArea != null) {
                                //                        if (this.UIManager.UIManagerAreas.TilePieceArea.Data != tp)
                                //                            dontClear = true;
                                //                        this.UIManager.UIManagerAreas.TilePieceArea.Data = tp;
                                //                    }
                                // this.clearCache();
                                return true;
                            case Enums_7.ClickState.PlaceRing:
                                ex = e.x;
                                ey = e.y;
                                this.sonicLevel.Rings.push(Help_6.Help.merge(new Ring_2.Ring(true), { X: ex, Y: ey }));
                                return true;
                            case Enums_7.ClickState.PlaceObject:
                                ex = e.x;
                                ey = e.y;
                                var pos = new Utils_10.Point(ex, ey);
                                for (var _i = 0, _a = this.sonicLevel.Objects; _i < _a.length; _i++) {
                                    var o = _a[_i];
                                    if (Utils_10.IntersectingRectangle.IntersectsRect(o.GetRect(), pos))
                                        alert("Object Data: " + Help_6.Help.stringify(o));
                                }
                                return true;
                        }
                    }
                    return false;
                };
                SonicManager.prototype.tickObjects = function () {
                    var localPoint = new Utils_10.Point(0, 0);
                    this.inFocusObjects = new Array();
                    var levelObjectInfos = this.sonicLevel.Objects;
                    for (var _i = 0, levelObjectInfos_2 = levelObjectInfos; _i < levelObjectInfos_2.length; _i++) {
                        var obj = levelObjectInfos_2[_i];
                        localPoint.x = obj.X | 0;
                        localPoint.y = obj.Y | 0;
                        if (this.bigWindowLocation.Intersects(localPoint)) {
                            this.inFocusObjects.push(obj);
                            obj.Tick(obj, this.sonicLevel, this.sonicToon);
                        }
                    }
                    //        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
                    //            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
                    for (var _a = 0, _b = this.animationInstances; _a < _b.length; _a++) {
                        var animationInstance = _b[_a];
                        animationInstance.Tick();
                    }
                };
                SonicManager.prototype.Tick = function () {
                    if (this.loading)
                        return;
                    if (this.currentGameState == Enums_7.GameState.Playing) {
                        if (this.inHaltMode) {
                            if (this.waitingForTickContinue)
                                return;
                        }
                        this.tickCount++;
                        this.tickObjects();
                        this.sonicToon.ticking = true;
                        try {
                            this.sonicToon.tick(this.sonicLevel);
                        }
                        finally {
                            this.sonicToon.ticking = false;
                        }
                        if (this.inHaltMode) {
                            if (this.waitingForTickContinue)
                                return;
                            this.waitingForTickContinue = true;
                            this.waitingForDrawContinue = false;
                        }
                    }
                };
                SonicManager.prototype.PreloadSprites = function (completed, update) {
                    var _this = this;
                    if (this.spriteCache != null) {
                        completed();
                        return;
                    }
                    this.spriteCache = this.spriteCache != null ? this.spriteCache : new SpriteCache_1.SpriteCache();
                    var ci = this.spriteCache.Rings;
                    var spriteLocations = new Array();
                    for (var j = 0; j < 4; j++) {
                        spriteLocations.push("assets/sprites/ring" + j + ".png");
                        this.imageLength++;
                    }
                    var ind_ = this.spriteCache.Indexes;
                    this.spriteLoader = new SpriteLoader_1.SpriteLoader(completed, update);
                    if (ci.length == 0) {
                        var spriteStep = this.spriteLoader.AddStep("Sprites", function (i, done) {
                            Help_6.Help.loadSprite(spriteLocations[i], function (jd) {
                                ci[i] = CanvasInformation_7.CanvasInformation.create(jd.width, jd.height, false);
                                ci[i].Context.drawImage(jd, 0, 0);
                                done();
                            });
                        }, function () {
                            ind_.Sprites++;
                            if (ind_.Sprites == 4)
                                return true;
                            return false;
                        }, false);
                        for (var i = 0; i < spriteLocations.length; i++) {
                            this.spriteLoader.AddIterationToStep(spriteStep, i);
                        }
                    }
                    var cci = this.spriteCache.SonicSprites;
                    if (Object.keys(cci).length == 0) {
                        var sonicStep = this.spriteLoader.AddStep("Sonic Sprites", function (sp, done) {
                            for (var sonicSprite in _this.sonicSprites) {
                                cci[sonicSprite] = Help_6.Help.scaleCsImage(_this.sonicSprites[sonicSprite], new Utils_10.Point(1, 1), function (ec) {
                                });
                            }
                            done();
                        }, function () { return true; }, false);
                        this.spriteLoader.AddIterationToStep(sonicStep, 0);
                    }
                };
                SonicManager.prototype.MainDraw = function (canvas) {
                    var context = canvas.Context;
                    if (this.inHaltMode)
                        if (this.drawHaltMode(context))
                            return;
                    this.engine.Clear(canvas);
                    if (this.sonicLevel == null)
                        return;
                    context.save();
                    var localPoint = new Utils_10.Point(0, 0);
                    this.drawTickCount++;
                    if (this.spriteLoader && !this.spriteLoader.Tick() || this.loading) {
                        SonicManager.drawLoading(context);
                        context.restore();
                        return;
                    }
                    this.updatePositions(context);
                    var w1 = (this.windowLocation.Width / 128 | 0) + 2;
                    var h1 = (this.windowLocation.Height / 128 | 0) + 2;
                    if (this.currentGameState == Enums_7.GameState.Editing) {
                        w1 += 1;
                        h1 += 1;
                        w1 /= this.scale.x;
                        h1 /= this.scale.y;
                    }
                    var offs = SonicManager.getOffs(w1, h1);
                    this.tilePaletteAnimationManager.TickAnimatedPalettes();
                    this.tileAnimationManager.TickAnimatedTiles();
                    var fxP = ((this.windowLocation.x) / 128) | 0;
                    var fyP = ((this.windowLocation.y) / 128) | 0;
                    this.ResetCanvases();
                    var zero = new Utils_10.Point(0, 0);
                    if (this.background) {
                        var wOffset = this.windowLocation.x;
                        var bw = this.background.Width;
                        var movex = (wOffset / bw) * bw;
                        localPoint.x = -this.windowLocation.x + movex;
                        localPoint.y = -this.windowLocation.y / 4;
                        this.background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
                        localPoint.x = -this.windowLocation.x + movex + this.background.Width;
                        localPoint.y = -this.windowLocation.y / 4;
                        this.background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
                    }
                    this.drawLowChunks(this.lowChunkCanvas.Context, zero, offs, fyP, fxP);
                    if (this.showHeightMap)
                        this.drawHighChunks(this.lowChunkCanvas.Context, fxP, fyP, offs, zero);
                    this.drawObjects(this.sonicCanvas.Context, zero);
                    this.drawAnimations(this.sonicCanvas.Context);
                    this.drawRings(this.sonicCanvas.Context, zero);
                    this.drawSonic(this.sonicCanvas.Context);
                    if (!this.showHeightMap)
                        this.drawHighChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
                    this.drawDebugTextChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
                    //        this.lowChunkCanvas.Context.OffsetPixelsForWater();
                    //        this.highChuckCanvas.Context.OffsetPixelsForWater();
                    this.drawCanveses(context, localPoint);
                    context.restore();
                    if (this.currentGameState == Enums_7.GameState.Playing)
                        this.sonicToon.DrawUI(context, new Utils_10.Point(this.screenOffset.x, this.screenOffset.y));
                };
                SonicManager.prototype.drawCanveses = function (canvas, localPoint) {
                    if (window.doIt > 1) {
                        canvas.drawImage(((this.lowChunkCanvas.canvas)), localPoint.x, localPoint.y);
                        canvas.drawImage(((this.sonicCanvas.canvas)), localPoint.x, localPoint.y);
                        canvas.drawImage(((this.highChuckCanvas.canvas)), localPoint.x, localPoint.y);
                        canvas.scale(this.realScale.x, this.realScale.y);
                        canvas.scale(this.scale.x, this.scale.y);
                        var imageData = window.scaleTwice(canvas, localPoint.x, localPoint.y, this.windowLocation.Width, this.windowLocation.Height);
                        canvas.drawImage(imageData, localPoint.x, localPoint.y);
                    }
                    else {
                        canvas.scale(this.realScale.x, this.realScale.y);
                        canvas.scale(this.scale.x, this.scale.y);
                        canvas.drawImage(((this.lowChunkCanvas.canvas)), localPoint.x, localPoint.y);
                        canvas.drawImage(((this.sonicCanvas.canvas)), localPoint.x, localPoint.y);
                        canvas.drawImage(((this.highChuckCanvas.canvas)), localPoint.x, localPoint.y);
                    } /*
            
                    canvas.scale(this.scale.x, this.scale.y);
                    canvas.drawImage(this.lowChunkCanvas.canvas, localPoint.x, localPoint.y);
                    canvas.drawImage(this.sonicCanvas.canvas, localPoint.x, localPoint.y);
                    canvas.drawImage(this.highChuckCanvas.canvas, localPoint.x, localPoint.y);*/
                };
                SonicManager.prototype.ResetCanvases = function () {
                    this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation_7.CanvasInformation.create(this.windowLocation.Width, this.windowLocation.Height, false);
                    this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation_7.CanvasInformation.create(this.windowLocation.Width, this.windowLocation.Height, true);
                    this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation_7.CanvasInformation.create(this.windowLocation.Width, this.windowLocation.Height, false);
                    this.sonicCanvas.Context.clearRect(0, 0, this.windowLocation.Width, this.windowLocation.Height);
                    this.highChuckCanvas.Context.clearRect(0, 0, this.windowLocation.Width, this.windowLocation.Height);
                    this.lowChunkCanvas.Context.clearRect(0, 0, this.windowLocation.Width, this.windowLocation.Height);
                };
                SonicManager.prototype.DestroyCanvases = function () {
                    this.lowChunkCanvas = null;
                    this.sonicCanvas = null;
                    this.highChuckCanvas = null;
                };
                SonicManager.getOffs = function (w1, h1) {
                    var hash = (w1 + 1) * (h1 + 1);
                    if (SonicManager._cachedOffs[hash])
                        return SonicManager._cachedOffs[hash];
                    var offs = new Array(0);
                    var ca = 0;
                    for (var y = -1; y < h1; y++)
                        for (var x = -1; x < w1; x++)
                            offs[ca++] = (new Utils_10.Point(x, y));
                    return SonicManager._cachedOffs[hash] = offs;
                };
                SonicManager.prototype.updatePositions = function (canvas) {
                    this.screenOffset.x = 0;
                    this.screenOffset.y = 0;
                    if (this.currentGameState == Enums_7.GameState.Playing)
                        this.updatePositionsForPlaying(canvas);
                };
                SonicManager.prototype.updatePositionsForPlaying = function (canvas) {
                    // canvas.scale(this.realScale.x, this.realScale.y);
                    if (this.sonicToon.ticking) {
                        while (true) {
                            if (this.sonicToon.ticking)
                                break;
                        }
                    }
                    canvas.translate(this.screenOffset.x, this.screenOffset.y);
                    this.windowLocation.x = (this.sonicToon.x) - this.windowLocation.Width / 2;
                    this.windowLocation.y = (this.sonicToon.y) - this.windowLocation.Height / 2;
                    this.bigWindowLocation.x = (this.sonicToon.x) - this.bigWindowLocation.Width / 2;
                    this.bigWindowLocation.y = (this.sonicToon.y) - this.bigWindowLocation.Height / 2;
                    this.bigWindowLocation.x = (this.bigWindowLocation.x - this.windowLocation.Width * 0.2);
                    this.bigWindowLocation.y = (this.bigWindowLocation.y - this.windowLocation.Height * 0.2);
                    this.bigWindowLocation.Width = (this.windowLocation.Width * 1.8);
                    this.bigWindowLocation.Height = (this.windowLocation.Height * 1.8);
                };
                SonicManager.drawLoading = function (canvas) {
                    canvas.fillStyle = "white";
                    canvas.fillText("loading...   ", 95, 95);
                    canvas.restore();
                };
                SonicManager.prototype.drawHaltMode = function (canvas) {
                    canvas.fillStyle = "white";
                    canvas.font = "21pt arial bold";
                    canvas.fillText("HALT MODE\r\n Press: P to step\r\n        O to resume", 10, 120);
                    if (this.waitingForDrawContinue)
                        return true;
                    else
                        this.waitingForDrawContinue = true;
                    return false;
                };
                SonicManager.prototype.drawLowChunks = function (canvas, localPoint, offs, fyP, fxP) {
                    for (var _i = 0, offs_1 = offs; _i < offs_1.length; _i++) {
                        var off = offs_1[_i];
                        var _xP = fxP + off.x;
                        var _yP = fyP + off.y;
                        var _xPreal = fxP + off.x;
                        var _yPreal = fyP + off.y;
                        _xP = Help_6.Help.mod(_xP, this.sonicLevel.LevelWidth);
                        _yP = Help_6.Help.mod(_yP, this.sonicLevel.LevelHeight);
                        var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.x = (_xPreal * 128) - this.windowLocation.x | 0;
                        localPoint.y = (_yPreal * 128) - this.windowLocation.y | 0;
                        if (!chunk.isEmpty() && !chunk.OnlyForeground())
                            chunk.draw(canvas, localPoint, Enums_7.ChunkLayerState.Low);
                    }
                };
                SonicManager.prototype.drawHighChunks = function (canvas, fxP, fyP, offs, localPoint) {
                    var m = [];
                    for (var _i = 0, offs_2 = offs; _i < offs_2.length; _i++) {
                        var off = offs_2[_i];
                        var _xP = fxP + off.x;
                        var _yP = fyP + off.y;
                        var _xPreal = fxP + off.x;
                        var _yPreal = fyP + off.y;
                        _xP = Help_6.Help.mod(_xP, this.sonicLevel.LevelWidth);
                        _yP = Help_6.Help.mod(_yP, this.sonicLevel.LevelHeight);
                        var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.x = (_xPreal * 128) - this.windowLocation.x | 0;
                        localPoint.y = (_yPreal * 128) - this.windowLocation.y | 0;
                        if (!chunk.isEmpty() && !chunk.onlyBackground()) {
                            m.push(localPoint.x + " " + localPoint.y);
                            chunk.draw(canvas, localPoint, Enums_7.ChunkLayerState.High);
                        }
                        if (this.showHeightMap) {
                            var fd = this.spriteCache.HeightMapChunks[(this.sonicLevel.CurHeightMap ? 1 : 2) + " " + chunk.Index];
                            if (fd == null) {
                                fd = this.cacheHeightMapForChunk(chunk);
                            }
                            canvas.drawImage(fd.canvas, localPoint.x, localPoint.y);
                        }
                        if (this.currentGameState == Enums_7.GameState.Editing) {
                            canvas.strokeStyle = "#DD0033";
                            canvas.lineWidth = 3;
                            canvas.strokeRect(localPoint.x, localPoint.y, 128, 128);
                        }
                    }
                };
                SonicManager.prototype.drawDebugTextChunks = function (canvas, fxP, fyP, offs, localPoint) {
                    for (var _i = 0, offs_3 = offs; _i < offs_3.length; _i++) {
                        var off = offs_3[_i];
                        var _xP = fxP + off.x;
                        var _yP = fyP + off.y;
                        var _xPreal = fxP + off.x;
                        var _yPreal = fyP + off.y;
                        _xP = Help_6.Help.mod(_xP, this.sonicLevel.LevelWidth);
                        _yP = Help_6.Help.mod(_yP, this.sonicLevel.LevelHeight);
                        var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.x = (_xPreal * 128) - this.windowLocation.x;
                        localPoint.y = (_yPreal * 128) - this.windowLocation.y;
                        if (!chunk.isEmpty() && !chunk.OnlyForeground())
                            chunk.DrawAnimationDebug(canvas, localPoint, Enums_7.ChunkLayerState.Low, this.tileChunkDebugDrawOptions);
                        if (!chunk.isEmpty() && !chunk.onlyBackground())
                            chunk.DrawAnimationDebug(canvas, localPoint, Enums_7.ChunkLayerState.High, this.tileChunkDebugDrawOptions);
                    }
                };
                SonicManager.prototype.cacheHeightMapForChunk = function (chunk) {
                    var md = chunk;
                    var posj1 = new Utils_10.Point(0, 0);
                    var canv = CanvasInformation_7.CanvasInformation.create(128, 128, false);
                    var ctx = canv.Context;
                    this.engine.Clear(canv);
                    for (var _y = 0; _y < 8; _y++) {
                        for (var _x = 0; _x < 8; _x++) {
                            var tp = md.TilePieces[_x][_y];
                            var solid = (this.sonicLevel.CurHeightMap ? tp.Solid1 : tp.Solid2);
                            var hd = this.sonicLevel.CurHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
                            var __x = _x;
                            var __y = _y;
                            var vangle = 0;
                            var posm = new Utils_10.Point(posj1.x + (__x * 16), posj1.y + (__y * 16));
                            if (!hd)
                                continue;
                            if (hd.Full === false) {
                            }
                            else if (hd.Full === true) {
                                if (solid > 0) {
                                    ctx.fillStyle = HeightMap_2.HeightMap.colors[solid];
                                    ctx.fillRect(posj1.x + (__x * 16), posj1.y + (__y * 16), 16, 16);
                                }
                            }
                            else {
                                vangle = this.sonicLevel.CurHeightMap ? tp.GetLayer1Angles() : tp.GetLayer2Angles();
                                hd.Draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
                            }
                        }
                    }
                    return this.spriteCache.HeightMapChunks[(this.sonicLevel.CurHeightMap ? 1 : 2) + " " + md.Index] = canv;
                };
                SonicManager.prototype.drawSonic = function (canvas) {
                    if (this.currentGameState == Enums_7.GameState.Playing) {
                        this.sonicToon.draw(canvas);
                    }
                };
                SonicManager.prototype.drawRings = function (canvas, localPoint) {
                    for (var index = 0; index < this.sonicLevel.Rings.length; index++) {
                        var r = this.sonicLevel.Rings[index];
                        switch (this.currentGameState) {
                            case Enums_7.GameState.Playing:
                                if (!this.sonicToon.obtainedRing[index]) {
                                    if (this.bigWindowLocation.Intersects(r))
                                        this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x | 0, this.windowLocation.y | 0));
                                }
                                break;
                            case Enums_7.GameState.Editing:
                                if (this.bigWindowLocation.Intersects(r))
                                    this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x | 0, this.windowLocation.y | 0));
                                break;
                        }
                    }
                    switch (this.currentGameState) {
                        case Enums_7.GameState.Playing:
                            for (var i = this.activeRings.length - 1; i >= 0; i--) {
                                var ac = this.activeRings[i];
                                localPoint.x = ac.x - this.windowLocation.x | 0;
                                localPoint.y = ac.y - this.windowLocation.y | 0;
                                ac.Draw(canvas, localPoint);
                                if (ac.TickCount > 256)
                                    this.activeRings.splice(i, 1);
                            }
                            break;
                        case Enums_7.GameState.Editing:
                            break;
                    }
                };
                SonicManager.prototype.drawAnimations = function (canvas) {
                    for (var _i = 0, _a = this.animationInstances; _i < _a.length; _i++) {
                        var ano = _a[_i];
                        ano.Draw(canvas, -this.windowLocation.x | 0, -this.windowLocation.y | 0);
                    }
                };
                SonicManager.prototype.drawObjects = function (canvas, localPoint) {
                    var levelObjectInfos = this.sonicLevel.Objects;
                    for (var _i = 0, levelObjectInfos_3 = levelObjectInfos; _i < levelObjectInfos_3.length; _i++) {
                        var o = levelObjectInfos_3[_i];
                        localPoint.x = o.X;
                        localPoint.y = o.Y;
                        if (o.Dead || this.bigWindowLocation.Intersects(localPoint)) {
                            o.Draw(canvas, ((localPoint.x - this.windowLocation.x)) | 0, ((localPoint.y - this.windowLocation.y)) | 0, this.showHeightMap);
                        }
                    }
                };
                SonicManager.prototype.containsAnimatedTile = function (tile, sonLevel) {
                    for (var _i = 0, _a = sonLevel.TileAnimations; _i < _a.length; _i++) {
                        var an = _a[_i];
                        var anin = an.AnimationTileIndex;
                        var num = an.NumberOfTiles;
                        if (tile >= anin && tile < anin + num)
                            return an;
                    }
                    return null;
                };
                SonicManager.prototype.clearCache = function () {
                    if (this.spriteCache != null)
                        this.spriteCache.ClearCache();
                    if (this.sonicLevel != null)
                        this.sonicLevel.ClearCache();
                    if (this.tilePaletteAnimationManager != null)
                        this.tilePaletteAnimationManager.ClearCache();
                    if (this.tileAnimationManager != null)
                        this.tileAnimationManager.ClearCache();
                };
                SonicManager.prototype.mouseUp = function (queryEvent) {
                    this.clicking = false;
                    return false;
                };
                SonicManager.prototype.mouseMove = function (queryEvent) {
                    if (this.clicking)
                        if (this.effectClick(queryEvent))
                            return true;
                    return false;
                };
                SonicManager.prototype.ReplaceMagic = function () {
                    this.Replace(new Utils_10.Rectangle(0, 0, 15, 30), new Utils_10.Point(712, 40));
                };
                SonicManager.prototype.Replace = function (from, to) {
                    var _this = this;
                    var _loop_2 = function(y) {
                        var curY = y;
                        window.setTimeout(function () {
                            for (var x = 0; x < from.Width; x++) {
                                var toChunkX = (to.x + x) / 8;
                                var toChunkY = (to.y + curY) / 8;
                                var tochunk = _this.sonicLevel.getChunkAt(toChunkX, toChunkY);
                                tochunk.clearCache();
                                var totp = tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                                tochunk.IsOnlyBackground = null;
                                tochunk.IsOnlyForeground = null;
                                var fromChunkX = (from.x + x) / 8 | 0;
                                var fromChunkY = (from.y + curY) / 8 | 0;
                                var fromchunk = _this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                                fromchunk.clearCache();
                                fromchunk.IsOnlyBackground = null;
                                fromchunk.IsOnlyForeground = null;
                                var fromtp = fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8];
                                tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8] = fromtp;
                                fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8] = totp;
                            }
                        }, (from.Height - y) * 50);
                    };
                    for (var y = from.Height; y >= 0; y--) {
                        _loop_2(y);
                    }
                };
                SonicManager.prototype.cacheTiles = function () {
                    console.time("tileCache");
                    this.tilePaletteAnimationManager = new TilePaletteAnimationManager_1.TilePaletteAnimationManager(this);
                    this.tileAnimationManager = new TileAnimationManager_1.TileAnimationManager(this);
                    for (var _i = 0, _a = this.sonicLevel.TileChunks; _i < _a.length; _i++) {
                        var chunk = _a[_i];
                        chunk.initCache();
                        chunk.warmCache();
                    }
                    console.timeEnd("tileCache");
                    if (this.sonicToon != null) {
                        console.time("collisionCache");
                        for (var _b = 0, _c = this.sonicLevel.TileChunks; _b < _c.length; _b++) {
                            var chunk = _c[_b];
                            this.sonicToon.sensorManager.buildChunk(chunk, false);
                            this.sonicToon.sensorManager.buildChunk(chunk, true);
                        }
                        console.timeEnd("collisionCache");
                    }
                    if (false) {
                        this.debugDraw();
                    }
                };
                SonicManager.prototype.debugDraw = function () {
                    var numWide = 10;
                    var dropOffIndex = 0;
                    var pieces = new Array();
                    while (true) {
                        var debugCanvases = new Array();
                        var totalHeight = 0;
                        var broke = false;
                        for (var index = dropOffIndex; index < this.sonicLevel.TileChunks.length; index++) {
                            var chunk = this.sonicLevel.TileChunks[index];
                            var canvasCache = chunk.Debug_DrawCache();
                            totalHeight += canvasCache.canvas.height;
                            debugCanvases.push(canvasCache);
                            if (totalHeight > 10000) {
                                dropOffIndex = index + 1;
                                broke = true;
                                break;
                            }
                        }
                        var bigOne = CanvasInformation_7.CanvasInformation.create(numWide * 128, totalHeight, false);
                        var currentPosition = 0;
                        for (var index = 0; index < debugCanvases.length; index++) {
                            var canvasInformation = debugCanvases[index];
                            bigOne.Context.drawImage(canvasInformation.canvas, 0, currentPosition);
                            currentPosition += canvasInformation.canvas.height;
                        }
                        pieces.push(bigOne.canvas.toDataURL());
                        if (!broke)
                            break;
                    }
                    var str = "<html><body>";
                    for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
                        var piece = pieces_1[_i];
                        str += "<img src=\"" + piece + "\"/>\n";
                    }
                    str += "</body></html>";
                    var tx = document.createElement("textarea");
                    tx.style.position = "absolute";
                    tx.value = str;
                    document.body.appendChild(tx);
                };
                SonicManager.prototype.loadObjects = function (objects) {
                    this.cachedObjects = {};
                    var _loop_3 = function() {
                        var o = t.Key;
                        if (this_1.cachedObjects[o]) {
                            t.SetObjectData(this_1.cachedObjects[o]);
                            return "continue";
                        }
                        var d = objects.filter(function (p) { return p.key == o; })[0];
                        if (!d) {
                            t.SetObjectData(new LevelObject_2.LevelObject(o));
                            return "continue";
                        }
                        var dat = void 0;
                        if (d.value.length == 0)
                            dat = new LevelObjectData_1.LevelObjectData();
                        else
                            dat = JSON.parse(d.value);
                        var dr = ObjectManager_2.ObjectManager.ExtendObject(dat);
                        this_1.cachedObjects[o] = dr;
                        t.SetObjectData(dr);
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = this.sonicLevel.Objects; _i < _a.length; _i++) {
                        var t = _a[_i];
                        var state_3 = _loop_3();
                        if (state_3 === "continue") continue;
                    }
                };
                SonicManager.prototype.downloadObjects = function (objects) {
                    SonicEngine_1.SonicEngine.instance.client.emit("GetObjects", objects);
                };
                SonicManager.prototype.Load = function (sonicLevel) {
                    var _this = this;
                    this.loading = true;
                    this.sonicLevel = new SonicLevel_1.SonicLevel();
                    for (var n = 0; n < sonicLevel.Rings.length; n++) {
                        this.sonicLevel.Rings[n] = new Ring_2.Ring(true);
                        this.sonicLevel.Rings[n].x = sonicLevel.Rings[n].X;
                        this.sonicLevel.Rings[n].y = sonicLevel.Rings[n].Y;
                    }
                    this.sonicLevel.LevelWidth = sonicLevel.ForegroundWidth;
                    this.sonicLevel.LevelHeight = sonicLevel.ForegroundHeight;
                    this.sonicLevel.ChunkMap = sonicLevel.Foreground;
                    this.sonicLevel.BGChunkMap = sonicLevel.Background;
                    for (var l = 0; l < sonicLevel.Objects.length; l++) {
                        this.sonicLevel.Objects[l] = new LevelObjectInfo_1.LevelObjectInfo(sonicLevel.Objects[l]);
                        this.sonicLevel.Objects[l].Index = l;
                    }
                    var objectKeys = new Array();
                    this.sonicLevel.Objects.forEach(function (t) {
                        var o = t.Key;
                        if (objectKeys.filter(function (p) { return p != o; }).length == objectKeys.length)
                            objectKeys.push(o);
                    });
                    this.downloadObjects(objectKeys);
                    for (var j = 0; j < sonicLevel.Tiles.length; j++) {
                        var fc = sonicLevel.Tiles[j];
                        var tiles = fc;
                        var mj = new Array();
                        for (var i = 0; i < tiles.length; i++) {
                            var value = sonicLevel.Tiles[j][i];
                            mj.push((value >> 4));
                            mj.push((value & 0xF));
                        }
                        var mfc = new Array(8);
                        for (var o = 0; o < 8; o++) {
                            mfc[o] = new Array(8);
                        }
                        for (var n = 0; n < mj.length; n++) {
                            mfc[n % 8][n / 8 | 0] = mj[n];
                        }
                        this.sonicLevel.Tiles[j] = new Tile_1.Tile(mfc);
                        this.sonicLevel.Tiles[j].index = j;
                    }
                    var acs = this.sonicLevel.AnimatedChunks = new Array();
                    if (sonicLevel.AnimatedFiles) {
                        this.sonicLevel.AnimatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
                        for (var animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                            var animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                            this.sonicLevel.AnimatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
                            for (var filePiece = 0; filePiece < animatedFile.length; filePiece++) {
                                var c = animatedFile[filePiece];
                                var tiles = c;
                                var mjc = new Array();
                                for (var l = 0; l < tiles.length; l++) {
                                    var value = animatedFile[filePiece][l];
                                    mjc.push((value >> 4));
                                    mjc.push((value & 0xF));
                                }
                                var mfc = new Array(8);
                                for (var o = 0; o < 8; o++) {
                                    mfc[o] = new Array(8);
                                }
                                for (var n = 0; n < mjc.length; n++) {
                                    mfc[n % 8][n / 8 | 0] = mjc[n];
                                }
                                var tile = new Tile_1.Tile(mfc);
                                tile.isTileAnimated = true;
                                tile.index = filePiece * 10000 + animatedFileIndex;
                                this.sonicLevel.AnimatedTileFiles[animatedFileIndex][filePiece] = tile;
                            }
                        }
                    }
                    for (var j = 0; j < sonicLevel.Blocks.length; j++) {
                        var fc = sonicLevel.Blocks[j];
                        var mj = new TilePiece_1.TilePiece();
                        mj.Index = j;
                        mj.Tiles = new Array();
                        for (var p = 0; p < fc.length; p++) {
                            mj.Tiles.push(Help_6.Help.merge(new TileInfo_1.TileInfo(), {
                                _Tile: fc[p].Tile,
                                Index: p,
                                Palette: fc[p].Palette,
                                Priority: fc[p].Priority,
                                XFlip: fc[p].XFlip,
                                YFlip: fc[p].YFlip
                            }));
                        }
                        mj.Init();
                        this.sonicLevel.TilePieces[j] = mj;
                    }
                    this.sonicLevel.Angles = sonicLevel.Angles;
                    this.sonicLevel.TileAnimations = sonicLevel.Animations.map(function (a) { return Help_6.Help.merge(new TileAnimationData_1.TileAnimationData(), {
                        AnimationTileFile: a.AnimationFile,
                        AnimationTileIndex: a.AnimationTileIndex,
                        AutomatedTiming: a.AutomatedTiming,
                        NumberOfTiles: a.NumberOfTiles,
                        DataFrames: a.Frames.map(function (b) { return Help_6.Help.merge(new TileAnimationData_1.TileAnimationDataFrame(), { Ticks: b.Ticks, StartingTileIndex: b.StartingTileIndex }); }).slice(0)
                    }); });
                    this.sonicLevel.CollisionIndexes1 = sonicLevel.CollisionIndexes1;
                    this.sonicLevel.CollisionIndexes2 = sonicLevel.CollisionIndexes2;
                    for (var i = 0; i < sonicLevel.HeightMaps.length; i++) {
                        var b1 = true;
                        var b2 = true;
                        for (var m = 0; m < sonicLevel.HeightMaps[i].length; m++) {
                            if (b1 && sonicLevel.HeightMaps[i][m] !== 0)
                                b1 = false;
                            if (b2 && sonicLevel.HeightMaps[i][m] !== 16)
                                b2 = false;
                        }
                        if (b1)
                            this.sonicLevel.HeightMaps[i] = HeightMap_2.HeightMap.FullHeight(false);
                        else if (b2)
                            this.sonicLevel.HeightMaps[i] = HeightMap_2.HeightMap.FullHeight(true);
                        else
                            this.sonicLevel.HeightMaps[i] = new HeightMap_2.HeightMap(sonicLevel.HeightMaps[i], i);
                    }
                    for (var j = 0; j < sonicLevel.Chunks.length; j++) {
                        var fc = sonicLevel.Chunks[j];
                        var mj = new TileChunk_1.TileChunk();
                        mj.Index = j;
                        mj.TilePieces = new Array(8);
                        for (var i = 0; i < 8; i++) {
                            mj.TilePieces[i] = new Array(8);
                        }
                        for (var p = 0; p < fc.length; p++) {
                            mj.TilePieces[p % 8][(p / 8) | 0] = Help_6.Help.merge(new TilePieceInfo_1.TilePieceInfo(), {
                                Index: p,
                                Block: fc[p].Block,
                                Solid1: fc[p].Solid1,
                                Solid2: fc[p].Solid2,
                                XFlip: fc[p].XFlip,
                                YFlip: fc[p].YFlip
                            });
                        }
                        this.sonicLevel.TileChunks[j] = mj;
                        mj.TileAnimations = {};
                        for (var tpX = 0; tpX < mj.TilePieces.length; tpX++) {
                            for (var tpY = 0; tpY < mj.TilePieces[tpX].length; tpY++) {
                                var pm = mj.TilePieces[tpX][tpY].GetTilePiece();
                                if (pm != null) {
                                    for (var _i = 0, _a = pm.Tiles; _i < _a.length; _i++) {
                                        var mjc = _a[_i];
                                        var fa = this.containsAnimatedTile(mjc._Tile, this.sonicLevel);
                                        if (fa) {
                                            mj.TileAnimations[tpY * 8 + tpX] = fa;
                                            acs[j] = mj;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.sonicLevel.Palette = sonicLevel.Palette.map(function (a) { return a.map(function (b) { return "#" + b; }); });
                    this.sonicLevel.StartPositions = sonicLevel.StartPositions.map(function (a) { return new Utils_10.Point(a.X, a.Y); });
                    this.sonicLevel.AnimatedPalettes = new Array();
                    if (sonicLevel.PaletteItems.length > 0) {
                        for (var k = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                            var pal = sonicLevel.PaletteItems[0][k];
                            this.sonicLevel.AnimatedPalettes.push(Help_6.Help.merge(new SonicLevel_1.PaletteItem(), {
                                Palette: eval(pal.Palette).map(function (b) { return "#" + b; }),
                                SkipIndex: pal.SkipIndex,
                                TotalLength: pal.TotalLength,
                                Pieces: pal.Pieces.map(function (a) { return Help_6.Help.merge(new SonicLevel_1.PaletteItemPieces(), {
                                    PaletteIndex: a.PaletteIndex,
                                    PaletteMultiply: a.PaletteMultiply,
                                    PaletteOffset: a.PaletteOffset
                                }); })
                            }));
                        }
                    }
                    for (var _b = 0, _c = this.sonicLevel.TilePieces; _b < _c.length; _b++) {
                        var tilePiece = _c[_b];
                        tilePiece.AnimatedPaletteIndexes = new Array();
                        tilePiece.AnimatedTileIndexes = new Array();
                        if (this.sonicLevel.AnimatedPalettes.length > 0) {
                            for (var _d = 0, _e = tilePiece.Tiles; _d < _e.length; _d++) {
                                var mj = _e[_d];
                                var tile = mj.GetTile();
                                if (tile) {
                                    tile.animatedPaletteIndexes = new Array();
                                    var pl = tile.GetAllPaletteIndexes();
                                    tile.paletteIndexesToBeAnimated = {};
                                    tile.animatedTileIndexes = new Array();
                                    for (var tileAnimationIndex = 0; tileAnimationIndex < this.sonicLevel.TileAnimations.length; tileAnimationIndex++) {
                                        var tileAnimationData = this.sonicLevel.TileAnimations[tileAnimationIndex];
                                        var anin = tileAnimationData.AnimationTileIndex;
                                        var num = tileAnimationData.NumberOfTiles;
                                        if (tile.index >= anin && tile.index < anin + num) {
                                            tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                            tile.animatedTileIndexes.push(tileAnimationIndex);
                                        }
                                    }
                                    for (var animatedPaletteIndex = 0; animatedPaletteIndex < this.sonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                                        var pal = this.sonicLevel.AnimatedPalettes[animatedPaletteIndex];
                                        tile.paletteIndexesToBeAnimated[animatedPaletteIndex] = new Array();
                                        var _loop_4 = function(mjce) {
                                            var mje1 = mjce;
                                            if (mj.Palette == mje1.PaletteIndex) {
                                                if (pl.filter(function (j) { return j == (mje1.PaletteOffset / 2 | 0) || j == (mje1.PaletteOffset / 2 | 0) + 1; }).length > 0) {
                                                    tilePiece.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                                    tile.animatedPaletteIndexes.push(animatedPaletteIndex);
                                                    for (var _f = 0, pl_1 = pl; _f < pl_1.length; _f++) {
                                                        var pIndex = pl_1[_f];
                                                        if (pIndex == (mje1.PaletteOffset / 2 | 0) || pIndex == (mje1.PaletteOffset / 2 | 0) + 1) {
                                                            tile.paletteIndexesToBeAnimated[animatedPaletteIndex].push(pIndex);
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        for (var _g = 0, _h = pal.Pieces; _g < _h.length; _g++) {
                                            var mjce = _h[_g];
                                            _loop_4(mjce);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var finished = (function () {
                        _this.loading = false;
                    });
                    this.PreloadSprites(function () {
                        finished();
                        _this.forceResize();
                    }, function (s) {
                    });
                    this.forceResize();
                    this.onLevelLoad && this.onLevelLoad(this.sonicLevel);
                };
                SonicManager._cachedOffs = {};
                return SonicManager;
            }());
            exports_42("SonicManager", SonicManager);
            tempArrays = {};
            tempBArrays = {};
            tempCnvs = {};
            posLookups = {};
            colsLookups = {};
            window.scaleIt = function scaleMe(imageData, width, height) {
                var width2 = width * 2;
                var height2 = height * 2;
                var pixels2_ = getArray(width2 * height2);
                var cnv = getCnv(width2, height2);
                doPixelCompare(imageData, width, height, width2, height2, pixels2_, getPosLookup(width, height), getColsLookup(imageData, width, height));
                return pixels2_;
            };
            imageDataCaches = {};
            ;
            window.scaleTwice = function scaleMe(canvas, x, y, width, height) {
                var a = window.doIt;
                canvas.scale(1 / Math.pow(2, a - 1), 1 / Math.pow(2, a - 1));
                if (a == 2) {
                    var imageData = canvas.getImageData(x, y, width, height).data;
                    imageData = window.scaleIt(imageData, width, height);
                    var id = imageDataCache(canvas, width * 2, height * 2);
                    id.data.set(imageData);
                    var canvas = getCnv(id.width, id.height);
                    canvas.context.putImageData(id, 0, 0);
                    return canvas.canvas;
                }
                else if (a == 3) {
                    var imageData = canvas.getImageData(x, y, width, height).data;
                    imageData = window.scaleIt(imageData, width, height);
                    imageData = window.scaleIt(imageData, width * 2, height * 2);
                    var id = imageDataCache(canvas, width * 2 * 2, height * 2 * 2);
                    id.data.set(imageData);
                    var canvas = getCnv(id.width, id.height);
                    canvas.context.putImageData(id, 0, 0);
                    return canvas.canvas;
                }
                else if (a == 4) {
                    var imageData = canvas.getImageData(x, y, width, height).data;
                    imageData = window.scaleIt(imageData, width, height);
                    imageData = window.scaleIt(imageData, width * 2, height * 2);
                    imageData = window.scaleIt(imageData, width * 2 * 2, height * 2 * 2);
                    var id = imageDataCache(canvas, width * 2 * 2 * 2, height * 2 * 2 * 2);
                    id.data.set(imageData);
                    var canvas = getCnv(id.width, id.height);
                    canvas.context.putImageData(id, 0, 0);
                    return canvas.canvas;
                }
                else if (a == 5) {
                    var imageData = canvas.getImageData(x, y, width, height).data;
                    imageData = window.scaleIt(imageData, width, height);
                    imageData = window.scaleIt(imageData, width * 2, height * 2);
                    imageData = window.scaleIt(imageData, width * 2 * 2, height * 2 * 2);
                    imageData = window.scaleIt(imageData, width * 2 * 2 * 2, height * 2 * 2 * 2);
                    var id = imageDataCache(canvas, width * 2 * 2 * 2 * 2, height * 2 * 2 * 2 * 2);
                    id.data.set(imageData);
                    var canvas = getCnv(id.width, id.height);
                    canvas.context.putImageData(id, 0, 0);
                    return canvas.canvas;
                }
                else if (a == 6) {
                    var imageData = canvas.getImageData(x, y, width, height).data;
                    imageData = window.scaleIt(imageData, width, height);
                    imageData = window.scaleIt(imageData, width * 2, height * 2);
                    imageData = window.scaleIt(imageData, width * 2 * 2, height * 2 * 2);
                    imageData = window.scaleIt(imageData, width * 2 * 2 * 2, height * 2 * 2 * 2);
                    imageData = window.scaleIt(imageData, width * 2 * 2 * 2 * 2, height * 2 * 2 * 2 * 2);
                    var id = imageDataCache(canvas, width * 2 * 2 * 2 * 2 * 2, height * 2 * 2 * 2 * 2 * 2);
                    id.data.set(imageData);
                    var canvas = getCnv(id.width, id.height);
                    canvas.context.putImageData(id, 0, 0);
                    return canvas.canvas;
                }
            };
            window.doIt = 1;
        }
    }
});
/// <reference path="../../typings/keyboardjs.d.ts" />
/// <reference path="../../typings/socket.io-client.d.ts" />
System.register("game/SonicEngine", ["common/CanvasInformation", "game/SonicManager", "common/Enums", "common/Utils", "game/sonic/Sonic", "common/Help"], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var CanvasInformation_8, SonicManager_16, Enums_8, Utils_11, Sonic_1, Help_7;
    var SonicEngine;
    return {
        setters:[
            function (CanvasInformation_8_1) {
                CanvasInformation_8 = CanvasInformation_8_1;
            },
            function (SonicManager_16_1) {
                SonicManager_16 = SonicManager_16_1;
            },
            function (Enums_8_1) {
                Enums_8 = Enums_8_1;
            },
            function (Utils_11_1) {
                Utils_11 = Utils_11_1;
            },
            function (Sonic_1_1) {
                Sonic_1 = Sonic_1_1;
            },
            function (Help_7_1) {
                Help_7 = Help_7_1;
            }],
        execute: function() {
            SonicEngine = (function () {
                function SonicEngine() {
                    var _this = this;
                    this.wideScreen = true;
                    this.fullscreenMode = false;
                    this.gameGoodWidth = 0;
                    this.canvasWidth = 0;
                    this.canvasHeight = 0;
                    SonicEngine.instance = this;
                    var gameCanvasName = "gameLayer";
                    this.gameCanvas = CanvasInformation_8.CanvasInformation.CreateFromElement(document.getElementById(gameCanvasName), 0, 0, true);
                    this.canvasWidth = 0;
                    this.canvasHeight = 0;
                    this.bindInput();
                    this.fullscreenMode = true;
                    window.addEventListener("resize", function (e) { return _this.resizeCanvas(true); });
                    jQuery(document).resize(function (e) { return _this.resizeCanvas(true); });
                    this.sonicManager = new SonicManager_16.SonicManager(this, this.gameCanvas, function () { return _this.resizeCanvas(true); });
                    this.sonicManager.indexedPalette = 0;
                    window.setInterval(function () { return _this.sonicManager.Tick(); }, 1000 / 60);
                    window.setInterval(function () { return _this.GameDraw(); }, 1000 / 60);
                    this.resizeCanvas(true);
                }
                SonicEngine.prototype.bindInput = function () {
                    var _this = this;
                    this.gameCanvas.domCanvas.mousedown(function (e) { return _this.canvasOnClick(e); });
                    this.gameCanvas.domCanvas.mouseup(function (e) { return _this.canvasMouseUp(e); });
                    this.gameCanvas.domCanvas.mousemove(function (e) { return _this.canvasMouseMove(e); });
                    this.gameCanvas.domCanvas.bind("touchstart", function (e) { return _this.canvasOnClick(e); });
                    this.gameCanvas.domCanvas.bind("touchend", function (e) { return _this.canvasMouseUp(e); });
                    this.gameCanvas.domCanvas.bind("touchmove", function (e) { return _this.canvasMouseMove(e); });
                    this.gameCanvas.domCanvas.bind("contextmenu", function (e) { return e.preventDefault(); });
                    keyboardJS.bind("f", function () {
                        _this.sonicManager.showHeightMap = !_this.sonicManager.showHeightMap;
                    }, function () {
                    });
                    keyboardJS.bind("o", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            _this.sonicManager.inHaltMode = !_this.sonicManager.inHaltMode;
                    }, function () {
                    });
                    keyboardJS.bind("1", function () {
                        _this.sonicManager.indexedPalette++;
                        _this.sonicManager.clearCache();
                    }, function () {
                    });
                    keyboardJS.bind("2", function () {
                        window.doIt += 1;
                        if (window.doIt == 5)
                            window.doIt = 1;
                    }, function () {
                    });
                    keyboardJS.bind("q", function () {
                        _this.runGame();
                    }, function () {
                    });
                    keyboardJS.bind("p", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            if (_this.sonicManager.inHaltMode)
                                _this.sonicManager.waitingForTickContinue = false;
                    }, function () {
                    });
                    keyboardJS.bind("h", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            _this.sonicManager.sonicToon.Hit(_this.sonicManager.sonicToon.x, _this.sonicManager.sonicToon.y);
                    }, function () {
                    });
                    keyboardJS.bind("u", function () {
                        _this.wideScreen = !_this.wideScreen;
                        _this.resizeCanvas(true);
                    }, function () {
                    });
                    keyboardJS.bind("c", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            _this.sonicManager.sonicToon.Debug();
                    }, function () {
                    });
                    keyboardJS.bind("up", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.PressUp();
                                break;
                            case Enums_8.GameState.Editing:
                                _this.sonicManager.windowLocation.y -= 128;
                                _this.sonicManager.bigWindowLocation.y -= 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.ReleaseUp();
                                break;
                            case Enums_8.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("down", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.PressCrouch();
                                break;
                            case Enums_8.GameState.Editing:
                                _this.sonicManager.windowLocation.y += 128;
                                _this.sonicManager.bigWindowLocation.y += 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.ReleaseCrouch();
                                break;
                            case Enums_8.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("left", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.PressLeft();
                                break;
                            case Enums_8.GameState.Editing:
                                _this.sonicManager.windowLocation.x -= 128;
                                _this.sonicManager.bigWindowLocation.x -= 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.ReleaseLeft();
                                break;
                            case Enums_8.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("right", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.PressRight();
                                break;
                            case Enums_8.GameState.Editing:
                                _this.sonicManager.windowLocation.x += 128;
                                _this.sonicManager.bigWindowLocation.x += 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.ReleaseRight();
                                break;
                            case Enums_8.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("space", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.PressJump();
                                break;
                            case Enums_8.GameState.Editing:
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_8.GameState.Playing:
                                _this.sonicManager.sonicToon.ReleaseJump();
                                break;
                            case Enums_8.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("e", function () {
                        _this.sonicManager.sonicLevel.CurHeightMap = !_this.sonicManager.sonicLevel.CurHeightMap;
                    }, function () {
                    });
                    //            this.client.emit("LoadLevel.Request", { Data:'Angel Island Zone Act 1'});
                    this.client = io.connect("159.203.118.77:8998");
                    this.client.on("LoadLevel.Response", function (data) {
                        _this.LoadLevel(data.Data);
                    });
                    this.client.on("GetObjects.Response", function (data) {
                        _this.sonicManager.loadObjects(data.Data);
                    });
                };
                SonicEngine.prototype.LoadLevel = function (data) {
                    var l = JSON.parse(Help_7.Help.decodeString(data));
                    SonicEngine.instance.RunSonic(l);
                };
                SonicEngine.prototype.RunSonic = function (level) {
                    this.sonicManager.clearCache();
                    this.sonicManager.Load(level);
                    this.sonicManager.windowLocation.x = 0;
                    this.sonicManager.windowLocation.y = 0;
                    this.sonicManager.bigWindowLocation.x = (this.sonicManager.windowLocation.x - this.sonicManager.windowLocation.Width * 0.2) | 0;
                    this.sonicManager.bigWindowLocation.y = (this.sonicManager.windowLocation.y - this.sonicManager.windowLocation.Height * 0.2) | 0;
                    this.sonicManager.bigWindowLocation.Width = (this.sonicManager.windowLocation.Width * 1.8) | 0;
                    this.sonicManager.bigWindowLocation.Height = (this.sonicManager.windowLocation.Height * 1.8) | 0;
                    var dl = Help_7.Help.getQueryString();
                    if (dl["run"]) {
                        if (this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            this.runGame();
                        this.runGame();
                    }
                    this.sonicManager.cacheTiles();
                    this.runGame();
                };
                SonicEngine.prototype.runGame = function () {
                    var sonicManager = SonicManager_16.SonicManager.instance;
                    switch (sonicManager.currentGameState) {
                        case Enums_8.GameState.Playing:
                            sonicManager.currentGameState = Enums_8.GameState.Editing;
                            sonicManager.scale = new Utils_11.Point(1, 1);
                            sonicManager.windowLocation = Help_7.Help.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                            sonicManager.sonicToon = null;
                            break;
                        case Enums_8.GameState.Editing:
                            sonicManager.currentGameState = Enums_8.GameState.Playing;
                            sonicManager.scale = new Utils_11.Point(2, 2);
                            sonicManager.windowLocation = Help_7.Help.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                            sonicManager.sonicToon = new Sonic_1.Sonic();
                            break;
                    }
                    sonicManager.DestroyCanvases();
                    sonicManager.ResetCanvases();
                };
                SonicEngine.prototype.canvasMouseMove = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.mouseMove(queryEvent);
                };
                SonicEngine.prototype.canvasOnClick = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.OnClick(queryEvent);
                };
                SonicEngine.prototype.canvasMouseUp = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.mouseUp(queryEvent);
                };
                SonicEngine.prototype.resizeCanvas = function (resetOverride) {
                    this.canvasWidth = $(window).width();
                    this.canvasHeight = $(window).height();
                    this.sonicManager.windowLocation = Help_7.Help.defaultWindowLocation(this.sonicManager.currentGameState, this.sonicManager.scale);
                    var wide = new Utils_11.DoublePoint((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y));
                    var even = new Utils_11.DoublePoint(Math.min((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y)), Math.min((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y)));
                    this.sonicManager.realScale = !this.fullscreenMode ? new Utils_11.DoublePoint(1, 1) : (this.wideScreen ? wide : even);
                    if (resetOverride || this.sonicManager.overrideRealScale == null)
                        this.sonicManager.overrideRealScale = Utils_11.DoublePoint.create(this.sonicManager.realScale);
                    else
                        this.sonicManager.realScale = Utils_11.DoublePoint.create(this.sonicManager.overrideRealScale);
                    this.gameCanvas.domCanvas.attr("width", (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == Enums_8.GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1)).toString());
                    this.gameCanvas.domCanvas.attr("height", (this.sonicManager.windowLocation.Height * (this.sonicManager.currentGameState == Enums_8.GameState.Playing ? this.sonicManager.scale.y * this.sonicManager.realScale.y : 1)).toString());
                    this.gameGoodWidth = (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == Enums_8.GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1));
                    var screenOffset = this.sonicManager.currentGameState == Enums_8.GameState.Playing ? new Utils_11.DoublePoint(((this.canvasWidth / 2 - this.sonicManager.windowLocation.Width * this.sonicManager.scale.x * this.sonicManager.realScale.x / 2)), (this.canvasHeight / 2 - this.sonicManager.windowLocation.Height * this.sonicManager.scale.y * this.sonicManager.realScale.y / 2)) : new Utils_11.DoublePoint(0, 0);
                    this.gameCanvas.domCanvas.css("left", screenOffset.x + 'px');
                    this.gameCanvas.domCanvas.css("top", screenOffset.y + 'px');
                    this.sonicManager.DestroyCanvases();
                    this.sonicManager.ResetCanvases();
                };
                SonicEngine.prototype.Clear = function (canv) {
                    canv.domCanvas[0].width = this.gameGoodWidth;
                    this.gameCanvas.Context.mozImageSmoothingEnabled = false; /// future
                    this.gameCanvas.Context.msImageSmoothingEnabled = false; /// future
                    this.gameCanvas.Context.imageSmoothingEnabled = false; /// future
                    this.gameCanvas.Context.imageSmoothingEnabled = false;
                };
                SonicEngine.prototype.GameDraw = function () {
                    this.sonicManager.MainDraw(this.gameCanvas);
                };
                return SonicEngine;
            }());
            exports_43("SonicEngine", SonicEngine);
        }
    }
});
/// <reference path="../typings/Compress.d.ts" />
/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="../node_modules/angular2/core.d.ts" />
/// <reference path="../node_modules/angular2/http.d.ts" />
System.register("main", ['angular2/platform/browser', "layout/Layout", 'angular2/http', "game/SonicEngine"], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var browser_1, Layout_1, http_2, SonicEngine_2;
    var Main;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (Layout_1_1) {
                Layout_1 = Layout_1_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            },
            function (SonicEngine_2_1) {
                SonicEngine_2 = SonicEngine_2_1;
            }],
        execute: function() {
            Main = (function () {
                function Main() {
                }
                Main.run = function () {
                    new SonicEngine_2.SonicEngine();
                    browser_1.bootstrap(Layout_1.Layout, [http_2.HTTP_PROVIDERS]);
                };
                return Main;
            }());
            exports_44("Main", Main);
            Main.run();
        }
    }
});
