/// <reference path="../typings/Compress.d.ts" />


import {SLData} from "./SLData";
import {SonicEngine} from "./Game/SonicEngine";

export class Main {
    static run() {
        var j: string = ((<any>window).STATICLEVEL);
        var message = new Compressor().DecompressText(j);
        var sl: SLData = JSON.parse(message);
        new SonicEngine();
    }
}

Main.run();