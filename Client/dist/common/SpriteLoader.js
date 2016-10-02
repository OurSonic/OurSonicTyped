System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("SpriteLoader", SpriteLoader);
            SpriteLoaderStep = (function () {
                function SpriteLoaderStep(title, method, onFinish) {
                    this.Title = title;
                    this.Method = method;
                    this.OnFinish = onFinish;
                    this.Iterations = new Array();
                }
                return SpriteLoaderStep;
            }());
            exports_1("SpriteLoaderStep", SpriteLoaderStep);
        }
    }
});
//# sourceMappingURL=SpriteLoader.js.map