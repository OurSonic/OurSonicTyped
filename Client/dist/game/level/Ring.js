System.register(["../../common/Utils", "../SonicManager", "../../common/Enums"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Utils_1, SonicManager_1, Enums_1;
    var Ring;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
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
                        var wl = SonicManager_1.SonicManager.instance.windowLocation;
                        if (this.x < wl.x || this.y < wl.y || this.x > wl.x + wl.Width || this.y > wl.y + wl.Height) {
                            this.TickCount = 0xfffffff;
                            return;
                        }
                        if (SonicManager_1.SonicManager.instance.drawTickCount > SonicManager_1.SonicManager.instance.sonicToon.sonicLastHitTick + 64 && Utils_1.IntersectingRectangle.IntersectsRect(SonicManager_1.SonicManager.instance.sonicToon.myRec, new Utils_1.Rectangle(this.x - 8, this.y - 8, 8 * 2, 2 * 8))) {
                            this.TickCount = 0xfffffff;
                            SonicManager_1.SonicManager.instance.sonicToon.rings++;
                            return;
                        }
                        this.TickCount++;
                    }
                    if (SonicManager_1.SonicManager.instance.currentGameState == Enums_1.GameState.Playing)
                        this.AnimationIndex = ((SonicManager_1.SonicManager.instance.drawTickCount % ((this.Active ? 4 : 8) * 4)) / (this.Active ? 4 : 8)) | 0;
                    else
                        this.AnimationIndex = 0;
                    var sprites = null;
                    if (SonicManager_1.SonicManager.instance.spriteCache.Rings)
                        sprites = SonicManager_1.SonicManager.instance.spriteCache.Rings;
                    else
                        throw ("bad ring animation");
                    var sps = sprites[this.AnimationIndex];
                    canvas.drawImage(sps.canvas, (pos.x - 8), (pos.y - 8));
                };
                return Ring;
            }(Utils_1.Point));
            exports_1("Ring", Ring);
        }
    }
});
