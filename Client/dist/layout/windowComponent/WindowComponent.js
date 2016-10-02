System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var WindowComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            WindowComponent = (function () {
                function WindowComponent(el) {
                    this.onclose = new core_1.EventEmitter();
                    this.visible = true;
                }
                WindowComponent.prototype.minimize = function () {
                    this.isMinimized = !this.isMinimized;
                };
                WindowComponent.prototype.maximize = function () {
                    this.visible = false;
                };
                WindowComponent.prototype.close = function () {
                    this.visible = false;
                    this.onclose.emit(true);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], WindowComponent.prototype, "visible", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "width", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "height", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "left", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "top", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], WindowComponent.prototype, "windowTitle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], WindowComponent.prototype, "isMinimized", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], WindowComponent.prototype, "onclose", void 0);
                WindowComponent = __decorate([
                    core_1.Component({
                        selector: 'window',
                        templateUrl: 'app/layout/windowComponent/windowComponent.html',
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], WindowComponent);
                return WindowComponent;
            }());
            exports_1("WindowComponent", WindowComponent);
        }
    }
});
//# sourceMappingURL=WindowComponent.js.map