/// <reference path="../typings/Compress.d.ts" /> 
import {SonicEngine} from "./game/SonicEngine";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Layout} from './layout/Layout';
import {ObjectSelector} from "./layout/objectSelector/ObjectSelector";
import {LevelSelector} from "./layout/levelSelector/LevelSelector";
import {DraggableDirective} from "./layout/directives/draggableDirective";
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {HttpModule} from '@angular/http';
import {TileChunkLayout} from "./layout/tileChunkLayout/TileChunkLayout";
import {TilePieceLayout} from "./layout/tilePieceLayout/TilePieceLayout";
import {TileLayout} from "./layout/tileLayout/TileLayout";
import {AnimatedTileLayout} from "./layout/animatedTileLayout/AnimatedTileLayout";

const platform = platformBrowserDynamic();


@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [Layout, ObjectSelector, TileChunkLayout,TilePieceLayout,TileLayout,AnimatedTileLayout, LevelSelector, DraggableDirective],
    bootstrap: [Layout]
})
export class AppModule {
    constructor() {
        setTimeout(() => {
            new SonicEngine();
        }, 1)
    }
}

platform.bootstrapModule(AppModule);


