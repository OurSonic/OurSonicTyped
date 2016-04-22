/// <reference path="/typings/Compress.d.ts" />
/// <reference path="/typings/jQuery.d.ts" />


class Main {
    static run() {
        var j:string = ((<any>window).STATICLEVEL);
        var message = new Compressor().DecompressText(j);
        console.log(message)

    }
}

Main.run();