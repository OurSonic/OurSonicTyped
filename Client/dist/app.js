var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("SLData", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SLData, AnimatedPaletteItem, AnimatedPalettePiece, SLDataRingEntry, SLDataCNZBumperEntry, Solidity, SLDataChunkBlock, SLDataObjectEntry, SLDataStartPositionEntry, SLDataAnimation, SLDataAnimationFrame, SLDataPatternIndex, ObjectModelData;
    return {
        setters:[],
        execute: function() {
            SLData = (function () {
                function SLData() {
                }
                return SLData;
            }());
            exports_1("SLData", SLData);
            AnimatedPaletteItem = (function () {
                function AnimatedPaletteItem() {
                }
                return AnimatedPaletteItem;
            }());
            exports_1("AnimatedPaletteItem", AnimatedPaletteItem);
            AnimatedPalettePiece = (function () {
                function AnimatedPalettePiece() {
                }
                return AnimatedPalettePiece;
            }());
            exports_1("AnimatedPalettePiece", AnimatedPalettePiece);
            SLDataRingEntry = (function () {
                function SLDataRingEntry() {
                }
                return SLDataRingEntry;
            }());
            exports_1("SLDataRingEntry", SLDataRingEntry);
            SLDataCNZBumperEntry = (function () {
                function SLDataCNZBumperEntry() {
                }
                return SLDataCNZBumperEntry;
            }());
            exports_1("SLDataCNZBumperEntry", SLDataCNZBumperEntry);
            (function (Solidity) {
                Solidity[Solidity["NotSolid"] = 0] = "NotSolid";
                Solidity[Solidity["TopSolid"] = 1] = "TopSolid";
                Solidity[Solidity["LRBSolid"] = 2] = "LRBSolid";
                Solidity[Solidity["AllSolid"] = 3] = "AllSolid";
            })(Solidity || (Solidity = {}));
            exports_1("Solidity", Solidity);
            SLDataChunkBlock = (function () {
                function SLDataChunkBlock() {
                }
                return SLDataChunkBlock;
            }());
            exports_1("SLDataChunkBlock", SLDataChunkBlock);
            SLDataObjectEntry = (function () {
                function SLDataObjectEntry() {
                }
                return SLDataObjectEntry;
            }());
            exports_1("SLDataObjectEntry", SLDataObjectEntry);
            SLDataStartPositionEntry = (function () {
                function SLDataStartPositionEntry() {
                }
                return SLDataStartPositionEntry;
            }());
            exports_1("SLDataStartPositionEntry", SLDataStartPositionEntry);
            SLDataAnimation = (function () {
                function SLDataAnimation() {
                }
                return SLDataAnimation;
            }());
            exports_1("SLDataAnimation", SLDataAnimation);
            SLDataAnimationFrame = (function () {
                function SLDataAnimationFrame() {
                }
                return SLDataAnimationFrame;
            }());
            exports_1("SLDataAnimationFrame", SLDataAnimationFrame);
            SLDataPatternIndex = (function () {
                function SLDataPatternIndex() {
                }
                return SLDataPatternIndex;
            }());
            exports_1("SLDataPatternIndex", SLDataPatternIndex);
            ObjectModelData = (function () {
                function ObjectModelData() {
                }
                return ObjectModelData;
            }());
            exports_1("ObjectModelData", ObjectModelData);
        }
    }
});
///<reference path="../../typings/jQuery.d.ts"/>
System.register("Common/CanvasInformation", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var CanvasInformation;
    return {
        setters:[],
        execute: function() {
            CanvasInformation = (function () {
                function CanvasInformation(context, domCanvas) {
                    this.Context = context;
                    this.DomCanvas = domCanvas;
                    this.Canvas = domCanvas[0];
                }
                Object.defineProperty(CanvasInformation, "BlackPixel", {
                    get: function () {
                        if (CanvasInformation.blackPixel == null) {
                            var m = CanvasInformation.Create(0, 0, false);
                            m.Context.fillStyle = "black";
                            m.Context.fillRect(0, 0, 1, 1);
                            CanvasInformation.blackPixel = m.Canvas;
                        }
                        return CanvasInformation.blackPixel;
                    },
                    enumerable: true,
                    configurable: true
                });
                CanvasInformation.Create = function (w, h, pixelated) {
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
                        ctx.imageSmoothingEnabled = false;
                    }
                    return new CanvasInformation(ctx, $(canvas));
                };
                return CanvasInformation;
            }());
            exports_2("CanvasInformation", CanvasInformation);
        }
    }
});
System.register("Common/Utils", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Point, DoublePoint, IntersectingRectangle, Rectangle;
    return {
        setters:[],
        execute: function() {
            Point = (function () {
                function Point(x, y) {
                    this.X = x;
                    this.Y = y;
                }
                Object.defineProperty(Point.prototype, "X", {
                    get: function () {
                        return this._x | 0;
                    },
                    set: function (val) {
                        this._x = val | 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Point.prototype, "Y", {
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
                    return new Point(pos.X, pos.Y);
                };
                Point.prototype.Offset = function (windowLocation) {
                    return new Point(this.X + windowLocation.X, this.Y + windowLocation.Y);
                };
                Point.prototype.NegatePoint = function (windowLocation) {
                    return new Point(this.X - windowLocation.X, this.Y - windowLocation.Y);
                };
                Point.prototype.Negate = function (x, y) {
                    return new Point(this.X - (x | 0), this.Y - (y | 0));
                };
                Point.prototype.Set = function (x, y) {
                    this.X = x;
                    this.Y = y;
                };
                return Point;
            }());
            exports_3("Point", Point);
            DoublePoint = (function () {
                function DoublePoint(x, y) {
                    this.X = x;
                    this.Y = y;
                }
                DoublePoint.create = function (pos) {
                    return new DoublePoint(pos.X, pos.Y);
                };
                DoublePoint.prototype.Offset = function (windowLocation) {
                    return new DoublePoint(this.X + windowLocation.X, this.Y + windowLocation.Y);
                };
                DoublePoint.prototype.NegatePoint = function (windowLocation) {
                    return new DoublePoint(this.X - windowLocation.X, this.Y - windowLocation.Y);
                };
                DoublePoint.prototype.Negate = function (x, y) {
                    return new DoublePoint(this.X - (x | 0), this.Y - (y | 0));
                };
                DoublePoint.prototype.et = function (x, y) {
                    this.X = x;
                    this.Y = y;
                };
                return DoublePoint;
            }());
            exports_3("DoublePoint", DoublePoint);
            IntersectingRectangle = (function () {
                function IntersectingRectangle(x, y, width, height) {
                    this.X = x;
                    this.Y = y;
                    this.Width = width;
                    this.Height = height;
                }
                IntersectingRectangle.prototype.Intersects = function (p) {
                    return this.X < p.X && this.X + this.Width > p.X && this.Y < p.Y && this.Y + this.Height > p.Y;
                };
                IntersectingRectangle.IntersectsRect = function (r, p) {
                    return r.X < p.X && r.X + r.Width > p.X && r.Y < p.Y && r.Y + r.Height > p.Y;
                };
                IntersectingRectangle.IntersectRect = function (r1, r2) {
                    return !(r2.X > r1.X + r1.Width || r2.X + 0 < r1.X || r2.Y > r1.Y + r1.Height || r2.Y + 0 < r1.Y);
                };
                return IntersectingRectangle;
            }());
            exports_3("IntersectingRectangle", IntersectingRectangle);
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
            exports_3("Rectangle", Rectangle);
        }
    }
});
System.register("Game/Level/SonicImage", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("SonicImage", SonicImage);
        }
    }
});
System.register("Common/Enums", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var GameState, ClickState, ChunkLayerState, RotationMode;
    return {
        setters:[],
        execute: function() {
            (function (GameState) {
                GameState[GameState["Playing"] = 0] = "Playing";
                GameState[GameState["Editing"] = 1] = "Editing";
            })(GameState || (GameState = {}));
            exports_5("GameState", GameState);
            (function (ClickState) {
                ClickState[ClickState["Dragging"] = 0] = "Dragging";
                ClickState[ClickState["PlaceChunk"] = 1] = "PlaceChunk";
                ClickState[ClickState["PlaceRing"] = 2] = "PlaceRing";
                ClickState[ClickState["PlaceObject"] = 3] = "PlaceObject";
            })(ClickState || (ClickState = {}));
            exports_5("ClickState", ClickState);
            (function (ChunkLayerState) {
                ChunkLayerState[ChunkLayerState["Low"] = 0] = "Low";
                ChunkLayerState[ChunkLayerState["High"] = 1] = "High";
            })(ChunkLayerState || (ChunkLayerState = {}));
            exports_5("ChunkLayerState", ChunkLayerState);
            (function (RotationMode) {
                RotationMode[RotationMode["Floor"] = 134] = "Floor";
                RotationMode[RotationMode["RightWall"] = 224] = "RightWall";
                RotationMode[RotationMode["Ceiling"] = 314] = "Ceiling";
                RotationMode[RotationMode["LeftWall"] = 44] = "LeftWall";
            })(RotationMode || (RotationMode = {}));
            exports_5("RotationMode", RotationMode);
        }
    }
});
System.register("Common/Color", [], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
            exports_6("Color", Color);
        }
    }
});
System.register("Common/Help", ["Common/Utils", "Common/CanvasInformation", "Common/Color", "Common/Enums", "Game/SonicManager"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
                Help.ToPx = function (number) {
                    return number + "px";
                };
                Help.Sin = function (f) {
                    return Help.cos_table[(f + 0x40) & 0xFF];
                };
                Help.Cos = function (f) {
                    return Help.cos_table[(f) & 0xFF];
                };
                Help.Mod = function (j, n) {
                    return ((j % n) + n) % n;
                };
                Help.ScaleSprite = function (image, scale) {
                    var canv = CanvasInformation_1.CanvasInformation.Create(image.width * scale.X, image.height * scale.Y, true);
                    canv.Context.save();
                    canv.Context.scale(scale.X, scale.Y);
                    canv.Context.drawImage(image, 0, 0);
                    canv.Context.restore();
                    return canv;
                };
                Help.ScalePixelData = function (scale, data) {
                    var Uint8ClampedArray = data.data;
                    var colors = new Array(Uint8ClampedArray.length / 4 | 0);
                    for (var f = 0; f < Uint8ClampedArray.length; f += 4) {
                        colors[f / 4 | 0] = (Help.ColorObjectFromData(Uint8ClampedArray, f));
                    }
                    var d = CanvasInformation_1.CanvasInformation.Create(1, 1, false).Context.createImageData(data.width * scale.X, data.height * scale.Y);
                    Help.SetDataFromColors(d.data, colors, scale, data.width, colors[0]);
                    return d;
                };
                Help.SetDataFromColors = function (data, colors, scale, width, transparent) {
                    for (var i = 0; i < colors.length; i++) {
                        var curX = i % width;
                        var curY = i / width | 0;
                        var g = colors[i];
                        var isTrans = false;
                        if (transparent) {
                            if (g.R == transparent.R && g.G == transparent.G && g.B == transparent.B)
                                isTrans = true;
                        }
                        for (var j = 0; j < scale.X; j++) {
                            for (var k = 0; k < scale.Y; k++) {
                                var x = (curX * scale.X + j);
                                var y = (curY * scale.Y + k);
                                var c = (x + y * (scale.X * width)) * 4;
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
                Help.GetBase64Image = function (data) {
                    var canvas = document.createElement("canvas");
                    canvas.width = data.width;
                    canvas.height = data.height;
                    var ctx = canvas.getContext("2d");
                    ctx.putImageData(data, 0, 0);
                    var dataURL = canvas.toDataURL("image/png");
                    return dataURL;
                };
                Help.ColorObjectFromData = function (data, c) {
                    var r = data[c];
                    var g = data[c + 1];
                    var b = data[c + 2];
                    var a = data[c + 3];
                    return new Color_1.Color(r, g, b, a);
                };
                Help.GetImageData = function (image) {
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    var data = ctx.getImageData(0, 0, image.width, image.height);
                    return data;
                };
                Help.ScaleCsImage = function (image, scale, complete) {
                    var df = image.Bytes;
                    var colors = new Array(df.length);
                    for (var f = 0; f < df.length; f++) {
                        var c = image.Palette[df[f]];
                        colors[f] = new Color_1.Color(c[0], c[1], c[2], c[3]);
                    }
                    var dc = CanvasInformation_1.CanvasInformation.Create(1, 1, false);
                    var d = dc.Context.createImageData(image.Width * scale.X, image.Height * scale.Y);
                    Help.SetDataFromColors(d.data, colors, scale, image.Width, colors[0]);
                    return Help.LoadSprite(Help.GetBase64Image(d), complete);
                };
                Help.IsLoaded = function (element) {
                    return element.getAttribute("loaded") == "true";
                };
                Help.Loaded = function (element, set) {
                    element.setAttribute("loaded", set ? "true" : "false");
                };
                Help.LoadSprite = function (src, complete) {
                    var sprite1 = new Image();
                    sprite1.addEventListener("load", function (e) {
                        Help.Loaded(sprite1, true);
                        if (complete)
                            complete(sprite1);
                    }, false);
                    sprite1.src = src;
                    return sprite1;
                };
                Help.DecodeString = function (lvl) {
                    return new Compressor().DecompressText(lvl);
                };
                Help.FixAngle = function (angle) {
                    var fixedAng = Math.floor((256 - angle) * 1.4062) % 360 | 0;
                    var flop = 360 - fixedAng;
                    return Help.DegToRad(flop);
                };
                Help.DegToRad = function (angle) {
                    return angle * Math.PI / 180;
                };
                Help.Sign = function (m) {
                    return m == 0 ? 0 : (m < 0 ? -1 : 1);
                };
                Help.Floor = function (spinDashSpeed) {
                    if (spinDashSpeed > 0)
                        return ~~spinDashSpeed;
                    return Math.floor(spinDashSpeed) | 0;
                };
                Help.Max = function (f1, f2) {
                    return f1 < f2 ? f2 : f1;
                };
                Help.Min = function (f1, f2) {
                    return f1 > f2 ? f2 : f1;
                };
                Help.Clone = function (o) {
                    return null;
                };
                Help.RoundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
                    if (radius === void 0) { radius = 5; }
                    if (fill === void 0) { fill = true; }
                    if (stroke === void 0) { stroke = false; }
                    ctx.save();
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + width, y);
                    ctx.lineTo(x + width, y + height);
                    ctx.lineTo(x, y + height);
                    ctx.lineTo(x, y + radius);
                    ctx.quadraticCurveTo(x, y, x + radius, y);
                    ctx.closePath();
                    if (stroke)
                        ctx.stroke();
                    if (fill)
                        ctx.fill();
                    ctx.restore();
                };
                Help.GetCursorPosition = function (ev) {
                    if (ev.originalEvent && ev.originalEvent.targetTouches && ev.originalEvent.targetTouches.length > 0)
                        ev = ev.originalEvent.targetTouches[0];
                    if (ev.pageX && ev.pageY)
                        return new Utils_1.Point(ev.pageX, ev.pageY);
                    return new Utils_1.Point(ev.clientX, ev.clientY /*, 0, ev.Which == 3*/);
                };
                Help.Stringify = function (obj) {
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
                Help.SafeResize = function (block, width, height) {
                    var m = CanvasInformation_1.CanvasInformation.Create(width, height, false);
                    m.Context.drawImage(block.Canvas, 0, 0);
                    return m;
                };
                Help.GetQueryString = function () {
                    var result = {};
                    var queryString = window.location.search.substring(1);
                    var re = new RegExp("/([^&=]+)=([^&]*)/g");
                    var m;
                    while ((m = re.exec(queryString)) != null) {
                        result[window.decodeURIComponent(m[1])] = window.decodeURIComponent(m[2]);
                    }
                    return result;
                };
                Help.Merge = function (base, update) {
                    for (var i in update) {
                        base[i] = update[i];
                    }
                    return base;
                };
                Help.DefaultWindowLocation = function (gameState, scale) {
                    switch (gameState) {
                        case Enums_1.GameState.Playing:
                            return new Utils_1.IntersectingRectangle(0, 0, 320, 224);
                        case Enums_1.GameState.Editing:
                            var x = 0;
                            var y = 0;
                            if (SonicManager_1.SonicManager.Instance.SonicLevel && SonicManager_1.SonicManager.Instance.SonicLevel.StartPositions && SonicManager_1.SonicManager.Instance.SonicLevel.StartPositions[0]) {
                                x = SonicManager_1.SonicManager.Instance.SonicLevel.StartPositions[0].X - 128 * scale.X;
                                y = SonicManager_1.SonicManager.Instance.SonicLevel.StartPositions[0].Y - 128 * scale.Y;
                            }
                            return new Utils_1.IntersectingRectangle(x, y, window.innerWidth, window.innerHeight);
                    }
                    return null;
                };
                Help.cos_table = new Array(1.00000, 0.99970, 0.99880, 0.99729, 0.99518, 0.99248, 0.98918, 0.98528, 0.98079, 0.97570, 0.97003, 0.96378, 0.95694, 0.94953, 0.94154, 0.93299, 0.92388, 0.91421, 0.90399, 0.89322, 0.88192, 0.87009, 0.85773, 0.84485, 0.83147, 0.81758, 0.80321, 0.78835, 0.77301, 0.75721, 0.74095, 0.72425, 0.70711, 0.68954, 0.67156, 0.65317, 0.63439, 0.61523, 0.59570, 0.57581, 0.55557, 0.53500, 0.51410, 0.49290, 0.47140, 0.44961, 0.42755, 0.40524, 0.38268, 0.35990, 0.33689, 0.31368, 0.29028, 0.26671, 0.24298, 0.21910, 0.19509, 0.17096, 0.14673, 0.12241, 0.09802, 0.07356, 0.04907, 0.02454, 0.00000, -0.02454, -0.04907, -0.07356, -0.09802, -0.12241, -0.14673, -0.17096, -0.19509, -0.21910, -0.24298, -0.26671, -0.29028, -0.31368, -0.33689, -0.35990, -0.38268, -0.40524, -0.42755, -0.44961, -0.47140, -0.49290, -0.51410, -0.53500, -0.55557, -0.57581, -0.59570, -0.61523, -0.63439, -0.65317, -0.67156, -0.68954, -0.70711, -0.72425, -0.74095, -0.75721, -0.77301, -0.78835, -0.80321, -0.81758, -0.83147, -0.84485, -0.85773, -0.87009, -0.88192, -0.89322, -0.90399, -0.91421, -0.92388, -0.93299, -0.94154, -0.94953, -0.95694, -0.96378, -0.97003, -0.97570, -0.98079, -0.98528, -0.98918, -0.99248, -0.99518, -0.99729, -0.99880, -0.99970, -1.00000, -0.99970, -0.99880, -0.99729, -0.99518, -0.99248, -0.98918, -0.98528, -0.98079, -0.97570, -0.97003, -0.96378, -0.95694, -0.94953, -0.94154, -0.93299, -0.92388, -0.91421, -0.90399, -0.89322, -0.88192, -0.87009, -0.85773, -0.84485, -0.83147, -0.81758, -0.80321, -0.78835, -0.77301, -0.75721, -0.74095, -0.72425, -0.70711, -0.68954, -0.67156, -0.65317, -0.63439, -0.61523, -0.59570, -0.57581, -0.55557, -0.53500, -0.51410, -0.49290, -0.47140, -0.44961, -0.42756, -0.40524, -0.38268, -0.35990, -0.33689, -0.31368, -0.29028, -0.26671, -0.24298, -0.21910, -0.19509, -0.17096, -0.14673, -0.12241, -0.09802, -0.07356, -0.04907, -0.02454, -0.00000, 0.02454, 0.04907, 0.07356, 0.09802, 0.12241, 0.14673, 0.17096, 0.19509, 0.21910, 0.24298, 0.26671, 0.29028, 0.31368, 0.33689, 0.35990, 0.38268, 0.40524, 0.42756, 0.44961, 0.47140, 0.49290, 0.51410, 0.53500, 0.55557, 0.57581, 0.59570, 0.61523, 0.63439, 0.65317, 0.67156, 0.68954, 0.70711, 0.72425, 0.74095, 0.75721, 0.77301, 0.78835, 0.80321, 0.81758, 0.83147, 0.84485, 0.85773, 0.87009, 0.88192, 0.89322, 0.90399, 0.91421, 0.92388, 0.93299, 0.94154, 0.94953, 0.95694, 0.96378, 0.97003, 0.97570, 0.98079, 0.98528, 0.98918, 0.99248, 0.99518, 0.99729, 0.99880, 0.99970);
                return Help;
            }());
            exports_7("Help", Help);
        }
    }
});
System.register("Game/Level/HeightMap", ["Common/Utils", "Game/SonicManager", "Common/CanvasInformation", "Common/Help", "Common/Enums"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
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
                        pos.X = -pos.X - 16;
                        canvas.scale(-1, 1);
                    }
                    if (yflip) {
                        pos.Y = -pos.Y - 16;
                        canvas.scale(1, -1);
                    }
                    var fd = SonicManager_2.SonicManager.Instance.SpriteCache.HeightMaps[this.Index + (solid << 20)];
                    if (this.Index != -1 && fd)
                        canvas.drawImage(fd.Canvas, pos.X, pos.Y);
                    else {
                        var ntcanvas = CanvasInformation_2.CanvasInformation.Create(16, 16, false);
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
                                            ncanvas.lineTo(16 / 2 - Help_1.Help.Sin(angle) * 8, 16 / 2 - Help_1.Help.Cos(angle) * 8);
                                            ncanvas.stroke();
                                        }
                                    }
                                }
                            }
                        }
                        SonicManager_2.SonicManager.Instance.SpriteCache.HeightMaps[this.Index + (solid << 20)] = ntcanvas;
                        canvas.drawImage(ntcanvas.Canvas, pos.X, pos.Y);
                    }
                    canvas.restore();
                    pos.X = oPos.X;
                    pos.Y = oPos.Y;
                };
                HeightMap.ItemsGood = function (items, x, y) {
                    if (items[x] < 0)
                        return Math.abs(items[x]) >= y;
                    return items[x] >= 16 - y;
                };
                HeightMap.colors = new Array("", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)");
                return HeightMap;
            }());
            exports_8("HeightMap", HeightMap);
        }
    }
});
System.register("Game/Level/Tiles/Tile", ["Common/CanvasInformation", "Common/Utils", "Game/SonicManager"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
                    this.baseCaches = {};
                    this.animatedPaletteCaches = {};
                    this.Colors = colors;
                    this.CurPaletteIndexes = null;
                }
                Tile.prototype.DrawBase = function (canvas, pos, xflip, yflip, palette, isAnimatedTile) {
                    if (isAnimatedTile === void 0) { isAnimatedTile = false; }
                    if (this.AnimatedTileIndexes != null && (!isAnimatedTile && this.AnimatedTileIndexes.length > 0))
                        return;
                    var baseCacheIndex = this.getBaseCacheIndex(xflip, yflip, palette);
                    var baseCache = this.baseCaches[baseCacheIndex];
                    if (baseCache == null) {
                        var squareSize = this.Colors.length;
                        var j = void 0;
                        j = CanvasInformation_3.CanvasInformation.Create(squareSize, squareSize, false);
                        if (pos.X < 0 || pos.Y < 0)
                            return;
                        var oPos = new Utils_3.Point(0, 0);
                        if (xflip) {
                            oPos.X = -squareSize;
                            j.Context.scale(-1, 1);
                        }
                        if (yflip) {
                            oPos.Y = -squareSize;
                            j.Context.scale(1, -1);
                        }
                        var palette_ = SonicManager_3.SonicManager.Instance.SonicLevel.Palette;
                        var colorPaletteIndex = (palette + SonicManager_3.SonicManager.Instance.IndexedPalette) % palette_.length;
                        var x = oPos.X;
                        var y = oPos.Y;
                        for (var _x = 0; _x < squareSize; _x++) {
                            for (var _y = 0; _y < squareSize; _y++) {
                                var colorIndex = this.Colors[_x][_y];
                                if (colorIndex == 0)
                                    continue;
                                j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                                j.Context.fillRect(x + _x, y + _y, 1, 1);
                            }
                        }
                        this.baseCaches[baseCacheIndex] = baseCache = j;
                    }
                    canvas.drawImage(baseCache.Canvas, pos.X, pos.Y);
                };
                Tile.prototype.getBaseCacheIndex = function (xflip, yflip, palette) {
                    return (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                Tile.prototype.getAnimatedPaletteCacheIndex = function (xflip, yflip, palette, animatedPaletteIndex, frameIndex) {
                    return (frameIndex << 8) + (animatedPaletteIndex << 7) + (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                Tile.prototype.DrawAnimatedPalette = function (canvas, pos, xflip, yflip, palette, animatedPaletteIndex, isAnimatedTile) {
                    if (isAnimatedTile === void 0) { isAnimatedTile = false; }
                    if (this.AnimatedTileIndexes != null && (!isAnimatedTile && this.AnimatedTileIndexes.length > 0))
                        return;
                    var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xflip, yflip, palette, animatedPaletteIndex, SonicManager_3.SonicManager.Instance.TilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
                    var animatedPaletteCache = this.animatedPaletteCaches[animatedPaletteCacheIndex];
                    if (animatedPaletteCache == null) {
                        var squareSize = this.Colors.length;
                        var j = void 0;
                        j = CanvasInformation_3.CanvasInformation.Create(squareSize, squareSize, false);
                        if (pos.X < 0 || pos.Y < 0)
                            return;
                        var oPos = new Utils_3.Point(0, 0);
                        if (xflip) {
                            oPos.X = -squareSize;
                            j.Context.scale(-1, 1);
                        }
                        if (yflip) {
                            oPos.Y = -squareSize;
                            j.Context.scale(1, -1);
                        }
                        var palette_ = SonicManager_3.SonicManager.Instance.SonicLevel.Palette;
                        var colorPaletteIndex = (palette + SonicManager_3.SonicManager.Instance.IndexedPalette) % palette_.length;
                        var x = oPos.X;
                        var y = oPos.Y;
                        for (var _x = 0; _x < squareSize; _x++) {
                            for (var _y = 0; _y < squareSize; _y++) {
                                var colorIndex = this.Colors[_x][_y];
                                if (colorIndex == 0)
                                    continue;
                                if (this.PaletteIndexesToBeAnimated[animatedPaletteIndex].indexOf(colorIndex) == -1)
                                    continue;
                                j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                                j.Context.fillRect(x + _x, y + _y, 1, 1);
                            }
                        }
                        this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = j;
                    }
                    canvas.drawImage(animatedPaletteCache.Canvas, pos.X, pos.Y);
                };
                Tile.prototype.DrawAnimatedTile = function (canvas, pos, xflip, yflip, palette, animatedTileIndex) {
                    if (this.AnimatedTileIndexes.indexOf(animatedTileIndex) == -1)
                        return;
                    var tileAnimationFrame = SonicManager_3.SonicManager.Instance.TileAnimationManager.GetCurrentFrame(animatedTileIndex);
                    var tileAnimation = tileAnimationFrame.Animation;
                    var tileAnimationData = tileAnimation.AnimatedTileData;
                    var animationIndex = tileAnimationData.AnimationTileIndex;
                    var frame = tileAnimationFrame.FrameData();
                    if (!frame) {
                        frame = tileAnimation.AnimatedTileData.DataFrames[0];
                    }
                    var file = tileAnimationData.GetAnimationFile();
                    var va = file[frame.StartingTileIndex + (this.Index - animationIndex)];
                    if (va != null) {
                        va.DrawBase(canvas, pos, xflip, yflip, palette, true);
                    }
                    else {
                    }
                };
                Tile.prototype.ShouldTileAnimate = function () {
                    return this.IsTileAnimated && this.canAnimate;
                };
                Tile.prototype.GetAllPaletteIndexes = function () {
                    if (this.CurPaletteIndexes == null) {
                        var d = new Array();
                        for (var _x = 0; _x < this.Colors.length; _x++) {
                            var color = this.Colors[_x];
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
                        this.CurPaletteIndexes = d.slice(0);
                    }
                    return this.CurPaletteIndexes;
                };
                Tile.prototype.ClearCache = function () {
                    this.CurPaletteIndexes = null;
                };
                return Tile;
            }());
            exports_9("Tile", Tile);
        }
    }
});
System.register("Game/Level/Tiles/TileInfo", ["Game/SonicManager"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
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
                }
                TileInfo.prototype.GetTile = function () {
                    return SonicManager_4.SonicManager.Instance.SonicLevel.GetTile(this._Tile);
                };
                return TileInfo;
            }());
            exports_10("TileInfo", TileInfo);
        }
    }
});
System.register("Game/Level/Tiles/TilePiece", ["Common/Utils", "Common/CanvasInformation", "Game/SonicManager"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
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
                    var ac = CanvasInformation_4.CanvasInformation.Create(tilePieceLength * 2, tilePieceLength * 2, false);
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
                                localPoint.X = df[0] * tilePieceLength;
                                localPoint.Y = df[1] * tilePieceLength;
                                tile.DrawBase(ac.Context, localPoint, _xf, _yf, tileItem.Palette);
                            }
                        }
                        i++;
                    }
                    canvas.drawImage(ac.Canvas, position.X, position.Y);
                };
                TilePiece.prototype.getAnimatedPaletteCacheIndex = function (xflip, yflip, animatedPaletteIndex, frameIndex) {
                    return (frameIndex << 8) + (animatedPaletteIndex << 7) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
                };
                TilePiece.prototype.DrawAnimatedPalette = function (canvas, position, layer, xFlip, yFlip, animatedPaletteIndex) {
                    var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xFlip, yFlip, animatedPaletteIndex, SonicManager_5.SonicManager.Instance.TilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
                    var animatedPaletteCache = this.animatedPaletteCaches[animatedPaletteCacheIndex];
                    if (animatedPaletteCache == null) {
                        var drawOrderIndex = 0;
                        drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                        var tilePieceLength = 8;
                        var ac = CanvasInformation_4.CanvasInformation.Create(tilePieceLength * 2, tilePieceLength * 2, false);
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
                                    localPoint.X = df[0] * tilePieceLength;
                                    localPoint.Y = df[1] * tilePieceLength;
                                    tile.DrawAnimatedPalette(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedPaletteIndex);
                                }
                            }
                            i++;
                        }
                        this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = ac;
                    }
                    canvas.drawImage(animatedPaletteCache.Canvas, position.X, position.Y);
                };
                TilePiece.prototype.DrawAnimatedTile = function (canvas, position, layer, xFlip, yFlip, animatedTileIndex) {
                    var drawOrderIndex = 0;
                    drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
                    var tilePieceLength = 8;
                    var ac = CanvasInformation_4.CanvasInformation.Create(tilePieceLength * 2, tilePieceLength * 2, false);
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
                                localPoint.X = df[0] * tilePieceLength;
                                localPoint.Y = df[1] * tilePieceLength;
                                tile.DrawAnimatedTile(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedTileIndex);
                            }
                        }
                        i++;
                    }
                    canvas.drawImage(ac.Canvas, position.X, position.Y);
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
                    return SonicManager_5.SonicManager.Instance.SonicLevel.Angles[SonicManager_5.SonicManager.Instance.SonicLevel.CollisionIndexes1[this.Index]];
                };
                TilePiece.prototype.GetLayer2Angles = function () {
                    return SonicManager_5.SonicManager.Instance.SonicLevel.Angles[SonicManager_5.SonicManager.Instance.SonicLevel.CollisionIndexes2[this.Index]];
                };
                TilePiece.prototype.GetLayer1HeightMaps = function () {
                    return SonicManager_5.SonicManager.Instance.SonicLevel.HeightMaps[SonicManager_5.SonicManager.Instance.SonicLevel.CollisionIndexes1[this.Index]];
                };
                TilePiece.prototype.GetLayer2HeightMaps = function () {
                    return SonicManager_5.SonicManager.Instance.SonicLevel.HeightMaps[SonicManager_5.SonicManager.Instance.SonicLevel.CollisionIndexes2[this.Index]];
                };
                TilePiece.DrawInfo = [[0, 0], [1, 0], [0, 1], [1, 1]];
                TilePiece.DrawOrder = [[3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 1, 2, 3]];
                return TilePiece;
            }());
            exports_11("TilePiece", TilePiece);
        }
    }
});
System.register("Game/Level/Tiles/TilePieceInfo", ["Game/SonicManager"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var SonicManager_6;
    var TilePieceInfo;
    return {
        setters:[
            function (SonicManager_6_1) {
                SonicManager_6 = SonicManager_6_1;
            }],
        execute: function() {
            TilePieceInfo = (function () {
                function TilePieceInfo() {
                }
                TilePieceInfo.prototype.GetTilePiece = function () {
                    return SonicManager_6.SonicManager.Instance.SonicLevel.GetTilePiece(this.Block);
                };
                TilePieceInfo.prototype.SetTilePiece = function (tp) {
                    if (this.Block == tp.Index)
                        return false;
                    this.Block = tp.Index;
                    return true;
                };
                TilePieceInfo.prototype.GetLayer1Angles = function () {
                    return SonicManager_6.SonicManager.Instance.SonicLevel.Angles[SonicManager_6.SonicManager.Instance.SonicLevel.CollisionIndexes1[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer2Angles = function () {
                    return SonicManager_6.SonicManager.Instance.SonicLevel.Angles[SonicManager_6.SonicManager.Instance.SonicLevel.CollisionIndexes2[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer1HeightMaps = function () {
                    return SonicManager_6.SonicManager.Instance.SonicLevel.HeightMaps[SonicManager_6.SonicManager.Instance.SonicLevel.CollisionIndexes1[this.Block]];
                };
                TilePieceInfo.prototype.GetLayer2HeightMaps = function () {
                    return SonicManager_6.SonicManager.Instance.SonicLevel.HeightMaps[SonicManager_6.SonicManager.Instance.SonicLevel.CollisionIndexes2[this.Block]];
                };
                return TilePieceInfo;
            }());
            exports_12("TilePieceInfo", TilePieceInfo);
        }
    }
});
System.register("Game/Level/Animations/TileAnimationData", ["Game/SonicManager"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
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
                }
                TileAnimationData.prototype.GetAnimationFile = function () {
                    return SonicManager_7.SonicManager.Instance.SonicLevel.AnimatedTileFiles[this.AnimationTileFile];
                };
                return TileAnimationData;
            }());
            exports_13("TileAnimationData", TileAnimationData);
            TileAnimationDataFrame = (function () {
                function TileAnimationDataFrame() {
                }
                return TileAnimationDataFrame;
            }());
            exports_13("TileAnimationDataFrame", TileAnimationDataFrame);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectAssetFrame", ["Common/CanvasInformation"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
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
                    mainCanvas.translate(pos.X, pos.Y);
                    mainCanvas.scale((width / this.width) | 0, (height / this.height) | 0);
                    mainCanvas.drawImage(c.Canvas, 0, 0);
                    mainCanvas.restore();
                };
                LevelObjectAssetFrame.prototype.GetCache = function (showOutline, showCollideMap, showHurtMap) {
                    var m = this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)];
                    if (m == null) {
                        var mj = CanvasInformation_5.CanvasInformation.Create(this.width, this.height, false);
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
                    _canvas.translate(pos.X, pos.Y);
                    if (xflip) {
                        if (yflip) {
                            _canvas.translate(fd.Canvas.width / 2, fd.Canvas.height / 2);
                            _canvas.rotate(-90 * Math.PI / 180);
                            _canvas.translate(-fd.Canvas.width / 2, -fd.Canvas.height / 2);
                            _canvas.translate(0, this.height);
                            _canvas.scale(1, -1);
                        }
                        else {
                            _canvas.translate(fd.Canvas.width / 2, fd.Canvas.height / 2);
                            _canvas.rotate(-90 * Math.PI / 180);
                            _canvas.translate(-fd.Canvas.width / 2, -fd.Canvas.height / 2);
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
                    _canvas.drawImage(fd.Canvas, 0, 0);
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
            exports_14("LevelObjectAssetFrame", LevelObjectAssetFrame);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectAsset", [], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
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
            exports_15("LevelObjectAsset", LevelObjectAsset);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectProjectile", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
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
            exports_16("LevelObjectProjectile", LevelObjectProjectile);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectPiece", [], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
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
            exports_17("LevelObjectPiece", LevelObjectPiece);
        }
    }
});
System.register("Game/Level/Objects/LevelObject", ["Game/SonicManager"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
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
                    if ($object.lastDrawTick != SonicManager_8.SonicManager.Instance.tickCount - 1)
                        this.Init($object, level, sonic);
                    $object.lastDrawTick = SonicManager_8.SonicManager.Instance.tickCount;
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
            exports_18("LevelObject", LevelObject);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectPieceLayoutPiece", [], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
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
            exports_19("LevelObjectPieceLayoutPiece", LevelObjectPieceLayoutPiece);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectPieceLayout", ["Game/SonicManager", "Common/Utils"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
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
                    for (var _i = 0, _a = SonicManager_9.SonicManager.Instance.SonicLevel.Objects; _i < _a.length; _i++) {
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
                            drawRadial = SonicManager_9.SonicManager.Instance.mainCanvas.Context.createRadialGradient(0, 0, 0, 10, 10, 50);
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
            exports_20("LevelObjectPieceLayout", LevelObjectPieceLayout);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectData", [], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
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
            exports_21("LevelObjectData", LevelObjectData);
        }
    }
});
System.register("Game/Level/Objects/ObjectManager", ["Common/Help", "Game/Level/Objects/LevelObjectAsset", "Game/Level/Objects/LevelObjectAssetFrame", "Game/Level/Objects/LevelObjectProjectile", "Game/Level/Objects/LevelObject", "Game/Level/Objects/LevelObjectPieceLayout"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
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
                    var obj = Help_2.Help.Merge(new LevelObject_1.LevelObject(d.key), {
                        CollideScript: d.collideScript,
                        HurtScript: d.hurtScript,
                        InitScript: d.initScript,
                        TickScript: d.tickScript
                    });
                    obj.Description = d.description;
                    obj.Assets = new Array();
                    for (var i = 0; i < d.assets.length; i++) {
                        var asset = d.assets[i];
                        var levelObjectAsset = Help_2.Help.Merge(new LevelObjectAsset_1.LevelObjectAsset(asset.name), { name: asset.name });
                        levelObjectAsset.frames = new Array();
                        for (var index = 0; index < asset.frames.length; index++) {
                            var fr = asset.frames[index];
                            levelObjectAsset.frames[index] = Help_2.Help.Merge(new LevelObjectAssetFrame_1.LevelObjectAssetFrame(fr.name), {
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
                        obj.PieceLayouts[index] = Help_2.Help.Merge(new LevelObjectPieceLayout_1.LevelObjectPieceLayout(pl.name), {
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
                        proj = Help_2.Help.Merge(new LevelObjectProjectile_1.LevelObjectProjectile(proj.name), {
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
                ObjectManager.broken = Help_2.Help.LoadSprite("assets/sprites/broken.png", function (e) {
                });
                return ObjectManager;
            }());
            exports_22("ObjectManager", ObjectManager);
        }
    }
});
System.register("Game/Level/Objects/LevelObjectInfo", ["Common/Utils", "Game/SonicManager", "Game/Level/Objects/ObjectManager"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
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
                        this._rect.X = this.X;
                        this._rect.Y = this.Y;
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
                    if (!levelObjectPieceLayout) {
                        //should not happens
                        this.MainPieceLayout();
                        return;
                    }
                    levelObjectPieceLayout.Draw(canvas, x, y, this.ObjectData, this, showHeightMap);
                    if (this.ConsoleLog != null) {
                        var gr = this.GetRect();
                        canvas.save();
                        canvas.fillStyle = "rgba(228,228,12,0.4)";
                        var wd = 1;
                        canvas.fillRect(gr.X - this.X + x - (gr.Width / 2) - wd, gr.Y - this.Y + y - (gr.Height / 2) - wd, gr.Width - (gr.X - this.X) + wd * 2, gr.Height - (gr.Y - this.Y) + wd * 2);
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
                    var mX = ((sonic.X) - this.X) | 0;
                    var mY = ((sonic.Y) - this.Y) | 0;
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
                        return this.ObjectData.OnCollide(this, SonicManager_10.SonicManager.Instance.SonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                LevelObjectInfo.prototype.HurtSonic = function (sonic, sensor, piece) {
                    try {
                        return this.ObjectData.OnHurtSonic(this, SonicManager_10.SonicManager.Instance.SonicLevel, sonic, sensor, piece);
                    }
                    catch (EJ) {
                        this.Log(EJ.Message, 0);
                        return false;
                    }
                };
                return LevelObjectInfo;
            }());
            exports_23("LevelObjectInfo", LevelObjectInfo);
        }
    }
});
System.register("Game/Level/Ring", ["Common/Utils", "Game/SonicManager", "Common/Enums"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
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
                    this.Active = active;
                }
                Ring.prototype.Draw = function (canvas, pos) {
                    if (this.Active) {
                        this.Ysp += 0.09375;
                        this.X += this.Xsp;
                        this.Y += this.Ysp;
                        var wl = SonicManager_11.SonicManager.Instance.windowLocation;
                        if (this.X < wl.X || this.Y < wl.Y || this.X > wl.X + wl.Width || this.Y > wl.Y + wl.Height) {
                            this.TickCount = 0xfffffff;
                            return;
                        }
                        if (SonicManager_11.SonicManager.Instance.DrawTickCount > SonicManager_11.SonicManager.Instance.sonicToon.sonicLastHitTick + 64 && Utils_7.IntersectingRectangle.IntersectsRect(SonicManager_11.SonicManager.Instance.sonicToon.myRec, new Utils_7.Rectangle(this.X - 8, this.Y - 8, 8 * 2, 2 * 8))) {
                            this.TickCount = 0xfffffff;
                            SonicManager_11.SonicManager.Instance.sonicToon.Rings++;
                            return;
                        }
                        this.TickCount++;
                    }
                    if (SonicManager_11.SonicManager.Instance.currentGameState == Enums_3.GameState.Playing)
                        this.AnimationIndex = ((SonicManager_11.SonicManager.Instance.DrawTickCount % ((this.Active ? 4 : 8) * 4)) / (this.Active ? 4 : 8)) | 0;
                    else
                        this.AnimationIndex = 0;
                    var sprites = null;
                    if (SonicManager_11.SonicManager.Instance.SpriteCache.Rings)
                        sprites = SonicManager_11.SonicManager.Instance.SpriteCache.Rings;
                    else
                        throw ("bad ring animation");
                    var sps = sprites[this.AnimationIndex];
                    canvas.drawImage(sps.Canvas, (pos.X - 8), (pos.Y - 8));
                };
                return Ring;
            }(Utils_7.Point));
            exports_24("Ring", Ring);
        }
    }
});
System.register("Game/SonicLevel", [], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var SonicLevel, PaletteItem, PaletteItemPieces;
    return {
        setters:[],
        execute: function() {
            SonicLevel = (function () {
                function SonicLevel() {
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
                SonicLevel.prototype.GetChunkAt = function (x, y) {
                    return this.TileChunks[this.ChunkMap[x][y]];
                };
                SonicLevel.prototype.ClearCache = function () {
                    for (var _i = 0, _a = this.Tiles; _i < _a.length; _i++) {
                        var tile = _a[_i];
                        tile.ClearCache();
                    }
                    for (var _b = 0, _c = this.TileChunks; _b < _c.length; _b++) {
                        var chunk = _c[_b];
                        chunk.ClearCache();
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
            exports_25("SonicLevel", SonicLevel);
            PaletteItem = (function () {
                function PaletteItem() {
                }
                return PaletteItem;
            }());
            exports_25("PaletteItem", PaletteItem);
            PaletteItemPieces = (function () {
                function PaletteItemPieces() {
                }
                return PaletteItemPieces;
            }());
            exports_25("PaletteItemPieces", PaletteItemPieces);
        }
    }
});
System.register("Game/Level/Tiles/TilePaletteAnimationManager", [], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
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
                    for (var animatedPaletteIndex = 0; animatedPaletteIndex < this.SonicManager.SonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                        this.Animations[animatedPaletteIndex] = new TilePaletteAnimation(this, this.SonicManager.SonicLevel.AnimatedPalettes[animatedPaletteIndex]);
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
                TilePaletteAnimationManager.prototype.GetCurrentFrame = function (paletteAnimationIndex) {
                    return this.Animations[paletteAnimationIndex].GetCurrentFrame();
                };
                TilePaletteAnimationManager.prototype.GetPaletteAnimation = function (paletteAnimationIndex) {
                    return this.Animations[paletteAnimationIndex];
                };
                return TilePaletteAnimationManager;
            }());
            exports_26("TilePaletteAnimationManager", TilePaletteAnimationManager);
            TilePaletteAnimation = (function () {
                function TilePaletteAnimation(manager, animatedPaletteData) {
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
                        if (this.Manager.SonicManager.DrawTickCount % (pal.TotalLength + pal.SkipIndex) == j) {
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
            exports_26("TilePaletteAnimation", TilePaletteAnimation);
            TilePaletteAnimationFrame = (function () {
                function TilePaletteAnimationFrame(frameIndex, animation) {
                    this.Animation = animation;
                    this.FrameIndex = frameIndex;
                }
                TilePaletteAnimationFrame.prototype.SetPalette = function () {
                    var levelPalette = this.Animation.Manager.SonicManager.SonicLevel.Palette;
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
                    this.Animation.Manager.SonicManager.SonicLevel.Palette = this.tempPalette;
                    this.tempPalette = null;
                };
                return TilePaletteAnimationFrame;
            }());
            exports_26("TilePaletteAnimationFrame", TilePaletteAnimationFrame);
        }
    }
});
System.register("Game/Level/Tiles/TileAnimationManager", ["Game/SonicManager"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
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
                    for (var animatedTileIndex = 0; animatedTileIndex < this.SonicManager.SonicLevel.TileAnimations.length; animatedTileIndex++) {
                        this.Animations[animatedTileIndex] = new TileAnimation(this, this.SonicManager.SonicLevel.TileAnimations[animatedTileIndex]);
                        this.Animations[animatedTileIndex].Init();
                    }
                };
                TileAnimationManager.prototype.TickAnimatedTiles = function () {
                    if (this.Animations == null)
                        this.Init();
                    for (var animation in this.Animations) {
                        if (this.Animations.hasOwnProperty(animation)) {
                            var tilePaletteAnimation = this.Animations[animation];
                            tilePaletteAnimation.Tick();
                        }
                    }
                };
                TileAnimationManager.prototype.ClearCache = function () {
                    this.Animations = null;
                };
                TileAnimationManager.prototype.GetCurrentFrame = function (tileAnimationIndex) {
                    return this.Animations[tileAnimationIndex].GetCurrentFrame();
                };
                return TileAnimationManager;
            }());
            exports_27("TileAnimationManager", TileAnimationManager);
            TileAnimation = (function () {
                function TileAnimation(manager, animatedTileData) {
                    this.Manager = manager;
                    this.AnimatedTileData = animatedTileData;
                    this.Frames = new Array();
                    this.CurrentFrame = 0;
                }
                TileAnimation.prototype.GetCurrentFrame = function () {
                    return this.Frames[this.CurrentFrame];
                };
                TileAnimation.prototype.Tick = function () {
                    var anni = this.AnimatedTileData;
                    if (anni.LastAnimatedFrame == null) {
                        anni.LastAnimatedFrame = 0;
                        anni.LastAnimatedIndex = 0;
                    }
                    if (anni.DataFrames[anni.LastAnimatedIndex].Ticks == 0 || (SonicManager_12.SonicManager.Instance.DrawTickCount - anni.LastAnimatedFrame) >= ((anni.AutomatedTiming > 0) ? anni.AutomatedTiming : anni.DataFrames[anni.LastAnimatedIndex].Ticks)) {
                        anni.LastAnimatedFrame = SonicManager_12.SonicManager.Instance.DrawTickCount;
                        anni.LastAnimatedIndex = (anni.LastAnimatedIndex + 1) % anni.DataFrames.length;
                        this.CurrentFrame = anni.LastAnimatedIndex;
                    }
                };
                TileAnimation.prototype.Init = function () {
                    for (var index = 0; index < this.AnimatedTileData.DataFrames.length; index++) {
                        this.Frames[index] = new TileAnimationFrame(index, this);
                    }
                };
                return TileAnimation;
            }());
            exports_27("TileAnimation", TileAnimation);
            TileAnimationFrame = (function () {
                function TileAnimationFrame(frameIndex, animation) {
                    this.Animation = animation;
                    this.FrameIndex = frameIndex;
                }
                TileAnimationFrame.prototype.FrameData = function () {
                    return this.Animation.AnimatedTileData.DataFrames[this.FrameIndex];
                };
                return TileAnimationFrame;
            }());
            exports_27("TileAnimationFrame", TileAnimationFrame);
        }
    }
});
System.register("Game/Level/Tiles/TileChunk", ["Common/Utils", "Game/SonicManager", "Common/CanvasInformation", "Common/Enums"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
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
                        this.ClearCache();
                };
                TileChunk.prototype.GetTilePieceInfo = function (x, y, large) {
                    if (large) {
                        return this.TilePieces[(x / TileChunk.TilePiecesSquareSize) | 0][(y / TileChunk.TilePiecesSquareSize) | 0];
                    }
                    else {
                        return this.TilePieces[x][y];
                    }
                };
                TileChunk.prototype.OnlyBackground = function () {
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
                TileChunk.prototype.IsEmpty = function () {
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
                //todo look at this
                TileChunk.prototype.EachPiece = function () {
                    var __result = new Array();
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
                TileChunk.prototype.HasPixelAnimations = function () {
                    return this.GetAllPaletteAnimationIndexes().length > 0;
                };
                TileChunk.prototype.HasTileAnimations = function () {
                    return this.GetAllTileAnimationIndexes().length > 0;
                };
                TileChunk.prototype.GetAllPaletteAnimationIndexes = function () {
                    if (this.paletteAnimationIndexes == null) {
                        this.paletteAnimationIndexes = new Array();
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
                TileChunk.prototype.GetAllTileAnimationIndexes = function () {
                    if (this.tileAnimationIndexes == null) {
                        this.tileAnimationIndexes = new Array();
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            for (var _b = 0, _c = tilePiece.Tiles; _b < _c.length; _b++) {
                                var tileInfo = _c[_b];
                                var tile = tileInfo.GetTile();
                                if (tile == null)
                                    continue;
                                if (tile.AnimatedTileIndexes == null)
                                    continue;
                                for (var _d = 0, _e = tile.AnimatedTileIndexes; _d < _e.length; _d++) {
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
                TileChunk.prototype.NeverAnimates = function () {
                    return !(this.HasTileAnimations() || this.HasPixelAnimations());
                };
                TileChunk.prototype.Draw = function (canvas, position, layer) {
                    canvas.save();
                    {
                        canvas.drawImage(this.BaseCanvasCache[layer].Canvas, position.X, position.Y);
                        if (this.HasPixelAnimations()) {
                            var paletteAnimationCanvases = this.PaletteAnimationCanvasesCache[layer];
                            for (var _i = 0, _a = this.GetAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                                var paletteAnimationIndex = _a[_i];
                                var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                                if (paletteAnimationCanvasFrames == null)
                                    continue;
                                var currentFrame = SonicManager_13.SonicManager.Instance.TilePaletteAnimationManager.GetCurrentFrame(paletteAnimationIndex);
                                this.CurrentPaletteAnimationFrameIndexCache[paletteAnimationIndex] = currentFrame.FrameIndex;
                                var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.Frames[currentFrame.FrameIndex];
                                var canvasLayerToDraw = paletteAnimationCanvasFrame.Canvas.Canvas;
                                canvas.drawImage(canvasLayerToDraw, position.X + paletteAnimationCanvasFrames.Position.X, position.Y + paletteAnimationCanvasFrames.Position.Y);
                            }
                        }
                        if (this.HasTileAnimations()) {
                            var tileAnimationCanvases = this.TileAnimationCanvasesCache[layer];
                            for (var _b = 0, _c = this.GetAllTileAnimationIndexes(); _b < _c.length; _b++) {
                                var tileAnimationIndex = _c[_b];
                                var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                                if (tileAnimationCanvasFrames == null)
                                    continue;
                                var currentFrame = SonicManager_13.SonicManager.Instance.TileAnimationManager.GetCurrentFrame(tileAnimationIndex);
                                this.CurrentTileAnimationFrameIndexCache[tileAnimationIndex] = currentFrame.FrameIndex;
                                var tileAnimationCanvasFrame = tileAnimationCanvasFrames.Frames[currentFrame.FrameIndex];
                                var canvasLayerToDraw = tileAnimationCanvasFrame.Canvas.Canvas;
                                canvas.drawImage(canvasLayerToDraw, position.X + tileAnimationCanvasFrames.Position.X, position.Y + tileAnimationCanvasFrames.Position.Y);
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
                            this.myLocalPoint.X = pieceX * piecesSquareSize;
                            this.myLocalPoint.Y = pieceY * piecesSquareSize;
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
                            this.myLocalPoint.X = pieceX * piecesSquareSize;
                            this.myLocalPoint.Y = pieceY * piecesSquareSize;
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
                            this.myLocalPoint.X = pieceX * piecesSquareSize;
                            this.myLocalPoint.Y = pieceY * piecesSquareSize;
                            piece.DrawBase(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip);
                        }
                    }
                };
                /*cache */
                TileChunk.prototype.ClearCache = function () {
                };
                TileChunk.prototype.InitCache = function () {
                    this.BaseCanvasCache = new ChunkLayer();
                    this.PaletteAnimationCanvasesCache = new ChunkLayer();
                    this.TileAnimationCanvasesCache = new ChunkLayer();
                    this.TileAnimationCanvasesCache[Enums_4.ChunkLayerState.Low] = {};
                    this.TileAnimationCanvasesCache[Enums_4.ChunkLayerState.High] = {};
                    this.PaletteAnimationCanvasesCache[Enums_4.ChunkLayerState.Low] = {};
                    this.PaletteAnimationCanvasesCache[Enums_4.ChunkLayerState.High] = {};
                    this.CurrentTileAnimationFrameIndexCache = new Array();
                    this.CurrentPaletteAnimationFrameIndexCache = new Array();
                };
                TileChunk.prototype.WarmCache = function () {
                    this.CacheBase(Enums_4.ChunkLayerState.Low);
                    this.CacheBase(Enums_4.ChunkLayerState.High);
                    if (this.HasPixelAnimations()) {
                        this.CachePaletteAnimation(Enums_4.ChunkLayerState.Low);
                        this.CachePaletteAnimation(Enums_4.ChunkLayerState.High);
                    }
                    if (this.HasTileAnimations()) {
                        this.CacheTileAnimation(Enums_4.ChunkLayerState.Low);
                        this.CacheTileAnimation(Enums_4.ChunkLayerState.High);
                    }
                };
                TileChunk.prototype.CacheBase = function (layer) {
                    if (layer == Enums_4.ChunkLayerState.Low ? (this.OnlyForeground()) : (this.OnlyBackground()))
                        return;
                    this.BaseCanvasCache[layer] = CanvasInformation_6.CanvasInformation.Create(TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, false);
                    this.drawTilePiecesBase(this.BaseCanvasCache[layer].Context, layer, TileChunk.TilePiecesSquareSize);
                };
                TileChunk.prototype.CachePaletteAnimation = function (layer) {
                    var paletteAnimationCanvases = this.PaletteAnimationCanvasesCache[layer];
                    for (var _i = 0, _a = this.GetAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                        var paletteAnimationIndex = _a[_i];
                        var rect = this.getAnimationPaletteSurfaceInformation(paletteAnimationIndex, layer);
                        if (rect == null) {
                            continue;
                        }
                        var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex] = new PaletteAnimationCanvasFrames(paletteAnimationIndex);
                        var tilePaletteAnimation = SonicManager_13.SonicManager.Instance.TilePaletteAnimationManager.Animations[paletteAnimationIndex];
                        paletteAnimationCanvasFrames.Position = new Utils_8.Point(rect.X * TileChunk.TilePiecesSquareSize, rect.Y * TileChunk.TilePiecesSquareSize);
                        for (var _b = 0, _c = tilePaletteAnimation.Frames; _b < _c.length; _b++) {
                            var currentFrame = _c[_b];
                            tilePaletteAnimation.CurrentFrame = currentFrame.FrameIndex;
                            var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.Frames[currentFrame.FrameIndex] = new PaletteAnimationCanvasFrame();
                            currentFrame.SetPalette();
                            var tilePaletteCanvas = CanvasInformation_6.CanvasInformation.Create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                            paletteAnimationCanvasFrame.Canvas = tilePaletteCanvas;
                            paletteAnimationCanvasFrame.Canvas.Context.save();
                            paletteAnimationCanvasFrame.Canvas.Context.translate(-rect.X * TileChunk.TilePiecesSquareSize, -rect.Y * TileChunk.TilePiecesSquareSize);
                            this.drawTilePiecesAnimatedPalette(tilePaletteCanvas.Context, layer, TileChunk.TilePiecesSquareSize, paletteAnimationIndex);
                            paletteAnimationCanvasFrame.Canvas.Context.restore();
                            currentFrame.ClearPalette();
                        }
                        tilePaletteAnimation.CurrentFrame = 0;
                    }
                };
                TileChunk.prototype.CacheTileAnimation = function (layer) {
                    var tileAnimationCanvases = this.TileAnimationCanvasesCache[layer];
                    for (var _i = 0, _a = this.GetAllTileAnimationIndexes(); _i < _a.length; _i++) {
                        var tileAnimationIndex = _a[_i];
                        var rect = this.getAnimationTileSurfaceInformation(tileAnimationIndex, layer);
                        if (rect == null) {
                            continue;
                        }
                        var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex] = new TileAnimationCanvasFrames(tileAnimationIndex);
                        var tileAnimation = SonicManager_13.SonicManager.Instance.TileAnimationManager.Animations[tileAnimationIndex];
                        tileAnimationCanvasFrames.Position = new Utils_8.Point(rect.X * TileChunk.TilePiecesSquareSize, rect.Y * TileChunk.TilePiecesSquareSize);
                        for (var _b = 0, _c = tileAnimation.Frames; _b < _c.length; _b++) {
                            var currentFrame = _c[_b];
                            var tileAnimationCanvasFrame = tileAnimationCanvasFrames.Frames[currentFrame.FrameIndex] = new TileAnimationCanvasFrame();
                            var tileTileCanvas = CanvasInformation_6.CanvasInformation.Create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                            tileAnimationCanvasFrame.Canvas = tileTileCanvas;
                            tileAnimation.CurrentFrame = currentFrame.FrameIndex;
                            tileAnimationCanvasFrame.Canvas.Context.save();
                            tileAnimationCanvasFrame.Canvas.Context.translate(-rect.X * TileChunk.TilePiecesSquareSize, -rect.Y * TileChunk.TilePiecesSquareSize);
                            this.drawTilePiecesAnimatedTile(tileTileCanvas.Context, layer, TileChunk.TilePiecesSquareSize, tileAnimationIndex);
                            tileAnimationCanvasFrame.Canvas.Context.restore();
                        }
                        tileAnimation.CurrentFrame = 0;
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
                        if (debugDrawOptions.ShowBaseData) {
                            canvas.fillText("Base", position.X + 0, position.Y + yOffset);
                        }
                        if (debugDrawOptions.ShowPaletteAnimationData) {
                            if (this.HasPixelAnimations()) {
                                var paletteAnimationCanvases = this.PaletteAnimationCanvasesCache[layer];
                                for (var _i = 0, _a = this.GetAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                                    var paletteAnimationIndex = _a[_i];
                                    var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                                    if (paletteAnimationCanvasFrames == null)
                                        continue;
                                    var currentFrame = SonicManager_13.SonicManager.Instance.TilePaletteAnimationManager.GetCurrentFrame(paletteAnimationIndex);
                                    canvas.fillText("Palette " + paletteAnimationIndex + "-" + currentFrame.FrameIndex, position.X + 25, position.Y + yOffset + (paletteAnimationIndex * 13));
                                }
                            }
                        }
                        if (debugDrawOptions.ShowTileAnimationData) {
                            if (this.HasTileAnimations()) {
                                var tileAnimationCanvases = this.TileAnimationCanvasesCache[layer];
                                for (var _b = 0, _c = this.GetAllTileAnimationIndexes(); _b < _c.length; _b++) {
                                    var tileAnimationIndex = _c[_b];
                                    var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                                    if (tileAnimationCanvasFrames == null)
                                        continue;
                                    var currentFrame = SonicManager_13.SonicManager.Instance.TileAnimationManager.GetCurrentFrame(tileAnimationIndex);
                                    canvas.fillText("Tile " + tileAnimationIndex + "-" + currentFrame.FrameIndex, position.X + 75, position.Y + yOffset + (tileAnimationIndex * 13));
                                }
                            }
                        }
                    }
                    if (debugDrawOptions.OutlineChunk) {
                        canvas.strokeStyle = "black";
                        canvas.strokeRect(position.X, position.Y, 128, 128);
                    }
                    if (debugDrawOptions.OutlineTiles) {
                        canvas.strokeStyle = "green";
                        for (var x = 0; x < TileChunk.TileSideLength; x++) {
                            for (var y = 0; y < TileChunk.TileSideLength; y++) {
                                canvas.strokeRect(position.X + (x * TileChunk.TileSquareSize), position.Y + (y * TileChunk.TileSquareSize), TileChunk.TileSquareSize, TileChunk.TileSquareSize);
                            }
                        }
                    }
                    if (debugDrawOptions.OutlineTilePieces) {
                        canvas.strokeStyle = "purple";
                        for (var x = 0; x < TileChunk.TilePieceSideLength; x++) {
                            for (var y = 0; y < TileChunk.TilePieceSideLength; y++) {
                                canvas.strokeRect(position.X + (x * TileChunk.TilePiecesSquareSize), position.Y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                            }
                        }
                    }
                    if (debugDrawOptions.OutlineTile != null) {
                    }
                    if (debugDrawOptions.OutlineTilePiece != null) {
                        canvas.strokeStyle = "yellow";
                        for (var x = 0; x < TileChunk.TilePieceSideLength; x++) {
                            for (var y = 0; y < TileChunk.TilePieceSideLength; y++) {
                                var tilePieceInfo = this.GetTilePieceInfo(x, y, false);
                                if (tilePieceInfo == null)
                                    continue;
                                var tilePiece = tilePieceInfo.GetTilePiece();
                                if (tilePiece == null)
                                    continue;
                                if (tilePiece.Index == debugDrawOptions.OutlineTilePiece.Block) {
                                    canvas.strokeRect(position.X + (x * TileChunk.TilePiecesSquareSize), position.Y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
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
                        if (this.BaseCanvasCache[chunkLayer] != null)
                            numOfChunks++;
                        for (var paletteAnimationCanvasCache in this.PaletteAnimationCanvasesCache[chunkLayer]) {
                            for (var frame in this.PaletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache].Frames) {
                                numOfChunks++;
                            }
                        }
                        for (var tileAnimationCanvasCache in this.TileAnimationCanvasesCache[chunkLayer]) {
                            for (var frame in this.TileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache].Frames) {
                                numOfChunks++;
                            }
                        }
                    }
                    var canvas = CanvasInformation_6.CanvasInformation.Create((numWide * 128), (Math.ceil(numOfChunks / numWide) | 0) * 128, false);
                    canvas.Context.fillStyle = "#111111";
                    canvas.Context.fillRect(0, 0, canvas.Canvas.width, canvas.Canvas.height);
                    numOfChunks = 0;
                    canvas.Context.strokeStyle = "#FFFFFF";
                    canvas.Context.lineWidth = 4;
                    for (var i = 0; i < 2; i++) {
                        var chunkLayer = i;
                        canvas.Context.strokeStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "Green" : "Yellow";
                        if (this.BaseCanvasCache[chunkLayer] != null) {
                            var context = canvas.Context;
                            context.save();
                            var x = ((numOfChunks % numWide) * 128) | 0;
                            var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                            context.translate(x, y);
                            canvas.Context.fillStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "#333333" : "#777777";
                            context.fillRect(0, 0, 128, 128);
                            context.drawImage(this.BaseCanvasCache[chunkLayer].Canvas, 0, 0);
                            context.strokeRect(0, 0, 128, 128);
                            context.restore();
                            numOfChunks++;
                        }
                        canvas.Context.strokeStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "pink" : "purple";
                        for (var paletteAnimationCanvasCache in this.PaletteAnimationCanvasesCache[chunkLayer]) {
                            var m = this.PaletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache];
                            for (var f in m.Frames) {
                                var frame = m.Frames[f];
                                var context = canvas.Context;
                                context.save();
                                var x = ((numOfChunks % numWide) * 128) | 0;
                                var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                                context.translate(x, y);
                                canvas.Context.fillStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "#333333" : "#777777";
                                context.fillRect(0, 0, 128, 128);
                                context.drawImage(frame.Canvas.Canvas, m.Position.X, m.Position.Y);
                                context.strokeRect(0, 0, 128, 128);
                                context.restore();
                                numOfChunks++;
                            }
                        }
                        canvas.Context.strokeStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "red" : "orange";
                        for (var tileAnimationCanvasCache in this.TileAnimationCanvasesCache[chunkLayer]) {
                            var m = this.TileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache];
                            for (var f in m.Frames) {
                                var frame = m.Frames[f];
                                var context = canvas.Context;
                                context.save();
                                var x = ((numOfChunks % numWide) * 128) | 0;
                                var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                                context.translate(x, y);
                                canvas.Context.fillStyle = chunkLayer == Enums_4.ChunkLayerState.Low ? "#333333" : "#777777";
                                context.fillRect(0, 0, 128, 128);
                                context.drawImage(frame.Canvas.Canvas, m.Position.Y, m.Position.Y);
                                context.strokeRect(0, 0, 128, 128);
                                context.restore();
                                numOfChunks++;
                            }
                        }
                    }
                    canvas.Context.strokeStyle = "blue";
                    canvas.Context.strokeRect(0, 0, canvas.Canvas.width, canvas.Canvas.height);
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
            exports_28("TileChunk", TileChunk);
            TileChunkDebugDrawOptions = (function () {
                function TileChunkDebugDrawOptions() {
                }
                return TileChunkDebugDrawOptions;
            }());
            exports_28("TileChunkDebugDrawOptions", TileChunkDebugDrawOptions);
            ChunkLayer = (function () {
                function ChunkLayer() {
                }
                return ChunkLayer;
            }());
            exports_28("ChunkLayer", ChunkLayer);
            PaletteAnimationCanvasFrames = (function () {
                function PaletteAnimationCanvasFrames(paletteAnimationIndex) {
                    this.PaletteAnimationIndex = paletteAnimationIndex;
                    this.Frames = {};
                }
                return PaletteAnimationCanvasFrames;
            }());
            exports_28("PaletteAnimationCanvasFrames", PaletteAnimationCanvasFrames);
            PaletteAnimationCanvasFrame = (function () {
                function PaletteAnimationCanvasFrame() {
                }
                return PaletteAnimationCanvasFrame;
            }());
            exports_28("PaletteAnimationCanvasFrame", PaletteAnimationCanvasFrame);
            TileAnimationCanvasFrames = (function () {
                function TileAnimationCanvasFrames(tileAnimationIndex) {
                    this.TileAnimationIndex = tileAnimationIndex;
                    this.Frames = {};
                }
                return TileAnimationCanvasFrames;
            }());
            exports_28("TileAnimationCanvasFrames", TileAnimationCanvasFrames);
            TileAnimationCanvasFrame = (function () {
                function TileAnimationCanvasFrame() {
                }
                return TileAnimationCanvasFrame;
            }());
            exports_28("TileAnimationCanvasFrame", TileAnimationCanvasFrame);
        }
    }
});
System.register("Game/Sonic/SensorManager", ["SLData", "Game/Level/HeightMap", "Common/Help", "Game/SonicManager", "Common/Enums"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var SLData_1, HeightMap_1, Help_3, SonicManager_14, Enums_5;
    var SensorManager, Sensor, SensorM;
    return {
        setters:[
            function (SLData_1_1) {
                SLData_1 = SLData_1_1;
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
                    this.Sensors = {};
                    this.SensorResults = {};
                }
                SensorManager.prototype.AddSensor = function (letter, sensor) {
                    this.Sensors[letter] = (sensor);
                    this.SensorResults[letter] = null;
                    return sensor;
                };
                SensorManager.prototype.CreateVerticalSensor = function (letter, x, y1, y2, color, ignoreSolid) {
                    if (ignoreSolid === void 0) { ignoreSolid = false; }
                    return this.AddSensor(letter, new Sensor(x, x, y1, y2, this, color, ignoreSolid, letter));
                };
                SensorManager.prototype.CreateHorizontalSensor = function (letter, y, x1, x2, color, ignoreSolid) {
                    if (ignoreSolid === void 0) { ignoreSolid = false; }
                    return this.AddSensor(letter, new Sensor(x1, x2, y, y, this, color, ignoreSolid, letter));
                };
                SensorManager.prototype.Check = function (character) {
                    var none = false;
                    for (var i in this.Sensors) {
                        this.SensorResults[i] = this.Sensors[i].Check(character);
                        none = none || (this.SensorResults[i] != null);
                    }
                    return none;
                };
                SensorManager.prototype.GetResult = function (mn) {
                    return this.SensorResults[mn];
                };
                SensorManager.prototype.Draw = function (canvas, sonic) {
                    for (var sensor in this.Sensors) {
                        this.Sensors[sensor].Draw(canvas, sonic, this.SensorResults[sensor]);
                    }
                };
                SensorManager.prototype.BuildChunk = function (chunk, isLayerOne) {
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
                                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = SLData_1.Solidity.NotSolid;
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
            exports_29("SensorManager", SensorManager);
            Sensor = (function () {
                function Sensor(x1, x2, y1, y2, manager, color, ignoreSolid, letter) {
                    this.__currentM = new SensorM(0, 0);
                    this.X1 = x1;
                    this.X2 = x2;
                    this.Y1 = y1;
                    this.Y2 = y2;
                    this.Manager = manager;
                    this.Color = color;
                    this.IgnoreSolid = ignoreSolid;
                    this.Letter = letter;
                }
                Sensor.prototype.checkCollisionLineWrap = function (x1, x2, y1, y2, ignoreSolid) {
                    var _x = (x1 / 128) | 0;
                    var _y = Help_3.Help.Mod((y1 / 128) | 0, SonicManager_14.SonicManager.Instance.SonicLevel.LevelHeight);
                    var tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x, _y);
                    this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                    var curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                    var cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                    var __x = x1 - _x * 128;
                    var __y = y1 - _y * 128;
                    var length = 0;
                    if (y1 == y2) {
                        if (Math.max(x1, x2) > SonicManager_14.SonicManager.Instance.SonicLevel.LevelWidth * 128) {
                            this.__currentM.Value = SonicManager_14.SonicManager.Instance.SonicLevel.LevelWidth * 128 - 20;
                            this.__currentM.Angle = 0xff;
                            return this.__currentM;
                        }
                        if (x1 < x2) {
                            length = x2 - x1;
                            if (curh[(__x)][__y] >= 2) {
                                for (var i = 0; i < 128 * 2; i++) {
                                    while (true) {
                                        if (__x - i < 0) {
                                            if (_x - 1 < 0) {
                                                this.__currentM.Value = 0;
                                                this.__currentM.Angle = 0xFF;
                                                return this.__currentM;
                                            }
                                            tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x - 1, _y);
                                            this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __x += 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[(__x - i)][__y] >= 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.Letter)) {
                                        this.__currentM.Value = x1 - i;
                                        this.__currentM.Angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__x + i >= 128) {
                                        tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x + 1, _y);
                                        this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __x -= 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[(__x + i)][__y] >= 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.Letter)) {
                                    this.__currentM.Value = x1 + i;
                                    this.__currentM.Angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
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
                                            tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x + 1, _y);
                                            this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __x -= 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[(__x + i)][__y] >= 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1 + i, y1, this.Letter)) {
                                        this.__currentM.Value = x1 + i;
                                        this.__currentM.Angle = cura[(__x + i) / 16 | 0][(__y) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__x - i < 0) {
                                        if (_x - 1 < 0) {
                                            this.__currentM.Value = 0;
                                            this.__currentM.Angle = 0xFF;
                                            return this.__currentM;
                                        }
                                        tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x - 1, _y);
                                        this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __x += 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[(__x - i)][__y] >= 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1 - i, y1, this.Letter)) {
                                    this.__currentM.Value = x1 - i;
                                    this.__currentM.Angle = cura[(__x - i) / 16 | 0][(__y) / 16 | 0];
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
                                            tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x, Help_3.Help.Mod((_y - 1), SonicManager_14.SonicManager.Instance.SonicLevel.LevelHeight));
                                            this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __y += 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[__x][__y - i] > 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1, y1 - i, this.Letter)) {
                                        this.__currentM.Value = y1 - i;
                                        this.__currentM.Angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__y + i >= 128) {
                                        tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x, (_y + 1) % SonicManager_14.SonicManager.Instance.SonicLevel.LevelHeight);
                                        this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __y -= 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[__x][__y + i] >= 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.Letter)) {
                                    if (curh[__x][__y + i] == 1 && SonicManager_14.SonicManager.Instance.sonicToon.InAir && SonicManager_14.SonicManager.Instance.sonicToon.Ysp < 0)
                                        continue;
                                    this.__currentM.Value = y1 + i;
                                    this.__currentM.Angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
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
                                            tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x, (_y + 1) % SonicManager_14.SonicManager.Instance.SonicLevel.LevelHeight);
                                            this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                            curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                            cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                            __y -= 128;
                                        }
                                        else
                                            break;
                                    }
                                    if (curh[__x][__y + i] >= 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.Letter)) {
                                        this.__currentM.Value = y1 + i;
                                        this.__currentM.Angle = cura[(__x) / 16 | 0][(__y + i) / 16 | 0];
                                        return this.__currentM;
                                    }
                                }
                            }
                            for (var i = 0; i < length; i++) {
                                while (true) {
                                    if (__y - i < 0) {
                                        tc = SonicManager_14.SonicManager.Instance.SonicLevel.GetChunkAt(_x, Help_3.Help.Mod((_y - 1), SonicManager_14.SonicManager.Instance.SonicLevel.LevelHeight));
                                        this.Manager.BuildChunk(tc, SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap);
                                        curh = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.HeightBlocks1 : tc.HeightBlocks2;
                                        cura = SonicManager_14.SonicManager.Instance.SonicLevel.CurHeightMap ? tc.AngleMap1 : tc.AngleMap2;
                                        __y += 128;
                                    }
                                    else
                                        break;
                                }
                                if (curh[__x][__y - i] > 1 || SonicManager_14.SonicManager.Instance.sonicToon.CheckCollisionWithObjects(x1, y1 + i, this.Letter)) {
                                    this.__currentM.Value = y1 - i;
                                    this.__currentM.Angle = cura[(__x) / 16 | 0][(__y - i) / 16 | 0];
                                    return this.__currentM;
                                }
                            }
                        }
                    }
                    return null;
                };
                Sensor.prototype.Draw = function (canvas, character, sensorResult) {
                    var x = Help_3.Help.Floor(character.X) - SonicManager_14.SonicManager.Instance.windowLocation.X;
                    var y = Help_3.Help.Floor(character.Y) - SonicManager_14.SonicManager.Instance.windowLocation.Y;
                    canvas.beginPath();
                    if (sensorResult && sensorResult.Chosen) {
                        canvas.strokeStyle = "#FFF76D";
                        canvas.lineWidth = 4;
                    }
                    else {
                        canvas.strokeStyle = this.Color;
                        canvas.lineWidth = 2;
                    }
                    switch (character.Mode) {
                        case Enums_5.RotationMode.Floor:
                            canvas.moveTo((x + this.X1), (y + this.Y1));
                            canvas.lineTo((x + this.X2), (y + this.Y2));
                            break;
                        case Enums_5.RotationMode.LeftWall:
                            canvas.moveTo((x - this.Y1), (y + this.X1));
                            canvas.lineTo((x - this.Y2), (y + this.X2));
                            break;
                        case Enums_5.RotationMode.Ceiling:
                            canvas.moveTo((x - this.X1), (y - this.Y1));
                            canvas.lineTo((x - this.X2), (y - this.Y2));
                            break;
                        case Enums_5.RotationMode.RightWall:
                            canvas.moveTo((x + this.Y1), (y - this.X1));
                            canvas.lineTo((x + this.Y2), (y - this.X2));
                            break;
                    }
                    canvas.closePath();
                    canvas.stroke();
                };
                Sensor.prototype.Check = function (character) {
                    var _y2 = character.InAir ? this.Y2 : this.Y2;
                    var m = null;
                    var x = Help_3.Help.Floor(character.X);
                    var y = Help_3.Help.Floor(character.Y);
                    switch (character.Mode) {
                        case Enums_5.RotationMode.Floor:
                            m = this.checkCollisionLineWrap(x + this.X1, x + this.X2, y + this.Y1, y + _y2, this.IgnoreSolid);
                            break;
                        case Enums_5.RotationMode.LeftWall:
                            m = this.checkCollisionLineWrap(x - this.Y1, x - _y2, y + this.X1, y + this.X2, this.IgnoreSolid);
                            break;
                        case Enums_5.RotationMode.Ceiling:
                            m = this.checkCollisionLineWrap(x - this.X1, x - this.X2, y - this.Y1, y - _y2, this.IgnoreSolid);
                            break;
                        case Enums_5.RotationMode.RightWall:
                            m = this.checkCollisionLineWrap(x + this.Y1, x + _y2, y - this.X1, y - this.X2, this.IgnoreSolid);
                            break;
                    }
                    if (m != null) {
                        m.Letter = this.Letter;
                        if (m.Angle == 255 || m.Angle == 0 || m.Angle == 1) {
                            if (character.Mode == Enums_5.RotationMode.Floor)
                                m.Angle = 255;
                            if (character.Mode == Enums_5.RotationMode.LeftWall)
                                m.Angle = 64;
                            if (character.Mode == Enums_5.RotationMode.Ceiling)
                                m.Angle = 128;
                            if (character.Mode == Enums_5.RotationMode.RightWall)
                                m.Angle = 192;
                        }
                    }
                    return m;
                };
                return Sensor;
            }());
            exports_29("Sensor", Sensor);
            SensorM = (function () {
                function SensorM(value, angle) {
                    this.Value = value;
                    this.Angle = angle;
                }
                return SensorM;
            }());
            exports_29("SensorM", SensorM);
        }
    }
});
System.register("Game/Sonic/SonicConstants", ["Common/Help"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
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
                    var sc = Help_4.Help.Merge(new SonicConstants(), {
                        Acc: 0.046875,
                        Dec: 0.5,
                        Slp: 0.125,
                        Frc: 0.046875,
                        Rdec: 0.125,
                        Rfrc: 0.0234375,
                        SlpRollingUp: 0.078125,
                        SlpRollingDown: 0.3125,
                        Jmp: -6.5,
                        Grv: 0.21875,
                        Air: 0.09375,
                        TopSpeed: 6
                    });
                    return sc;
                };
                return SonicConstants;
            }());
            exports_30("SonicConstants", SonicConstants);
        }
    }
});
System.register("Game/Sonic/Sonic", ["Common/Utils", "Game/Sonic/SensorManager", "Common/Enums", "Game/SonicManager", "Common/Help", "Game/Level/Ring", "Game/Sonic/SonicConstants"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
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
                    this.X = 0;
                    this.Y = 0;
                    this.Rings = 0;
                    this.Xsp = 0;
                    this.Ysp = 0;
                    this.Gsp = 0;
                    this.HLock = 0;
                    this.Breaking = 0;
                    this.SpinDashSpeed = 0;
                    this.Angle = 0;
                    this.halfSize = new Utils_9.Point(20, 20);
                    this.offsetFromImage = new Utils_9.Point(0, 0);
                    this.objectCollision = new Utils_9.Point(0, 0);
                    this.ringCollisionRect = new Utils_9.Rectangle(0, 0, 0, 0);
                    this.Watcher = new Watcher();
                    this.physicsVariables = SonicConstants_1.SonicConstants.Sonic();
                    var sonicManager = SonicManager_15.SonicManager.Instance;
                    this.sonicLevel = sonicManager.SonicLevel;
                    this.X = this.sonicLevel.StartPositions[0].X;
                    this.Y = this.sonicLevel.StartPositions[0].Y;
                    this.SensorManager = new SensorManager_1.SensorManager();
                    this.HaltSmoke = new Array();
                    this.Rings = 7;
                    this.SensorManager.CreateVerticalSensor("a", -9, 0, 36, "#F202F2");
                    this.SensorManager.CreateVerticalSensor("b", 9, 0, 36, "#02C2F2");
                    this.SensorManager.CreateVerticalSensor("c", -9, 0, -20, "#2D2C21");
                    this.SensorManager.CreateVerticalSensor("d", 9, 0, -20, "#C24222");
                    this.SensorManager.CreateHorizontalSensor("m1", 4, 0, -12, "#212C2E");
                    this.SensorManager.CreateHorizontalSensor("m2", 4, 0, 13, "#22Ffc1");
                    this.SpriteState = "normal";
                    this.myRec = new Utils_9.Rectangle(0, 0, 0, 0);
                    this.sonicLastHitTick = -100000;
                }
                Sonic.prototype.UpdateMode = function () {
                    if (this.Angle <= 0x22 || this.Angle >= 0xDE)
                        this.Mode = Enums_6.RotationMode.Floor;
                    else if (this.Angle > 0x22 && this.Angle < 0x59)
                        this.Mode = Enums_6.RotationMode.LeftWall;
                    else if (this.Angle >= 0x59 && this.Angle < 0xA1)
                        this.Mode = Enums_6.RotationMode.Ceiling;
                    else if (this.Angle > 0xA1 && this.Angle < 0xDE)
                        this.Mode = Enums_6.RotationMode.RightWall;
                    this.myRec.X = (this.X - 10) | 0;
                    this.myRec.Y = (this.Y - 20) | 0;
                    this.myRec.Width = 10 * 2;
                    this.myRec.Height = 20 * 2;
                    if (this.InAir)
                        this.Mode = Enums_6.RotationMode.Floor;
                };
                Sonic.prototype.Tick = function (sonicLevel) {
                    if (this.Debugging) {
                        var debugSpeed = this.Watcher.Multiply(15);
                        if (this.HoldingRight)
                            this.X += debugSpeed;
                        if (this.HoldingLeft)
                            this.X -= debugSpeed;
                        if (this.Crouching)
                            this.Y += debugSpeed;
                        if (this.HoldingUp)
                            this.Y -= debugSpeed;
                        this.X = ((sonicLevel.LevelWidth * 128) + (this.X)) % (sonicLevel.LevelWidth * 128);
                        this.Y = ((sonicLevel.LevelHeight * 128) + (this.Y)) % (sonicLevel.LevelHeight * 128);
                        return;
                    }
                    this.UpdateMode();
                    if (this.HLock > 0) {
                        this.HLock--;
                        this.HoldingRight = false;
                        this.HoldingLeft = false;
                    }
                    if (this.InAir) {
                        if (this.Angle != 0xff) {
                            this.Angle = (0xff + (this.Angle + ((this.Angle > 0xff / 2) ? 2 : -2))) % 0xff;
                            if (this.Angle >= 0xfd || this.Angle <= 0x01)
                                this.Angle = 0xff;
                        }
                    }
                    this.EffectPhysics();
                    this.CheckCollisionWithRings();
                    this.UpdateSprite();
                    this.SensorManager.Check(this);
                    var sensorM1 = this.SensorManager.GetResult("m1");
                    var sensorM2 = this.SensorManager.GetResult("m2");
                    var best = this.GetBestSensor(sensorM1, sensorM2, this.Mode);
                    if (best != null) {
                        switch (this.Mode) {
                            case Enums_6.RotationMode.Floor:
                                this.X = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? 12 : -12)));
                                this.Gsp = 0;
                                if (this.InAir)
                                    this.Xsp = 0;
                                break;
                            case Enums_6.RotationMode.LeftWall:
                                this.Y = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? 12 : -12)));
                                if (this.InAir)
                                    this.Xsp = 0;
                                break;
                            case Enums_6.RotationMode.Ceiling:
                                this.X = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? -12 : 12)));
                                this.Gsp = 0;
                                if (this.InAir)
                                    this.Xsp = 0;
                                break;
                            case Enums_6.RotationMode.RightWall:
                                this.Y = (best.Value + (sensorM2 != null && sensorM1 != null && (sensorM1.Value == sensorM2.Value) ? 12 : (best.Letter == "m1" ? -12 : 12)));
                                this.Gsp = 0;
                                if (this.InAir)
                                    this.Xsp = 0;
                                break;
                        }
                    }
                    this.SensorManager.Check(this);
                    var sensorA = this.SensorManager.GetResult("a");
                    var sensorB = this.SensorManager.GetResult("b");
                    var fy;
                    var fx;
                    var hSize = this.GetHalfImageSize();
                    if (!this.InAir) {
                        best = this.GetBestSensor(sensorA, sensorB, this.Mode);
                        if (best == null)
                            this.InAir = true;
                        else {
                            this.JustHit = false;
                            switch (this.Mode) {
                                case Enums_6.RotationMode.Floor:
                                    best.Chosen = true;
                                    this.Angle = best.Angle;
                                    this.Y = fy = best.Value - hSize.Y;
                                    break;
                                case Enums_6.RotationMode.LeftWall:
                                    best.Chosen = true;
                                    this.Angle = best.Angle;
                                    this.X = fx = best.Value + hSize.X;
                                    break;
                                case Enums_6.RotationMode.Ceiling:
                                    best.Chosen = true;
                                    this.Angle = best.Angle;
                                    this.Y = fy = best.Value + hSize.Y;
                                    break;
                                case Enums_6.RotationMode.RightWall:
                                    best.Chosen = true;
                                    this.Angle = best.Angle;
                                    this.X = fx = best.Value - hSize.X;
                                    break;
                            }
                        }
                        this.UpdateMode();
                    }
                    else {
                        if (sensorA == null && sensorB == null)
                            this.InAir = true;
                        else {
                            if ((sensorA != null && sensorA.Value >= 0) && (sensorB != null && sensorB.Value >= 0)) {
                                if (sensorA.Value < sensorB.Value) {
                                    if (this.Y + (20) >= sensorA.Value) {
                                        this.Angle = sensorA.Angle;
                                        this.Y = fy = sensorA.Value - hSize.Y;
                                        this.Rolling = this.CurrentlyBall = false;
                                        this.InAir = false;
                                    }
                                }
                                else {
                                    if (sensorB.Value > -1) {
                                        if (this.Y + (20) >= sensorB.Value) {
                                            this.Angle = sensorB.Angle;
                                            this.Y = fy = sensorB.Value - hSize.Y;
                                            this.Rolling = this.CurrentlyBall = false;
                                            this.InAir = false;
                                        }
                                    }
                                }
                            }
                            else if ((sensorA != null) && sensorA.Value > -1) {
                                if (this.Y + (20) >= sensorA.Value) {
                                    this.Angle = sensorA.Angle;
                                    this.Y = fy = sensorA.Value - hSize.Y;
                                    this.Rolling = this.CurrentlyBall = false;
                                    this.InAir = false;
                                }
                            }
                            else if (sensorB != null && sensorB.Value > -1) {
                                if (this.Y + (20) >= sensorB.Value) {
                                    this.Angle = sensorB.Angle;
                                    this.Y = fy = sensorB.Value - hSize.Y;
                                    this.Rolling = this.CurrentlyBall = false;
                                    this.InAir = false;
                                }
                            }
                        }
                        this.UpdateMode();
                        var cur = SonicManager_15.SonicManager.Instance.SpriteCache.SonicSprites[this.SpriteState];
                        var __h = cur.height / 2;
                        this.SensorManager.Check(this);
                        var sensorC = this.SensorManager.GetResult("c");
                        var sensorD = this.SensorManager.GetResult("d");
                        if ((sensorC == null && sensorD == null)) {
                        }
                        else {
                            if (sensorD != null && (sensorC != null) && (sensorC.Value >= 0 && sensorD.Value >= 0)) {
                                if (sensorC.Value < sensorD.Value) {
                                    if (this.Y + (__h) >= sensorC.Value) {
                                        if (this.Ysp < 0) {
                                            if (sensorC.Angle > 0x40 && sensorC.Angle < 0xC0) {
                                                this.Angle = sensorC.Angle;
                                                this.Gsp = this.Ysp;
                                                this.InAir = false;
                                                this.WasInAir = false;
                                            }
                                            else
                                                this.Ysp = 0;
                                            this.Y = fy = sensorC.Value + __h;
                                        }
                                    }
                                }
                                else {
                                    if (this.Y + (__h) >= sensorD.Value) {
                                        if (this.Ysp < 0) {
                                            if (sensorD.Angle > 0x40 && sensorD.Angle < 0xC0) {
                                                this.Angle = sensorD.Angle;
                                                this.Gsp = -this.Ysp;
                                                this.InAir = false;
                                                this.WasInAir = false;
                                            }
                                            else
                                                this.Ysp = 0;
                                            this.Y = fy = sensorD.Value + __h;
                                        }
                                    }
                                }
                            }
                            else if (sensorC != null && sensorC.Value > -1) {
                                if (this.Y + (__h) >= sensorC.Value) {
                                    if (this.Ysp < 0) {
                                        if (sensorC.Angle > 0x40 && sensorC.Angle < 0xC0) {
                                            this.Angle = sensorC.Angle;
                                            this.Gsp = this.Ysp;
                                            this.InAir = false;
                                            this.WasInAir = false;
                                        }
                                        else
                                            this.Ysp = 0;
                                        this.Y = fy = sensorC.Value + __h;
                                    }
                                }
                            }
                            else if (sensorD != null && sensorD.Value > -1) {
                                if (this.Y + (__h) >= sensorD.Value) {
                                    if (this.Ysp < 0) {
                                        if (sensorD.Angle > 0x40 && sensorD.Angle < 0xC0) {
                                            this.Angle = sensorD.Angle;
                                            this.Gsp = -this.Ysp;
                                            this.InAir = false;
                                            this.WasInAir = false;
                                        }
                                        else
                                            this.Ysp = 0;
                                        this.Y = fy = sensorD.Value + __h;
                                    }
                                }
                            }
                            this.UpdateMode();
                        }
                    }
                };
                Sonic.prototype.GetBestSensor = function (sensor1, sensor2, mode) {
                    if (sensor1 == null && sensor2 == null)
                        return null;
                    if (sensor1 == null)
                        return sensor2;
                    if (sensor2 == null)
                        return sensor1;
                    switch (mode) {
                        case Enums_6.RotationMode.Floor:
                            return sensor1.Value < sensor2.Value ? sensor1 : sensor2;
                        case Enums_6.RotationMode.LeftWall:
                            return sensor1.Value > sensor2.Value ? sensor1 : sensor2;
                        case Enums_6.RotationMode.Ceiling:
                            return sensor1.Value > sensor2.Value ? sensor1 : sensor2;
                        case Enums_6.RotationMode.RightWall:
                            return sensor1.Value < sensor2.Value ? sensor1 : sensor2;
                    }
                    return null;
                };
                Sonic.prototype.Invulnerable = function () {
                    var mc = SonicManager_15.SonicManager.Instance.DrawTickCount - this.sonicLastHitTick;
                    if (mc < 120) {
                        if (mc % 8 < 4)
                            return true;
                    }
                    return false;
                };
                Sonic.prototype.GetHalfImageSize = function () {
                    return this.halfSize;
                };
                Sonic.prototype.GetOffsetFromImage = function () {
                    var cur = SonicManager_15.SonicManager.Instance.SpriteCache.SonicSprites[this.SpriteState];
                    var xOffset = 0;
                    var yOffset = 0;
                    if (cur.height != 40) {
                        var n = void 0;
                        switch (this.Mode) {
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
                    this.offsetFromImage.X = xOffset;
                    this.offsetFromImage.Y = yOffset;
                    return this.offsetFromImage;
                };
                Sonic.prototype.UpdateSprite = function () {
                    var absgsp = Math.abs(this.Gsp);
                    var word = this.SpriteState.substring(0, this.SpriteState.length - 1);
                    var j = parseInt(this.SpriteState.substring(this.SpriteState.length - 1, this.SpriteState.length));
                    if (this.Breaking > 0) {
                        if (this.Gsp > 0 || this.Gsp == 0 || this.SpriteState == "breaking3") {
                            this.Facing = false;
                            this.Breaking = 0;
                        }
                    }
                    else if (this.Breaking < 0) {
                        if (this.Gsp < 0 || this.Gsp == 0 || this.SpriteState == "breaking3") {
                            this.Breaking = 0;
                            this.Facing = true;
                        }
                    }
                    var epsilon = 0.00001;
                    if (this.JustHit) {
                        if (word != "hit") {
                            this.SpriteState = "hit0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0))
                            this.SpriteState = "hit1";
                    }
                    else if (this.SpinDash) {
                        if (word != "spindash") {
                            this.SpriteState = "spindash0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % Math.floor(2 - absgsp) | 0) == 0)
                            this.SpriteState = "spindash" + ((j + 1) % 6);
                    }
                    else if (Math.abs(absgsp - 0) < epsilon && this.InAir == false) {
                        if (this.Ducking) {
                            if (word != "duck") {
                                this.SpriteState = "duck0";
                                this.runningTick = 1;
                            }
                            else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                                this.SpriteState = "duck1";
                        }
                        else if (this.HoldingUp) {
                            if (word != "lookingup") {
                                this.SpriteState = "lookingup0";
                                this.runningTick = 1;
                            }
                            else if (((this.runningTick++) % Math.floor(4 - absgsp) | 0) == 0)
                                this.SpriteState = "lookingup1";
                        }
                        else {
                            this.SpriteState = "normal";
                            this.CurrentlyBall = false;
                            this.Rolling = false;
                            this.runningTick = 0;
                        }
                    }
                    else if (this.Breaking != 0) {
                        if (word != "breaking") {
                            this.SpriteState = "breaking0";
                            this.runningTick = 1;
                        }
                        else if ((this.runningTick++) % (7) == 0) {
                            this.SpriteState = "breaking" + ((j + 1) % 4);
                            if (j == 0)
                                this.HaltSmoke.push(new Utils_9.Point(this.X, this.Y));
                        }
                    }
                    else if (this.CurrentlyBall) {
                        if (word != "balls") {
                            this.SpriteState = "balls0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % Math.floor(8 - absgsp) == 0) || (8 - absgsp < 1))
                            this.SpriteState = "balls" + ((j + 1) % 5);
                    }
                    else if (absgsp < 6) {
                        if (word != "running") {
                            this.SpriteState = "running0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                            this.SpriteState = "running" + ((j + 1) % 8);
                    }
                    else if (absgsp >= 6) {
                        if (word != "fastrunning") {
                            this.SpriteState = "fastrunning0";
                            this.runningTick = 1;
                        }
                        else if (((this.runningTick++) % (Math.floor(8 - absgsp) | 0) == 0) || (8 - absgsp < 1))
                            this.SpriteState = "fastrunning" + ((j + 1) % 4);
                    }
                };
                Sonic.prototype.EffectPhysics = function () {
                    this.Watcher.Tick();
                    var physics = this.physicsVariables;
                    var max = physics.TopSpeed;
                    if (!this.Jumping) {
                        if (!this.InAir && this.WasJumping)
                            this.WasJumping = false;
                    }
                    if (this.InAir && !this.WasInAir) {
                        this.WasInAir = true;
                        var offset = this.GetOffsetFromImage();
                    }
                    if (!this.InAir && this.WasInAir) {
                        this.WasInAir = false;
                        if ((this.Angle >= 0xF0 || this.Angle <= 0x0F))
                            this.Gsp = (this.Xsp);
                        else if ((this.Angle > 0xE2 && this.Angle <= 0xEF) || (this.Angle >= 0x10 && this.Angle <= 0x1F))
                            this.Gsp = (this.Ysp);
                        else if ((this.Angle >= 0xC0 && this.Angle <= 0xE2))
                            this.Gsp = (-this.Ysp);
                        else if ((this.Angle >= 0x20 && this.Angle <= 0x3F))
                            this.Gsp = (this.Ysp);
                        this.Xsp = 0;
                        this.Ysp = 0;
                    }
                    if (!this.InAir && !this.Rolling && !this.SpinDash) {
                        if (!this.HoldingLeft && !this.HoldingRight && !this.JustHit) {
                            this.Gsp -= (Math.min(Math.abs(this.Gsp), this.Watcher.Multiply(physics.Frc)) * (this.Gsp > 0 ? 1 : -1));
                        }
                        this.oldSign = Help_5.Help.Sign(this.Gsp);
                        this.Gsp += this.Watcher.Multiply(physics.Slp) * -Help_5.Help.Sin(this.Angle);
                        if (this.oldSign != Help_5.Help.Sign(this.Gsp) && this.oldSign != 0)
                            this.HLock = 30;
                        if (this.HoldingRight && !this.HoldingLeft && !this.JustHit) {
                            this.Facing = true;
                            if (this.Gsp >= 0) {
                                this.Gsp += this.Watcher.Multiply(physics.Acc);
                                if (this.Gsp > max)
                                    this.Gsp = max;
                            }
                            else {
                                this.Gsp += this.Watcher.Multiply(physics.Dec);
                                if (Math.abs(this.Gsp) > 4.5) {
                                    this.Facing = false;
                                    this.Breaking = 1;
                                    this.runningTick = 0;
                                }
                            }
                        }
                        if (this.HoldingLeft && !this.HoldingRight && !this.JustHit) {
                            this.Facing = false;
                            if (this.Gsp <= 0) {
                                this.Gsp -= this.Watcher.Multiply(physics.Acc);
                                if (this.Gsp < -max)
                                    this.Gsp = -max;
                            }
                            else {
                                this.Gsp -= this.Watcher.Multiply(physics.Dec);
                                if (Math.abs(this.Gsp) > 4.5) {
                                    this.Facing = true;
                                    this.Breaking = -1;
                                    this.runningTick = 0;
                                }
                            }
                        }
                    }
                    this.Ducking = false;
                    if (this.Crouching) {
                        if (Math.abs(this.Gsp) > 1.03125) {
                            this.Rolling = true;
                            this.CurrentlyBall = true;
                        }
                        else
                            this.Ducking = true;
                    }
                    else {
                        if (this.SpinDash) {
                            this.Gsp = (8 + Help_5.Help.Floor(this.SpinDashSpeed) / 2) * (this.Facing ? 1 : -1);
                            this.SpinDash = false;
                            this.Rolling = true;
                            this.CurrentlyBall = true;
                        }
                    }
                    if (!this.InAir && this.Rolling) {
                        if (this.HoldingLeft && !this.JustHit) {
                            if (this.Gsp > 0) {
                                if (this.Rolling)
                                    this.Gsp = (Help_5.Help.Max(0, this.Gsp - this.Watcher.Multiply(physics.Rdec)));
                            }
                        }
                        if (this.HoldingRight && !this.JustHit) {
                            if (this.Gsp < 0) {
                                if (this.Rolling)
                                    this.Gsp = (Help_5.Help.Min(0, this.Gsp + this.Watcher.Multiply(physics.Rdec)));
                            }
                        }
                        this.Gsp -= (Math.min(Math.abs(this.Gsp), this.Watcher.Multiply(physics.Rfrc)) * (this.Gsp > 0 ? 1 : -1));
                        this.oldSign = Help_5.Help.Sign(this.Gsp);
                        var ang = Help_5.Help.Sin(this.Angle);
                        if ((ang > 0) == (this.Gsp > 0))
                            this.Gsp += this.Watcher.Multiply(-physics.SlpRollingUp) * ang;
                        else
                            this.Gsp += this.Watcher.Multiply(-physics.SlpRollingDown) * ang;
                        if (this.Gsp > max * 2.5)
                            this.Gsp = max * 2.5;
                        if (this.Gsp < -max * 2.5)
                            this.Gsp = -max * 2.5;
                        if (this.oldSign != Help_5.Help.Sign(this.Gsp) && this.oldSign != 0)
                            this.HLock = 30;
                        if (Math.abs(this.Gsp) < 0.53125) {
                            this.Rolling = false;
                            this.CurrentlyBall = false;
                        }
                    }
                    if (this.InAir) {
                        if (this.HoldingRight && !this.HoldingLeft && !this.JustHit) {
                            this.Facing = true;
                            if (this.Xsp >= 0) {
                                this.Xsp += this.Watcher.Multiply(physics.Air);
                                if (this.Xsp > max)
                                    this.Xsp = max;
                            }
                            else {
                                this.Xsp += this.Watcher.Multiply(physics.Air);
                            }
                        }
                        if (this.HoldingLeft && !this.HoldingRight && !this.JustHit) {
                            this.Facing = false;
                            if (this.Xsp <= 0) {
                                this.Xsp -= this.Watcher.Multiply(physics.Air);
                                if (this.Xsp < -max)
                                    this.Xsp = -max;
                            }
                            else {
                                this.Xsp -= this.Watcher.Multiply(physics.Air);
                            }
                        }
                        if (this.WasInAir)
                            if (this.Jumping) {
                            }
                            else {
                            }
                        this.Ysp += this.JustHit ? 0.1875 : physics.Grv;
                        if (this.Ysp < 0 && this.Ysp > -4) {
                            if (Math.abs(this.Xsp) > 0.125)
                                this.Xsp *= 0.96875;
                        }
                        if (this.Ysp > 16)
                            this.Ysp = 16;
                    }
                    if (this.WasInAir && this.Jumping) {
                    }
                    else if (this.Jumping && !this.WasJumping) {
                        this.WasJumping = true;
                        if (this.Ducking) {
                            this.SpinDash = true;
                            this.SpinDashSpeed += 2;
                            if (this.SpinDashSpeed > 8)
                                this.SpinDashSpeed = 8;
                            this.SpriteState = "spindash0";
                        }
                        else {
                            this.InAir = true;
                            this.CurrentlyBall = true;
                            this.Xsp = physics.Jmp * Help_5.Help.Sin(this.Angle) + this.Gsp * Help_5.Help.Cos(this.Angle);
                            this.Ysp = physics.Jmp * Help_5.Help.Cos(this.Angle);
                            if (Math.abs(this.Xsp) < .17)
                                this.Xsp = 0;
                        }
                    }
                    if (!this.InAir) {
                        if (this.SpinDash)
                            this.Gsp = 0;
                        this.Xsp = this.Gsp * Help_5.Help.Cos(this.Angle);
                        this.Ysp = this.Gsp * -Help_5.Help.Sin(this.Angle);
                        if (Math.abs(this.Gsp) < 2.5 && this.Mode != Enums_6.RotationMode.Floor) {
                            if (this.Mode == Enums_6.RotationMode.RightWall)
                                this.X += 0;
                            else if (this.Mode == Enums_6.RotationMode.LeftWall)
                                this.X += 0;
                            else if (this.Mode == Enums_6.RotationMode.Ceiling)
                                this.Y += 0;
                            var oldMode = this.Mode;
                            this.UpdateMode();
                            this.Mode = Enums_6.RotationMode.Floor;
                            this.HLock = 30;
                            this.InAir = true;
                        }
                    }
                    if (this.Xsp > 0 && this.Xsp < 0.008) {
                        this.Gsp = 0;
                        this.Xsp = 0;
                    }
                    if (this.Xsp < 0 && this.Xsp > -0.008) {
                        this.Gsp = 0;
                        this.Xsp = 0;
                    }
                    this.X = ((this.sonicLevel.LevelWidth * 128) + (this.X + this.Xsp)) % (this.sonicLevel.LevelWidth * 128);
                    this.Y = ((this.sonicLevel.LevelHeight * 128) + (this.Y + this.Ysp)) % (this.sonicLevel.LevelHeight * 128);
                };
                Sonic.prototype.Draw = function (canvas) {
                    var fx = (this.X);
                    var fy = (this.Y);
                    if (this.Invulnerable())
                        return;
                    var cur = SonicManager_15.SonicManager.Instance.SpriteCache.SonicSprites[this.SpriteState];
                    if (cur == null) {
                    }
                    if (Help_5.Help.IsLoaded(cur)) {
                        canvas.save();
                        var offset = this.GetOffsetFromImage();
                        canvas.translate((fx - SonicManager_15.SonicManager.Instance.windowLocation.X + offset.X), ((fy - SonicManager_15.SonicManager.Instance.windowLocation.Y + offset.Y)));
                        if (SonicManager_15.SonicManager.Instance.ShowHeightMap) {
                            canvas.save();
                            var mul = 6;
                            var xj = this.Xsp * mul;
                            var yj = this.Ysp * mul;
                            canvas.beginPath();
                            canvas.moveTo(0, 0);
                            canvas.lineTo(xj, yj);
                            canvas.fillStyle = "rgba(163,241,255,0.8)";
                            canvas.arc(xj, yj, 5, 0, 2 * Math.PI, true);
                            canvas.closePath();
                            canvas.lineWidth = 6;
                            canvas.strokeStyle = "white";
                            canvas.stroke();
                            canvas.lineWidth = 3;
                            canvas.strokeStyle = "#2448D8";
                            canvas.fill();
                            canvas.stroke();
                            canvas.restore();
                        }
                        if (!this.Facing) {
                            canvas.scale(-1, 1);
                            if (!this.CurrentlyBall && !this.SpinDash)
                                canvas.rotate(-Help_5.Help.FixAngle(this.Angle));
                            canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                            if (this.SpinDash) {
                                canvas.drawImage(SonicManager_15.SonicManager.Instance.SpriteCache.SonicSprites[("spinsmoke" + ((SonicManager_15.SonicManager.Instance.DrawTickCount % 14) / 2 | 0))], (-cur.width / 2) - 25, -cur.height / 2 + (offset.Y) - 14, cur.width, cur.height);
                            }
                        }
                        else {
                            if (!this.CurrentlyBall && !this.SpinDash)
                                canvas.rotate(Help_5.Help.FixAngle(this.Angle));
                            canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);
                            if (this.SpinDash) {
                                canvas.drawImage(SonicManager_15.SonicManager.Instance.SpriteCache.SonicSprites[("spinsmoke" + ((SonicManager_15.SonicManager.Instance.DrawTickCount % 14) / 2 | 0))], (-cur.width / 2) - 25, -cur.height / 2 + (offset.Y) - 14, cur.width, cur.height);
                            }
                        }
                        canvas.restore();
                        if (SonicManager_15.SonicManager.Instance.ShowHeightMap)
                            this.SensorManager.Draw(canvas, this);
                        for (var i = 0; i < this.HaltSmoke.length; i++) {
                            var lo = this.HaltSmoke[i];
                            canvas.drawImage(SonicManager_15.SonicManager.Instance.SpriteCache.SonicSprites[("haltsmoke" + ((SonicManager_15.SonicManager.Instance.DrawTickCount % (4 * 6)) / 6 | 0))], ((lo.X - SonicManager_15.SonicManager.Instance.windowLocation.X - 25)), ((lo.Y + 12 - SonicManager_15.SonicManager.Instance.windowLocation.Y + offset.Y)));
                            if ((((SonicManager_15.SonicManager.Instance.DrawTickCount + 6) % (4 * 6)) / 6 | 0) == 0)
                                this.HaltSmoke = this.HaltSmoke.slice(i, 1);
                        }
                    }
                };
                Sonic.prototype.DrawUI = function (canvas, pos) {
                    canvas.save();
                    {
                        if (canvas.font != "13pt Arial bold")
                            canvas.font = "13pt Arial bold";
                        canvas.fillStyle = "White";
                        canvas.fillText("Rings: " + this.Rings, pos.X + 90, pos.Y + 45);
                        canvas.fillText("Angle: " + this.Angle.toString(16), pos.X + 90, pos.Y + 75);
                        canvas.fillText("Position: " + (this.X) + ", " + (this.Y), pos.X + 90, pos.Y + 105);
                        canvas.fillText("Speed: g: " + this.Gsp.toFixed(3) + " x:" + this.Xsp.toFixed(3) + " y:" + this.Ysp.toFixed(3), pos.X + 90, pos.Y + 135);
                        canvas.fillText("Mode: " + this.Mode.toString(), pos.X + 90, pos.Y + 165);
                        canvas.fillText("Multiplier: " + this.Watcher.mult, pos.X + 90, pos.Y + 195);
                        if (this.InAir)
                            canvas.fillText("Air ", pos.X + 220, pos.Y + 45);
                        if (this.HLock > 0)
                            canvas.fillText("HLock: " + this.HLock, pos.X + 90, pos.Y + 195);
                    }
                    canvas.restore();
                };
                Sonic.prototype.Hit = function (x, y) {
                    if (SonicManager_15.SonicManager.Instance.DrawTickCount - this.sonicLastHitTick < 120)
                        return;
                    this.JustHit = true;
                    this.Ysp = -4;
                    this.Xsp = 2 * ((this.X - x) < 0 ? -1 : 1);
                    this.sonicLastHitTick = SonicManager_15.SonicManager.Instance.DrawTickCount;
                    var t = 0;
                    var angle = 101.25;
                    var n = false;
                    var speed = 4;
                    while (t < this.Rings) {
                        var ring = new Ring_1.Ring(true);
                        SonicManager_15.SonicManager.Instance.ActiveRings.push(ring);
                        ring.X = this.X | 0;
                        ring.Y = this.Y - 10 | 0;
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
                    this.Rings = 0;
                };
                Sonic.prototype.Debug = function () {
                    this.Debugging = !this.Debugging;
                    this.Xsp = 0;
                    this.Gsp = 0;
                    this.Ysp = 0;
                    this.SpriteState = "normal";
                };
                Sonic.prototype.PressUp = function () {
                    this.HoldingUp = true;
                };
                Sonic.prototype.ReleaseUp = function () {
                    this.HoldingUp = false;
                };
                Sonic.prototype.PressCrouch = function () {
                    this.Crouching = true;
                };
                Sonic.prototype.ReleaseCrouch = function () {
                    this.Crouching = false;
                };
                Sonic.prototype.PressLeft = function () {
                    this.HoldingLeft = true;
                };
                Sonic.prototype.ReleaseLeft = function () {
                    this.HoldingLeft = false;
                };
                Sonic.prototype.PressRight = function () {
                    this.HoldingRight = true;
                };
                Sonic.prototype.ReleaseRight = function () {
                    this.HoldingRight = false;
                };
                Sonic.prototype.PressJump = function () {
                    this.Jumping = true;
                };
                Sonic.prototype.ReleaseJump = function () {
                    this.Jumping = false;
                };
                Sonic.prototype.CheckCollisionWithObjects = function (x, y, letter) {
                    this.objectCollision.X = x;
                    this.objectCollision.Y = y;
                    var me = this.objectCollision;
                    var levelObjectInfos = SonicManager_15.SonicManager.Instance.InFocusObjects;
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
                Sonic.prototype.CheckCollisionWithRings = function () {
                    var me = this.myRec;
                    this.ringCollisionRect.X = 0;
                    this.ringCollisionRect.Y = 0;
                    this.ringCollisionRect.Width = 8 * 2;
                    this.ringCollisionRect.Height = 8 * 2;
                    var rings = SonicManager_15.SonicManager.Instance.SonicLevel.Rings;
                    for (var index = 0; index < rings.length; index++) {
                        var ring = rings[index];
                        var pos = ring;
                        if (this.obtainedRing[index])
                            continue;
                        this.ringCollisionRect.X = pos.X;
                        this.ringCollisionRect.Y = pos.Y;
                        if (Utils_9.IntersectingRectangle.IntersectRect(me, this.ringCollisionRect)) {
                            this.Rings++;
                            this.obtainedRing[index] = true;
                        }
                    }
                };
                Sonic.prototype.CheckCollisionLine = function (p0, p1, p2, p3) {
                    return null;
                };
                return Sonic;
            }());
            exports_31("Sonic", Sonic);
            Watcher = (function () {
                function Watcher() {
                    this.lastTick = 0;
                    this.mult = 1;
                }
                Watcher.prototype.Tick = function () {
                    if (true || SonicManager_15.SonicManager.Instance.InHaltMode) {
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
            exports_31("Watcher", Watcher);
        }
    }
});
System.register("Game/Level/SpriteCache", [], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
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
            exports_32("SpriteCache", SpriteCache);
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
            exports_32("SpriteCacheIndexes", SpriteCacheIndexes);
        }
    }
});
System.register("Game/Level/Animations/AnimationInstance", [], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
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
            exports_33("AnimationInstance", AnimationInstance);
        }
    }
});
System.register("Common/SpriteLoader", [], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
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
            exports_34("SpriteLoader", SpriteLoader);
            SpriteLoaderStep = (function () {
                function SpriteLoaderStep(title, method, onFinish) {
                    this.Title = title;
                    this.Method = method;
                    this.OnFinish = onFinish;
                    this.Iterations = new Array();
                }
                return SpriteLoaderStep;
            }());
            exports_34("SpriteLoaderStep", SpriteLoaderStep);
        }
    }
});
System.register("Game/Level/SonicBackground", [], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var SonicBackground;
    return {
        setters:[],
        execute: function() {
            SonicBackground = (function () {
                function SonicBackground() {
                }
                SonicBackground.prototype.Draw = function (canvas, point, wOffset) {
                };
                return SonicBackground;
            }());
            exports_35("SonicBackground", SonicBackground);
        }
    }
});
System.register("Game/SonicManager", ["Common/Utils", "Common/CanvasInformation", "Game/SonicEngine", "Common/Enums", "Common/Help", "Game/Level/HeightMap", "Game/Level/Objects/ObjectManager", "Game/SonicLevel", "Game/Level/Objects/LevelObjectInfo", "Game/Level/Ring", "Game/Level/SpriteCache", "Game/Level/Animations/TileAnimationData", "Game/Level/Tiles/TilePaletteAnimationManager", "Game/Level/Tiles/TileAnimationManager", "Game/Level/Tiles/TileChunk", "Common/SpriteLoader", "Game/Level/Objects/LevelObject", "Game/Level/Objects/LevelObjectData", "Game/Level/Tiles/Tile", "Game/Level/Tiles/TilePiece", "Game/Level/Tiles/TileInfo", "Game/Level/Tiles/TilePieceInfo"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var Utils_10, CanvasInformation_7, SonicEngine_1, Enums_7, Help_6, HeightMap_2, ObjectManager_2, SonicLevel_1, LevelObjectInfo_1, Ring_2, SpriteCache_1, TileAnimationData_1, TilePaletteAnimationManager_1, TileAnimationManager_1, TileChunk_1, SpriteLoader_1, LevelObject_2, LevelObjectData_1, Tile_1, TilePiece_1, TileInfo_1, TilePieceInfo_1;
    var SonicManager;
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
                    SonicManager.Instance = this;
                    this.engine = engine;
                    this.engine.canvasWidth = $(window).width();
                    this.engine.canvasHeight = $(window).height();
                    gameCanvas.DomCanvas[0].setAttribute("width", this.engine.canvasWidth.toString());
                    gameCanvas.DomCanvas[0].setAttribute("height", this.engine.canvasHeight.toString());
                    jQuery.getJSON("content/sprites/sonic.js", function (data) {
                        _this.sonicSprites = data;
                    });
                    this.objectManager = new ObjectManager_2.ObjectManager(this);
                    this.objectManager.Init();
                    var scl = 4;
                    this.scale = new Utils_10.Point(scl, scl);
                    this.RealScale = new Utils_10.DoublePoint(1, 1);
                    this.mainCanvas = gameCanvas;
                    this.windowLocation = Help_6.Help.DefaultWindowLocation(Enums_7.GameState.Editing, this.scale);
                    this.BigWindowLocation = Help_6.Help.DefaultWindowLocation(Enums_7.GameState.Editing, this.scale);
                    this.BigWindowLocation.Width = (this.BigWindowLocation.Width * 1.8) | 0;
                    this.BigWindowLocation.Height = (this.BigWindowLocation.Height * 1.8) | 0;
                    this.TileAnimations = new Array();
                    this.AnimationInstances = new Array();
                    this.ShowHeightMap = false;
                    this.GoodRing = new Ring_2.Ring(false);
                    this.ActiveRings = new Array();
                    this.ForceResize = resize;
                    this.Background = null;
                    this.currentGameState = Enums_7.GameState.Editing;
                    this.ScreenOffset = new Utils_10.Point(this.mainCanvas.DomCanvas.width() / 2 - this.windowLocation.Width / 2, this.mainCanvas.DomCanvas.height() / 2 - this.windowLocation.Height / 2);
                    this.ClickState = Enums_7.ClickState.PlaceChunk;
                    this.tickCount = 0;
                    this.DrawTickCount = 0;
                    this.InHaltMode = false;
                    this.waitingForTickContinue = false;
                    this.waitingForDrawContinue = false;
                    this.TileChunkDebugDrawOptions = new TileChunk_1.TileChunkDebugDrawOptions();
                }
                SonicManager.prototype.OnClick = function (Event) {
                    this.clicking = true;
                    if (this.effectClick(Event))
                        return true;
                    return false;
                };
                SonicManager.prototype.effectClick = function (event) {
                    var e = new Utils_10.Point((event.clientX / this.scale.X / this.RealScale.X + this.windowLocation.X), (event.clientY / this.scale.Y / this.RealScale.Y + this.windowLocation.Y));
                    var ey;
                    var ex;
                    if (event.ctrlKey) {
                        ex = e.X / 128 | 0;
                        ey = e.Y / 128 | 0;
                        var ch = this.SonicLevel.GetChunkAt(ex, ey);
                        //            if (this.UIManager.UIManagerAreas.TilePieceArea != null)
                        //                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, this.UIManager.UIManagerAreas.TilePieceArea.Data, true);
                        return true;
                    }
                    if (event.shiftKey) {
                        ex = e.X / 128 | 0;
                        ey = e.Y / 128 | 0;
                        var ch = this.SonicLevel.GetChunkAt(ex, ey);
                        //            if (this.UIManager.UIManagerAreas.TileChunkArea != null)
                        //                this.SonicLevel.SetChunkAt(ex, ey, this.UIManager.UIManagerAreas.TileChunkArea.Data);
                        return true;
                    }
                    if (event.button == 0) {
                        switch (this.ClickState) {
                            case Enums_7.ClickState.Dragging:
                                return true;
                            case Enums_7.ClickState.PlaceChunk:
                                ex = e.X / 128 | 0;
                                ey = e.Y / 128 | 0;
                                var ch = this.SonicLevel.GetChunkAt(ex, ey);
                                var tp = ch.GetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, true);
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
                                this.ClearCache();
                                return true;
                            case Enums_7.ClickState.PlaceRing:
                                ex = e.X;
                                ey = e.Y;
                                this.SonicLevel.Rings.push(Help_6.Help.Merge(new Ring_2.Ring(true), { X: ex, Y: ey }));
                                return true;
                            case Enums_7.ClickState.PlaceObject:
                                ex = e.X;
                                ey = e.Y;
                                var pos = new Utils_10.Point(ex, ey);
                                for (var _i = 0, _a = this.SonicLevel.Objects; _i < _a.length; _i++) {
                                    var o = _a[_i];
                                    if (Utils_10.IntersectingRectangle.IntersectsRect(o.GetRect(), pos))
                                        alert("Object Data: " + Help_6.Help.Stringify(o));
                                }
                                return true;
                        }
                    }
                    return false;
                };
                SonicManager.prototype.tickObjects = function () {
                    var localPoint = new Utils_10.Point(0, 0);
                    this.InFocusObjects = new Array();
                    var levelObjectInfos = this.SonicLevel.Objects;
                    for (var _i = 0, levelObjectInfos_2 = levelObjectInfos; _i < levelObjectInfos_2.length; _i++) {
                        var obj = levelObjectInfos_2[_i];
                        localPoint.X = obj.X | 0;
                        localPoint.Y = obj.Y | 0;
                        if (this.BigWindowLocation.Intersects(localPoint)) {
                            this.InFocusObjects.push(obj);
                            obj.Tick(obj, this.SonicLevel, this.sonicToon);
                        }
                    }
                    //        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
                    //            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
                    for (var _a = 0, _b = this.AnimationInstances; _a < _b.length; _a++) {
                        var animationInstance = _b[_a];
                        animationInstance.Tick();
                    }
                };
                SonicManager.prototype.Tick = function () {
                    if (this.Loading)
                        return;
                    if (this.currentGameState == Enums_7.GameState.Playing) {
                        if (this.InHaltMode) {
                            if (this.waitingForTickContinue)
                                return;
                        }
                        this.tickCount++;
                        this.tickObjects();
                        this.sonicToon.Ticking = true;
                        try {
                            this.sonicToon.Tick(this.SonicLevel);
                        }
                        finally {
                            this.sonicToon.Ticking = false;
                        }
                        if (this.InHaltMode) {
                            if (this.waitingForTickContinue)
                                return;
                            this.waitingForTickContinue = true;
                            this.waitingForDrawContinue = false;
                        }
                    }
                };
                SonicManager.prototype.PreloadSprites = function (completed, update) {
                    var _this = this;
                    if (this.SpriteCache != null) {
                        completed();
                        return;
                    }
                    this.SpriteCache = this.SpriteCache != null ? this.SpriteCache : new SpriteCache_1.SpriteCache();
                    var ci = this.SpriteCache.Rings;
                    var spriteLocations = new Array();
                    for (var j = 0; j < 4; j++) {
                        spriteLocations.push("assets/sprites/ring" + j + ".png");
                        this.imageLength++;
                    }
                    var ind_ = this.SpriteCache.Indexes;
                    this.SpriteLoader = new SpriteLoader_1.SpriteLoader(completed, update);
                    if (ci.length == 0) {
                        var spriteStep = this.SpriteLoader.AddStep("Sprites", function (i, done) {
                            Help_6.Help.LoadSprite(spriteLocations[i], function (jd) {
                                ci[i] = CanvasInformation_7.CanvasInformation.Create(jd.width, jd.height, false);
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
                            this.SpriteLoader.AddIterationToStep(spriteStep, i);
                        }
                    }
                    var cci = this.SpriteCache.SonicSprites;
                    if (Object.keys(cci).length == 0) {
                        var sonicStep = this.SpriteLoader.AddStep("Sonic Sprites", function (sp, done) {
                            for (var sonicSprite in _this.sonicSprites) {
                                cci[sonicSprite] = Help_6.Help.ScaleCsImage(_this.sonicSprites[sonicSprite], new Utils_10.Point(1, 1), function (ec) {
                                });
                            }
                            done();
                        }, function () { return true; }, false);
                        this.SpriteLoader.AddIterationToStep(sonicStep, 0);
                    }
                };
                SonicManager.prototype.MainDraw = function (canvas) {
                    var context = canvas.Context;
                    if (this.InHaltMode)
                        if (this.drawHaltMode(context))
                            return;
                    this.engine.Clear(canvas);
                    if (this.SonicLevel == null)
                        return;
                    context.save();
                    var localPoint = new Utils_10.Point(0, 0);
                    this.DrawTickCount++;
                    if (this.SpriteLoader && !this.SpriteLoader.Tick() || this.Loading) {
                        SonicManager.drawLoading(context);
                        context.restore();
                        return;
                    }
                    this.updatePositions(context);
                    var w1 = this.windowLocation.Width / 128 + 2;
                    var h1 = this.windowLocation.Height / 128 + 2;
                    if (this.currentGameState == Enums_7.GameState.Editing) {
                        w1 += 1;
                        h1 += 1;
                        w1 /= this.scale.X;
                        h1 /= this.scale.Y;
                    }
                    var offs = SonicManager.getOffs(w1, h1);
                    this.TilePaletteAnimationManager.TickAnimatedPalettes();
                    this.TileAnimationManager.TickAnimatedTiles();
                    var fxP = ((this.windowLocation.X) / 128) | 0;
                    var fyP = ((this.windowLocation.Y) / 128) | 0;
                    this.ResetCanvases();
                    var zero = new Utils_10.Point(0, 0);
                    if (this.Background) {
                        var wOffset = this.windowLocation.X;
                        var bw = this.Background.Width;
                        var movex = (wOffset / bw) * bw;
                        localPoint.X = -this.windowLocation.X + movex;
                        localPoint.Y = -this.windowLocation.Y / 4;
                        this.Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
                        localPoint.X = -this.windowLocation.X + movex + this.Background.Width;
                        localPoint.Y = -this.windowLocation.Y / 4;
                        this.Background.Draw(this.lowChunkCanvas.Context, localPoint, wOffset);
                    }
                    this.drawLowChunks(this.lowChunkCanvas.Context, zero, offs, fyP, fxP);
                    if (this.ShowHeightMap)
                        this.drawHighChunks(this.lowChunkCanvas.Context, fxP, fyP, offs, zero);
                    this.drawObjects(this.sonicCanvas.Context, zero);
                    this.drawAnimations(this.sonicCanvas.Context);
                    this.drawRings(this.sonicCanvas.Context, zero);
                    this.drawSonic(this.sonicCanvas.Context);
                    if (!this.ShowHeightMap)
                        this.drawHighChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
                    this.drawDebugTextChunks(this.highChuckCanvas.Context, fxP, fyP, offs, zero);
                    //        this.lowChunkCanvas.Context.OffsetPixelsForWater();
                    //        this.highChuckCanvas.Context.OffsetPixelsForWater();
                    this.drawCanveses(context, localPoint);
                    context.restore();
                    if (this.currentGameState == Enums_7.GameState.Playing)
                        this.sonicToon.DrawUI(context, new Utils_10.Point(this.ScreenOffset.X, this.ScreenOffset.Y));
                };
                SonicManager.prototype.drawCanveses = function (canvas, localPoint) {
                    canvas.scale(this.scale.X, this.scale.Y);
                    canvas.drawImage(this.lowChunkCanvas.Canvas, localPoint.X, localPoint.Y);
                    canvas.drawImage(this.sonicCanvas.Canvas, localPoint.X, localPoint.Y);
                    canvas.drawImage(this.highChuckCanvas.Canvas, localPoint.X, localPoint.Y);
                };
                SonicManager.prototype.ResetCanvases = function () {
                    this.lowChunkCanvas = this.lowChunkCanvas != null ? this.lowChunkCanvas : CanvasInformation_7.CanvasInformation.Create(this.windowLocation.Width, this.windowLocation.Height, false);
                    this.sonicCanvas = this.sonicCanvas != null ? this.sonicCanvas : CanvasInformation_7.CanvasInformation.Create(this.windowLocation.Width, this.windowLocation.Height, true);
                    this.highChuckCanvas = this.highChuckCanvas != null ? this.highChuckCanvas : CanvasInformation_7.CanvasInformation.Create(this.windowLocation.Width, this.windowLocation.Height, false);
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
                    this.ScreenOffset.X = 0;
                    this.ScreenOffset.Y = 0;
                    if (this.currentGameState == Enums_7.GameState.Playing)
                        this.updatePositionsForPlaying(canvas);
                };
                SonicManager.prototype.updatePositionsForPlaying = function (canvas) {
                    canvas.scale(this.RealScale.X, this.RealScale.Y);
                    if (this.sonicToon.Ticking) {
                        while (true) {
                            if (this.sonicToon.Ticking)
                                break;
                        }
                    }
                    canvas.translate(this.ScreenOffset.X, this.ScreenOffset.Y);
                    this.windowLocation.X = (this.sonicToon.X) - this.windowLocation.Width / 2;
                    this.windowLocation.Y = (this.sonicToon.Y) - this.windowLocation.Height / 2;
                    this.BigWindowLocation.X = (this.sonicToon.X) - this.BigWindowLocation.Width / 2;
                    this.BigWindowLocation.Y = (this.sonicToon.Y) - this.BigWindowLocation.Height / 2;
                    this.BigWindowLocation.X = (this.BigWindowLocation.X - this.windowLocation.Width * 0.2);
                    this.BigWindowLocation.Y = (this.BigWindowLocation.Y - this.windowLocation.Height * 0.2);
                    this.BigWindowLocation.Width = (this.windowLocation.Width * 1.8);
                    this.BigWindowLocation.Height = (this.windowLocation.Height * 1.8);
                };
                SonicManager.drawLoading = function (canvas) {
                    canvas.fillStyle = "white";
                    canvas.fillText("Loading...   ", 95, 95);
                    canvas.restore();
                    return;
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
                        var _xP = fxP + off.X;
                        var _yP = fyP + off.Y;
                        var _xPreal = fxP + off.X;
                        var _yPreal = fyP + off.Y;
                        _xP = Help_6.Help.Mod(_xP, this.SonicLevel.LevelWidth);
                        _yP = Help_6.Help.Mod(_yP, this.SonicLevel.LevelHeight);
                        var chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.X = (_xPreal * 128) - this.windowLocation.X;
                        localPoint.Y = (_yPreal * 128) - this.windowLocation.Y;
                        if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                            chunk.Draw(canvas, localPoint, Enums_7.ChunkLayerState.Low);
                    }
                };
                SonicManager.prototype.drawHighChunks = function (canvas, fxP, fyP, offs, localPoint) {
                    for (var _i = 0, offs_2 = offs; _i < offs_2.length; _i++) {
                        var off = offs_2[_i];
                        var _xP = fxP + off.X;
                        var _yP = fyP + off.Y;
                        var _xPreal = fxP + off.X;
                        var _yPreal = fyP + off.Y;
                        _xP = Help_6.Help.Mod(_xP, this.SonicLevel.LevelWidth);
                        _yP = Help_6.Help.Mod(_yP, this.SonicLevel.LevelHeight);
                        var chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.X = (_xPreal * 128) - this.windowLocation.X;
                        localPoint.Y = (_yPreal * 128) - this.windowLocation.Y;
                        if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                            chunk.Draw(canvas, localPoint, Enums_7.ChunkLayerState.High);
                        if (this.ShowHeightMap) {
                            var fd = this.SpriteCache.HeightMapChunks[(this.SonicLevel.CurHeightMap ? 1 : 2) + " " + chunk.Index];
                            if (fd == null) {
                                fd = this.cacheHeightMapForChunk(chunk);
                            }
                            canvas.drawImage(fd.Canvas, localPoint.X, localPoint.Y);
                        }
                        if (this.currentGameState == Enums_7.GameState.Editing) {
                            canvas.strokeStyle = "#DD0033";
                            canvas.lineWidth = 3;
                            canvas.strokeRect(localPoint.X, localPoint.Y, 128, 128);
                        }
                    }
                };
                SonicManager.prototype.drawDebugTextChunks = function (canvas, fxP, fyP, offs, localPoint) {
                    for (var _i = 0, offs_3 = offs; _i < offs_3.length; _i++) {
                        var off = offs_3[_i];
                        var _xP = fxP + off.X;
                        var _yP = fyP + off.Y;
                        var _xPreal = fxP + off.X;
                        var _yPreal = fyP + off.Y;
                        _xP = Help_6.Help.Mod(_xP, this.SonicLevel.LevelWidth);
                        _yP = Help_6.Help.Mod(_yP, this.SonicLevel.LevelHeight);
                        var chunk = this.SonicLevel.GetChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.X = (_xPreal * 128) - this.windowLocation.X;
                        localPoint.Y = (_yPreal * 128) - this.windowLocation.Y;
                        if (!chunk.IsEmpty() && !chunk.OnlyForeground())
                            chunk.DrawAnimationDebug(canvas, localPoint, Enums_7.ChunkLayerState.Low, this.TileChunkDebugDrawOptions);
                        if (!chunk.IsEmpty() && !chunk.OnlyBackground())
                            chunk.DrawAnimationDebug(canvas, localPoint, Enums_7.ChunkLayerState.High, this.TileChunkDebugDrawOptions);
                    }
                };
                SonicManager.prototype.cacheHeightMapForChunk = function (chunk) {
                    var md = chunk;
                    var posj1 = new Utils_10.Point(0, 0);
                    var canv = CanvasInformation_7.CanvasInformation.Create(128, 128, false);
                    var ctx = canv.Context;
                    this.engine.Clear(canv);
                    for (var _y = 0; _y < 8; _y++) {
                        for (var _x = 0; _x < 8; _x++) {
                            var tp = md.TilePieces[_x][_y];
                            var solid = (this.SonicLevel.CurHeightMap ? tp.Solid1 : tp.Solid2);
                            var hd = this.SonicLevel.CurHeightMap ? tp.GetLayer1HeightMaps() : tp.GetLayer2HeightMaps();
                            var __x = _x;
                            var __y = _y;
                            var vangle = 0;
                            var posm = new Utils_10.Point(posj1.X + (__x * 16), posj1.Y + (__y * 16));
                            if (!hd)
                                continue;
                            if (hd.Full === false) {
                            }
                            else if (hd.Full === true) {
                                if (solid > 0) {
                                    ctx.fillStyle = HeightMap_2.HeightMap.colors[solid];
                                    ctx.fillRect(posj1.X + (__x * 16), posj1.Y + (__y * 16), 16, 16);
                                }
                            }
                            else {
                                vangle = this.SonicLevel.CurHeightMap ? tp.GetLayer1Angles() : tp.GetLayer2Angles();
                                hd.Draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
                            }
                        }
                    }
                    return this.SpriteCache.HeightMapChunks[(this.SonicLevel.CurHeightMap ? 1 : 2) + " " + md.Index] = canv;
                };
                SonicManager.prototype.drawSonic = function (canvas) {
                    if (this.currentGameState == Enums_7.GameState.Playing) {
                        this.sonicToon.Draw(canvas);
                    }
                };
                SonicManager.prototype.drawRings = function (canvas, localPoint) {
                    for (var index = 0; index < this.SonicLevel.Rings.length; index++) {
                        var r = this.SonicLevel.Rings[index];
                        switch (this.currentGameState) {
                            case Enums_7.GameState.Playing:
                                if (!this.sonicToon.obtainedRing[index]) {
                                    if (this.BigWindowLocation.Intersects(r))
                                        this.GoodRing.Draw(canvas, r.Negate(this.windowLocation.X, this.windowLocation.Y));
                                }
                                break;
                            case Enums_7.GameState.Editing:
                                if (this.BigWindowLocation.Intersects(r))
                                    this.GoodRing.Draw(canvas, r.Negate(this.windowLocation.X, this.windowLocation.Y));
                                break;
                        }
                    }
                    switch (this.currentGameState) {
                        case Enums_7.GameState.Playing:
                            for (var i = this.ActiveRings.length - 1; i >= 0; i--) {
                                var ac = this.ActiveRings[i];
                                localPoint.X = ac.X - this.windowLocation.X;
                                localPoint.Y = ac.Y - this.windowLocation.Y;
                                ac.Draw(canvas, localPoint);
                                if (ac.TickCount > 256)
                                    this.ActiveRings.splice(i, 1);
                            }
                            break;
                        case Enums_7.GameState.Editing:
                            break;
                    }
                };
                SonicManager.prototype.drawAnimations = function (canvas) {
                    for (var _i = 0, _a = this.AnimationInstances; _i < _a.length; _i++) {
                        var ano = _a[_i];
                        ano.Draw(canvas, -this.windowLocation.X, -this.windowLocation.Y);
                    }
                };
                SonicManager.prototype.drawObjects = function (canvas, localPoint) {
                    var levelObjectInfos = this.SonicLevel.Objects;
                    for (var _i = 0, levelObjectInfos_3 = levelObjectInfos; _i < levelObjectInfos_3.length; _i++) {
                        var o = levelObjectInfos_3[_i];
                        localPoint.X = o.X;
                        localPoint.Y = o.Y;
                        if (o.Dead || this.BigWindowLocation.Intersects(localPoint)) {
                            o.Draw(canvas, ((localPoint.X - this.windowLocation.X)), ((localPoint.Y - this.windowLocation.Y)), this.ShowHeightMap);
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
                SonicManager.prototype.ClearCache = function () {
                    if (this.SpriteCache != null)
                        this.SpriteCache.ClearCache();
                    if (this.SonicLevel != null)
                        this.SonicLevel.ClearCache();
                    if (this.TilePaletteAnimationManager != null)
                        this.TilePaletteAnimationManager.ClearCache();
                    if (this.TileAnimationManager != null)
                        this.TileAnimationManager.ClearCache();
                };
                SonicManager.prototype.MouseUp = function (queryEvent) {
                    this.clicking = false;
                    return false;
                };
                SonicManager.prototype.MouseMove = function (queryEvent) {
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
                                var toChunkX = (to.X + x) / 8;
                                var toChunkY = (to.Y + curY) / 8;
                                var tochunk = _this.SonicLevel.GetChunkAt(toChunkX, toChunkY);
                                tochunk.ClearCache();
                                var totp = tochunk.TilePieces[(to.X + x) - toChunkX * 8][(to.Y + curY) - toChunkY * 8];
                                tochunk.IsOnlyBackground = null;
                                tochunk.IsOnlyForeground = null;
                                var fromChunkX = (from.X + x) / 8 | 0;
                                var fromChunkY = (from.Y + curY) / 8 | 0;
                                var fromchunk = _this.SonicLevel.GetChunkAt(fromChunkX, fromChunkY);
                                fromchunk.ClearCache();
                                fromchunk.IsOnlyBackground = null;
                                fromchunk.IsOnlyForeground = null;
                                var fromtp = fromchunk.TilePieces[(from.X + x) - fromChunkX * 8][(from.Y + curY) - fromChunkY * 8];
                                tochunk.TilePieces[(to.X + x) - toChunkX * 8][(to.Y + curY) - toChunkY * 8] = fromtp;
                                fromchunk.TilePieces[(from.X + x) - fromChunkX * 8][(from.Y + curY) - fromChunkY * 8] = totp;
                            }
                        }, (from.Height - y) * 50);
                    };
                    for (var y = from.Height; y >= 0; y--) {
                        _loop_2(y);
                    }
                };
                SonicManager.prototype.CacheTiles = function () {
                    console.time("tileCache");
                    this.TilePaletteAnimationManager = new TilePaletteAnimationManager_1.TilePaletteAnimationManager(this);
                    this.TileAnimationManager = new TileAnimationManager_1.TileAnimationManager(this);
                    for (var _i = 0, _a = this.SonicLevel.TileChunks; _i < _a.length; _i++) {
                        var chunk = _a[_i];
                        chunk.InitCache();
                        chunk.WarmCache();
                    }
                    console.timeEnd("tileCache");
                    if (this.sonicToon != null) {
                        console.time("collisionCache");
                        for (var _b = 0, _c = this.SonicLevel.TileChunks; _b < _c.length; _b++) {
                            var chunk = _c[_b];
                            this.sonicToon.SensorManager.BuildChunk(chunk, false);
                            this.sonicToon.SensorManager.BuildChunk(chunk, true);
                        }
                        console.timeEnd("collisionCache");
                    }
                    if (false) {
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
                        for (var index = dropOffIndex; index < this.SonicLevel.TileChunks.length; index++) {
                            var chunk = this.SonicLevel.TileChunks[index];
                            var canvasCache = chunk.Debug_DrawCache();
                            totalHeight += canvasCache.Canvas.height;
                            debugCanvases.push(canvasCache);
                            if (totalHeight > 10000) {
                                dropOffIndex = index + 1;
                                broke = true;
                                break;
                            }
                        }
                        var bigOne = CanvasInformation_7.CanvasInformation.Create(numWide * 128, totalHeight, false);
                        var currentPosition = 0;
                        for (var index = 0; index < debugCanvases.length; index++) {
                            var canvasInformation = debugCanvases[index];
                            bigOne.Context.drawImage(canvasInformation.Canvas, 0, currentPosition);
                            currentPosition += canvasInformation.Canvas.height;
                        }
                        pieces.push(bigOne.Canvas.toDataURL());
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
                    for (var _i = 0, _a = this.SonicLevel.Objects; _i < _a.length; _i++) {
                        var t = _a[_i];
                        var state_3 = _loop_3();
                        if (state_3 === "continue") continue;
                    }
                };
                SonicManager.prototype.downloadObjects = function (objects) {
                    SonicEngine_1.SonicEngine.Instance.Client.emit("GetObjects", objects);
                };
                SonicManager.prototype.Load = function (sonicLevel) {
                    var _this = this;
                    this.Loading = true;
                    this.SonicLevel = new SonicLevel_1.SonicLevel();
                    for (var n = 0; n < sonicLevel.Rings.length; n++) {
                        this.SonicLevel.Rings[n] = new Ring_2.Ring(true);
                        this.SonicLevel.Rings[n].X = sonicLevel.Rings[n].X;
                        this.SonicLevel.Rings[n].Y = sonicLevel.Rings[n].Y;
                    }
                    this.SonicLevel.LevelWidth = sonicLevel.ForegroundWidth;
                    this.SonicLevel.LevelHeight = sonicLevel.ForegroundHeight;
                    this.SonicLevel.ChunkMap = sonicLevel.Foreground;
                    this.SonicLevel.BGChunkMap = sonicLevel.Background;
                    for (var l = 0; l < sonicLevel.Objects.length; l++) {
                        this.SonicLevel.Objects[l] = new LevelObjectInfo_1.LevelObjectInfo(sonicLevel.Objects[l]);
                        this.SonicLevel.Objects[l].Index = l;
                    }
                    var objectKeys = new Array();
                    this.SonicLevel.Objects.forEach(function (t) {
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
                        this.SonicLevel.Tiles[j] = new Tile_1.Tile(mfc);
                        this.SonicLevel.Tiles[j].Index = j;
                    }
                    var acs = this.SonicLevel.AnimatedChunks = new Array();
                    if (sonicLevel.AnimatedFiles) {
                        this.SonicLevel.AnimatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
                        for (var animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                            var animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                            this.SonicLevel.AnimatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
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
                                tile.IsTileAnimated = true;
                                tile.Index = filePiece * 10000 + animatedFileIndex;
                                this.SonicLevel.AnimatedTileFiles[animatedFileIndex][filePiece] = tile;
                            }
                        }
                    }
                    for (var j = 0; j < sonicLevel.Blocks.length; j++) {
                        var fc = sonicLevel.Blocks[j];
                        var mj = new TilePiece_1.TilePiece();
                        mj.Index = j;
                        mj.Tiles = new Array();
                        for (var p = 0; p < fc.length; p++) {
                            mj.Tiles.push(Help_6.Help.Merge(new TileInfo_1.TileInfo(), {
                                _Tile: fc[p].Tile,
                                Index: p,
                                Palette: fc[p].Palette,
                                Priority: fc[p].Priority,
                                XFlip: fc[p].XFlip,
                                YFlip: fc[p].YFlip
                            }));
                        }
                        mj.Init();
                        this.SonicLevel.TilePieces[j] = mj;
                    }
                    this.SonicLevel.Angles = sonicLevel.Angles;
                    this.SonicLevel.TileAnimations = sonicLevel.Animations.map(function (a) { return Help_6.Help.Merge(new TileAnimationData_1.TileAnimationData(), {
                        AnimationTileFile: a.AnimationFile,
                        AnimationTileIndex: a.AnimationTileIndex,
                        AutomatedTiming: a.AutomatedTiming,
                        NumberOfTiles: a.NumberOfTiles,
                        DataFrames: a.Frames.map(function (b) { return Help_6.Help.Merge(new TileAnimationData_1.TileAnimationDataFrame(), { Ticks: b.Ticks, StartingTileIndex: b.StartingTileIndex }); }).slice(0)
                    }); });
                    this.SonicLevel.CollisionIndexes1 = sonicLevel.CollisionIndexes1;
                    this.SonicLevel.CollisionIndexes2 = sonicLevel.CollisionIndexes2;
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
                            this.SonicLevel.HeightMaps[i] = HeightMap_2.HeightMap.FullHeight(false);
                        else if (b2)
                            this.SonicLevel.HeightMaps[i] = HeightMap_2.HeightMap.FullHeight(true);
                        else
                            this.SonicLevel.HeightMaps[i] = new HeightMap_2.HeightMap(sonicLevel.HeightMaps[i], i);
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
                            mj.TilePieces[p % 8][(p / 8) | 0] = Help_6.Help.Merge(new TilePieceInfo_1.TilePieceInfo(), {
                                Index: p,
                                Block: fc[p].Block,
                                Solid1: fc[p].Solid1,
                                Solid2: fc[p].Solid2,
                                XFlip: fc[p].XFlip,
                                YFlip: fc[p].YFlip
                            });
                        }
                        this.SonicLevel.TileChunks[j] = mj;
                        mj.TileAnimations = {};
                        for (var tpX = 0; tpX < mj.TilePieces.length; tpX++) {
                            for (var tpY = 0; tpY < mj.TilePieces[tpX].length; tpY++) {
                                var pm = mj.TilePieces[tpX][tpY].GetTilePiece();
                                if (pm != null) {
                                    for (var _i = 0, _a = pm.Tiles; _i < _a.length; _i++) {
                                        var mjc = _a[_i];
                                        var fa = this.containsAnimatedTile(mjc._Tile, this.SonicLevel);
                                        if (fa) {
                                            mj.TileAnimations[tpY * 8 + tpX] = fa;
                                            acs[j] = mj;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.SonicLevel.Palette = sonicLevel.Palette.map(function (a) { return a.map(function (b) { return "#" + b; }); });
                    this.SonicLevel.StartPositions = sonicLevel.StartPositions.map(function (a) { return new Utils_10.Point(a.X, a.Y); });
                    this.SonicLevel.AnimatedPalettes = new Array();
                    if (sonicLevel.PaletteItems.length > 0) {
                        for (var k = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                            var pal = sonicLevel.PaletteItems[0][k];
                            this.SonicLevel.AnimatedPalettes.push(Help_6.Help.Merge(new SonicLevel_1.PaletteItem(), {
                                Palette: eval(pal.Palette).map(function (b) { return "#" + b; }),
                                SkipIndex: pal.SkipIndex,
                                TotalLength: pal.TotalLength,
                                Pieces: pal.Pieces.map(function (a) { return Help_6.Help.Merge(new SonicLevel_1.PaletteItemPieces(), {
                                    PaletteIndex: a.PaletteIndex,
                                    PaletteMultiply: a.PaletteMultiply,
                                    PaletteOffset: a.PaletteOffset
                                }); })
                            }));
                        }
                    }
                    for (var _b = 0, _c = this.SonicLevel.TilePieces; _b < _c.length; _b++) {
                        var tilePiece = _c[_b];
                        tilePiece.AnimatedPaletteIndexes = new Array();
                        tilePiece.AnimatedTileIndexes = new Array();
                        if (this.SonicLevel.AnimatedPalettes.length > 0) {
                            for (var _d = 0, _e = tilePiece.Tiles; _d < _e.length; _d++) {
                                var mj = _e[_d];
                                var tile = mj.GetTile();
                                if (tile) {
                                    tile.AnimatedPaletteIndexes = new Array();
                                    var pl = tile.GetAllPaletteIndexes();
                                    tile.PaletteIndexesToBeAnimated = {};
                                    tile.AnimatedTileIndexes = new Array();
                                    for (var tileAnimationIndex = 0; tileAnimationIndex < this.SonicLevel.TileAnimations.length; tileAnimationIndex++) {
                                        var tileAnimationData = this.SonicLevel.TileAnimations[tileAnimationIndex];
                                        var anin = tileAnimationData.AnimationTileIndex;
                                        var num = tileAnimationData.NumberOfTiles;
                                        if (tile.Index >= anin && tile.Index < anin + num) {
                                            tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                            tile.AnimatedTileIndexes.push(tileAnimationIndex);
                                        }
                                    }
                                    for (var animatedPaletteIndex = 0; animatedPaletteIndex < this.SonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
                                        var pal = this.SonicLevel.AnimatedPalettes[animatedPaletteIndex];
                                        tile.PaletteIndexesToBeAnimated[animatedPaletteIndex] = new Array();
                                        var _loop_4 = function(mjce) {
                                            var mje1 = mjce;
                                            if (mj.Palette == mje1.PaletteIndex) {
                                                if (pl.filter(function (j) { return j == (mje1.PaletteOffset / 2 | 0) || j == (mje1.PaletteOffset / 2 | 0) + 1; }).length > 0) {
                                                    tilePiece.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                                    tile.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                                    for (var _f = 0, pl_1 = pl; _f < pl_1.length; _f++) {
                                                        var pIndex = pl_1[_f];
                                                        if (pIndex == (mje1.PaletteOffset / 2 | 0) || pIndex == (mje1.PaletteOffset / 2 | 0) + 1) {
                                                            tile.PaletteIndexesToBeAnimated[animatedPaletteIndex].push(pIndex);
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
                        _this.Loading = false;
                    });
                    this.PreloadSprites(function () {
                        finished();
                        _this.ForceResize();
                    }, function (s) {
                    });
                    this.ForceResize();
                    this.OnLevelLoad && this.OnLevelLoad(this.SonicLevel);
                };
                SonicManager._cachedOffs = {};
                return SonicManager;
            }());
            exports_36("SonicManager", SonicManager);
        }
    }
});
/// <reference path="../../typings/keyboardjs.d.ts" />
/// <reference path="../../typings/socket.io-client.d.ts" />
System.register("Game/SonicEngine", ["Common/CanvasInformation", "Game/SonicManager", "Common/Enums", "Common/Utils", "Game/Sonic/Sonic", "Common/Help"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
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
                    this.WideScreen = true;
                    SonicEngine.Instance = this;
                    var gameCanvasName = "gameLayer";
                    this.gameCanvas = CanvasInformation_8.CanvasInformation.CreateFromElement(document.getElementById(gameCanvasName), 0, 0, true);
                    this.canvasWidth = 0;
                    this.canvasHeight = 0;
                    this.bindInput();
                    this.fullscreenMode = true;
                    window.addEventListener("resize", function (e) { return _this.resizeCanvas(true); });
                    jQuery(document).resize(function (e) { return _this.resizeCanvas(true); });
                    this.sonicManager = new SonicManager_16.SonicManager(this, this.gameCanvas, function () { return _this.resizeCanvas(true); });
                    this.sonicManager.IndexedPalette = 0;
                    window.setInterval(function () { return _this.sonicManager.Tick(); }, 1000 / 60);
                    window.setInterval(function () { return _this.GameDraw(); }, 1000 / 60);
                    this.resizeCanvas(true);
                }
                SonicEngine.prototype.bindInput = function () {
                    var _this = this;
                    this.gameCanvas.DomCanvas.mousedown(function (e) { return _this.canvasOnClick(e); });
                    this.gameCanvas.DomCanvas.mouseup(function (e) { return _this.canvasMouseUp(e); });
                    this.gameCanvas.DomCanvas.mousemove(function (e) { return _this.canvasMouseMove(e); });
                    this.gameCanvas.DomCanvas.bind("touchstart", function (e) { return _this.canvasOnClick(e); });
                    this.gameCanvas.DomCanvas.bind("touchend", function (e) { return _this.canvasMouseUp(e); });
                    this.gameCanvas.DomCanvas.bind("touchmove", function (e) { return _this.canvasMouseMove(e); });
                    this.gameCanvas.DomCanvas.bind("contextmenu", function (e) { return e.preventDefault(); });
                    keyboardJS.bind("f", function () {
                        _this.sonicManager.ShowHeightMap = !_this.sonicManager.ShowHeightMap;
                    }, function () {
                    });
                    keyboardJS.bind("o", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            _this.sonicManager.InHaltMode = !_this.sonicManager.InHaltMode;
                    }, function () {
                    });
                    keyboardJS.bind("1", function () {
                        _this.sonicManager.IndexedPalette++;
                        _this.sonicManager.ClearCache();
                    }, function () {
                    });
                    keyboardJS.bind("q", function () {
                        _this.runGame();
                    }, function () {
                    });
                    keyboardJS.bind("p", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            if (_this.sonicManager.InHaltMode)
                                _this.sonicManager.waitingForTickContinue = false;
                    }, function () {
                    });
                    keyboardJS.bind("h", function () {
                        if (_this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            _this.sonicManager.sonicToon.Hit(_this.sonicManager.sonicToon.X, _this.sonicManager.sonicToon.Y);
                    }, function () {
                    });
                    keyboardJS.bind("u", function () {
                        _this.WideScreen = !_this.WideScreen;
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
                                _this.sonicManager.windowLocation.Y -= 128;
                                _this.sonicManager.BigWindowLocation.Y -= 128;
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
                                _this.sonicManager.windowLocation.Y += 128;
                                _this.sonicManager.BigWindowLocation.Y += 128;
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
                                _this.sonicManager.windowLocation.X -= 128;
                                _this.sonicManager.BigWindowLocation.X -= 128;
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
                                _this.sonicManager.windowLocation.X += 128;
                                _this.sonicManager.BigWindowLocation.X += 128;
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
                        _this.sonicManager.SonicLevel.CurHeightMap = !_this.sonicManager.SonicLevel.CurHeightMap;
                    }, function () {
                    });
                    setTimeout(function () {
                        _this.Client.emit("LoadLevel.Request", { Data: 'Angel Island Zone Act 1' });
                        //            if (neverGot) {
                        //            this.LoadLevel((<any>window).STATICLEVEL);
                        //        }
                    }, 1);
                    this.Client = io.connect("159.203.118.77:8998");
                    this.Client.on("LoadLevel.Response", function (data) {
                        _this.LoadLevel(data.Data);
                    });
                    this.Client.on("GetObjects.Response", function (data) {
                        _this.sonicManager.loadObjects(data.Data);
                    });
                };
                SonicEngine.prototype.LoadLevel = function (data) {
                    var l = JSON.parse(Help_7.Help.DecodeString(data));
                    SonicEngine.Instance.RunSonic(l);
                };
                SonicEngine.prototype.RunSonic = function (level) {
                    this.sonicManager.ClearCache();
                    this.sonicManager.Load(level);
                    this.sonicManager.windowLocation.X = 0;
                    this.sonicManager.windowLocation.Y = 0;
                    this.sonicManager.BigWindowLocation.X = (this.sonicManager.windowLocation.X - this.sonicManager.windowLocation.Width * 0.2) | 0;
                    this.sonicManager.BigWindowLocation.Y = (this.sonicManager.windowLocation.Y - this.sonicManager.windowLocation.Height * 0.2) | 0;
                    this.sonicManager.BigWindowLocation.Width = (this.sonicManager.windowLocation.Width * 1.8) | 0;
                    this.sonicManager.BigWindowLocation.Height = (this.sonicManager.windowLocation.Height * 1.8) | 0;
                    var dl = Help_7.Help.GetQueryString();
                    if (dl["run"]) {
                        if (this.sonicManager.currentGameState == Enums_8.GameState.Playing)
                            this.runGame();
                        this.runGame();
                    }
                    this.sonicManager.CacheTiles();
                };
                SonicEngine.prototype.runGame = function () {
                    var sonicManager = SonicManager_16.SonicManager.Instance;
                    switch (sonicManager.currentGameState) {
                        case Enums_8.GameState.Playing:
                            sonicManager.currentGameState = Enums_8.GameState.Editing;
                            sonicManager.scale = new Utils_11.Point(4, 4);
                            sonicManager.windowLocation = Help_7.Help.DefaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                            sonicManager.sonicToon = null;
                            break;
                        case Enums_8.GameState.Editing:
                            sonicManager.currentGameState = Enums_8.GameState.Playing;
                            sonicManager.scale = new Utils_11.Point(4, 4);
                            sonicManager.windowLocation = Help_7.Help.DefaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                            sonicManager.sonicToon = new Sonic_1.Sonic();
                            break;
                    }
                    sonicManager.DestroyCanvases();
                    sonicManager.ResetCanvases();
                };
                SonicEngine.prototype.canvasMouseMove = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.MouseMove(queryEvent);
                };
                SonicEngine.prototype.canvasOnClick = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.OnClick(queryEvent);
                };
                SonicEngine.prototype.canvasMouseUp = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.MouseUp(queryEvent);
                };
                SonicEngine.prototype.resizeCanvas = function (resetOverride) {
                    this.canvasWidth = $(window).width();
                    this.canvasHeight = $(window).height();
                    this.sonicManager.windowLocation = Help_7.Help.DefaultWindowLocation(this.sonicManager.currentGameState, this.sonicManager.scale);
                    var wide = new Utils_11.DoublePoint((this.canvasWidth / 320 / this.sonicManager.scale.X), (this.canvasHeight / 224 / this.sonicManager.scale.Y));
                    var even = new Utils_11.DoublePoint(Math.min((this.canvasWidth / 320 / this.sonicManager.scale.X), (this.canvasHeight / 224 / this.sonicManager.scale.Y)), Math.min((this.canvasWidth / 320 / this.sonicManager.scale.X), (this.canvasHeight / 224 / this.sonicManager.scale.Y)));
                    this.sonicManager.RealScale = !this.fullscreenMode ? new Utils_11.DoublePoint(1, 1) : (this.WideScreen ? wide : even);
                    if (resetOverride || this.sonicManager.overrideRealScale == null)
                        this.sonicManager.overrideRealScale = Utils_11.DoublePoint.create(this.sonicManager.RealScale);
                    else
                        this.sonicManager.RealScale = Utils_11.DoublePoint.create(this.sonicManager.overrideRealScale);
                    this.gameCanvas.DomCanvas.attr("width", (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == Enums_8.GameState.Playing ? this.sonicManager.scale.X * this.sonicManager.RealScale.X : 1)).toString());
                    this.gameCanvas.DomCanvas.attr("height", (this.sonicManager.windowLocation.Height * (this.sonicManager.currentGameState == Enums_8.GameState.Playing ? this.sonicManager.scale.Y * this.sonicManager.RealScale.Y : 1)).toString());
                    this.gameGoodWidth = (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == Enums_8.GameState.Playing ? this.sonicManager.scale.X * this.sonicManager.RealScale.X : 1));
                    var screenOffset = this.sonicManager.currentGameState == Enums_8.GameState.Playing ? new Utils_11.DoublePoint(((this.canvasWidth / 2 - this.sonicManager.windowLocation.Width * this.sonicManager.scale.X * this.sonicManager.RealScale.X / 2)), (this.canvasHeight / 2 - this.sonicManager.windowLocation.Height * this.sonicManager.scale.Y * this.sonicManager.RealScale.Y / 2)) : new Utils_11.DoublePoint(0, 0);
                    this.gameCanvas.DomCanvas.css("left", screenOffset.X + 'px');
                    this.gameCanvas.DomCanvas.css("top", screenOffset.Y + 'px');
                    this.sonicManager.DestroyCanvases();
                    this.sonicManager.ResetCanvases();
                };
                SonicEngine.prototype.Clear = function (canv) {
                    var w;
                    canv.DomCanvas[0].width = this.gameGoodWidth;
                    this.gameCanvas.Context.imageSmoothingEnabled = false;
                };
                SonicEngine.prototype.GameDraw = function () {
                    this.sonicManager.MainDraw(this.gameCanvas);
                };
                return SonicEngine;
            }());
            exports_37("SonicEngine", SonicEngine);
        }
    }
});
/// <reference path="../typings/Compress.d.ts" />
System.register("main", ["Game/SonicEngine"], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var SonicEngine_2;
    var Main;
    return {
        setters:[
            function (SonicEngine_2_1) {
                SonicEngine_2 = SonicEngine_2_1;
            }],
        execute: function() {
            Main = (function () {
                function Main() {
                }
                Main.run = function () {
                    var j = (window.STATICLEVEL);
                    var message = new Compressor().DecompressText(j);
                    var sl = JSON.parse(message);
                    new SonicEngine_2.SonicEngine();
                };
                return Main;
            }());
            exports_38("Main", Main);
            Main.run();
        }
    }
});
