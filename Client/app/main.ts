import {SLData} from "./SLData";

class Main {
    static run() {
        var j:string = ((<any>window).STATICLEVEL);
        var message = new Compressor().DecompressText(j);
        var sl:SLData=JSON.parse(message);
    }
}

Main.run();