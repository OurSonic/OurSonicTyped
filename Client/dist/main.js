System.register(["./game/SonicEngine", '@angular/core', '@angular/platform-browser', './layout/Layout', "./layout/objectSelector/ObjectSelector", "./layout/levelSelector/LevelSelector", "./layout/windowComponent/WindowComponent", "./layout/directives/draggableDirective", '@angular/platform-browser-dynamic', '@angular/http'], function(exports_1, context_1) {
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
    var SonicEngine_1, core_1, platform_browser_1, Layout_1, ObjectSelector_1, LevelSelector_1, WindowComponent_1, draggableDirective_1, platform_browser_dynamic_1, http_1;
    var platform, AppModule;
    return {
        setters:[
            function (SonicEngine_1_1) {
                SonicEngine_1 = SonicEngine_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (Layout_1_1) {
                Layout_1 = Layout_1_1;
            },
            function (ObjectSelector_1_1) {
                ObjectSelector_1 = ObjectSelector_1_1;
            },
            function (LevelSelector_1_1) {
                LevelSelector_1 = LevelSelector_1_1;
            },
            function (WindowComponent_1_1) {
                WindowComponent_1 = WindowComponent_1_1;
            },
            function (draggableDirective_1_1) {
                draggableDirective_1 = draggableDirective_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            platform = platform_browser_dynamic_1.platformBrowserDynamic();
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, http_1.HttpModule],
                        declarations: [Layout_1.Layout, ObjectSelector_1.ObjectSelector, LevelSelector_1.LevelSelector, WindowComponent_1.WindowComponent, draggableDirective_1.DraggableDirective],
                        bootstrap: [Layout_1.Layout]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            exports_1("AppModule", AppModule);
            platform.bootstrapModule(AppModule);
            new SonicEngine_1.SonicEngine();
        }
    }
});
