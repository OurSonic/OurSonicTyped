///<reference path="../../typings/Compress.d.ts"/>
System.register(["./Utils", "./CanvasInformation", "./Color", "./Enums", "../game/SonicManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("Help", Help);
        }
    }
});
