///<reference path="../../typings/jQuery.d.ts"/>
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("CanvasInformation", CanvasInformation);
        }
    }
});
