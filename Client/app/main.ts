/// <reference path="../typings/Compress.d.ts" />


import {SLData} from "./SLData";
import {SonicEngine} from "./Game/SonicEngine";

export class Main {
    static run() {
        let j: string = ((<any>window).STATICLEVEL);
        let message = new Compressor().DecompressText(j);
        let sl: SLData = JSON.parse(message);
        new SonicEngine();
    }
}

Main.run();