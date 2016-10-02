System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("Color", Color);
        }
    }
});
//# sourceMappingURL=Color.js.map