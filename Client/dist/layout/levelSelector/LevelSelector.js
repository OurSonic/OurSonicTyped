System.register(['@angular/core', "../services/LevelService", "../../game/SonicEngine"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, LevelService_1, SonicEngine_1;
    var LevelSelector;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (LevelService_1_1) {
                LevelService_1 = LevelService_1_1;
            },
            function (SonicEngine_1_1) {
                SonicEngine_1 = SonicEngine_1_1;
            }],
        execute: function() {
            LevelSelector = (function () {
                function LevelSelector(_levelService) {
                    this._levelService = _levelService;
                    this.loading = false;
                    this.isMinimized = false;
                }
                LevelSelector.prototype.ngOnInit = function () {
                    var _this = this;
                    this._levelService.getLevels().subscribe(function (levels) {
                        _this.levels = levels;
                    });
                };
                LevelSelector.prototype.loadLevel = function (level) {
                    var _this = this;
                    this.loading = true;
                    this._levelService.getLevel(level.name).subscribe(function (level) {
                        SonicEngine_1.SonicEngine.instance.LoadLevel(level);
                        _this.isMinimized = true;
                        _this.loading = false;
                    });
                };
                LevelSelector.prototype.closedWindow = function (done) {
                    console.log(done);
                };
                LevelSelector = __decorate([
                    core_1.Component({
                        selector: 'level-selector',
                        templateUrl: 'app/layout/levelSelector/levelSelector.html',
                        //    viewProviders: [WindowComponent],
                        providers: [LevelService_1.LevelService]
                    }), 
                    __metadata('design:paramtypes', [LevelService_1.LevelService])
                ], LevelSelector);
                return LevelSelector;
            }());
            exports_1("LevelSelector", LevelSelector);
        }
    }
});
//# sourceMappingURL=LevelSelector.js.map