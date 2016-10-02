System.register(["../../common/Help"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Help_1;
    var SonicConstants;
    return {
        setters:[
            function (Help_1_1) {
                Help_1 = Help_1_1;
            }],
        execute: function() {
            SonicConstants = (function () {
                function SonicConstants() {
                }
                SonicConstants.Sonic = function () {
                    var sc = Help_1.Help.merge(new SonicConstants(), {
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
            exports_1("SonicConstants", SonicConstants);
        }
    }
});
//# sourceMappingURL=SonicConstants.js.map