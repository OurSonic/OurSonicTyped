System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("SonicImage", SonicImage);
        }
    }
});
//# sourceMappingURL=SonicImage.js.map