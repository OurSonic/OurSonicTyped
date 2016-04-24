/// <reference path="../typings/Compress.d.ts" />

import {bootstrap}    from 'angular2/platform/browser';
import {Layout} from './layout/Layout';

import {SonicEngine} from "./game/SonicEngine";

export class Main {
    static run() {
        new SonicEngine();
        bootstrap(Layout);
    }
}

Main.run();