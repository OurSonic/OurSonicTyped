/// <reference path="../typings/Compress.d.ts" /> 
import {SonicEngine} from "./game/SonicEngine";
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Layout }   from './layout/Layout';
import {ObjectSelector} from "./layout/objectSelector/ObjectSelector";
import {LevelSelector} from "./layout/levelSelector/LevelSelector";
import {TileAnimationLayout} from "./layout/tileAnimationLayout/TileAnimationLayout";
import {DraggableDirective} from "./layout/directives/draggableDirective";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {HttpModule } from '@angular/http';

const platform = platformBrowserDynamic();


@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [Layout, ObjectSelector,TileAnimationLayout, LevelSelector,  DraggableDirective],
    bootstrap: [Layout]
})
export class AppModule {
    constructor(){
        setTimeout(()=>{
            new SonicEngine();
        },1)
    }
}
platform.bootstrapModule(AppModule);


