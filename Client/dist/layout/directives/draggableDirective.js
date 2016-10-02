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
    var DraggableDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DraggableDirective = (function () {
                function DraggableDirective(el) {
                    setTimeout(function () {
                        $(el.nativeElement).drags({ handle: '.window-header' });
                    }, 1);
                }
                DraggableDirective = __decorate([
                    core_1.Directive({
                        selector: '[draggable]'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], DraggableDirective);
                return DraggableDirective;
            }());
            exports_1("DraggableDirective", DraggableDirective);
        }
    }
});
//# sourceMappingURL=draggableDirective.js.map