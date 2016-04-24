/// <reference path="../typings/Compress.d.ts" />

import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './Layout/app.component';

import {SonicEngine} from "./Game/SonicEngine";

export class Main {
    static run() {
        new SonicEngine();
        bootstrap(AppComponent);
    }
}

Main.run();