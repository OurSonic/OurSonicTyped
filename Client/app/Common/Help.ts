import {Point } from "Utils";
import {CanvasInformation  } from "CanvasInformation";
import {Color} from "Color";
import {SonicImage} from "../Game/Level/SonicImage";

export class Help {
    private static cos_table: number[] = new Array(1.00000, 0.99970, 0.99880, 0.99729, 0.99518, 0.99248, 0.98918, 0.98528,
        0.98079, 0.97570, 0.97003, 0.96378, 0.95694, 0.94953, 0.94154, 0.93299,
        0.92388, 0.91421, 0.90399, 0.89322, 0.88192, 0.87009, 0.85773, 0.84485,
        0.83147, 0.81758, 0.80321, 0.78835, 0.77301, 0.75721, 0.74095, 0.72425,
        0.70711, 0.68954, 0.67156, 0.65317, 0.63439, 0.61523, 0.59570, 0.57581,
        0.55557, 0.53500, 0.51410, 0.49290, 0.47140, 0.44961, 0.42755, 0.40524,
        0.38268, 0.35990, 0.33689, 0.31368, 0.29028, 0.26671, 0.24298, 0.21910,
        0.19509, 0.17096, 0.14673, 0.12241, 0.09802, 0.07356, 0.04907, 0.02454,
        0.00000, -0.02454, -0.04907, -0.07356, -0.09802, -0.12241, -0.14673, -0.17096,
        -0.19509, -0.21910, -0.24298, -0.26671, -0.29028, -0.31368, -0.33689, -0.35990,
        -0.38268, -0.40524, -0.42755, -0.44961, -0.47140, -0.49290, -0.51410, -0.53500,
        -0.55557, -0.57581, -0.59570, -0.61523, -0.63439, -0.65317, -0.67156, -0.68954,
        -0.70711, -0.72425, -0.74095, -0.75721, -0.77301, -0.78835, -0.80321, -0.81758,
        -0.83147, -0.84485, -0.85773, -0.87009, -0.88192, -0.89322, -0.90399, -0.91421,
        -0.92388, -0.93299, -0.94154, -0.94953, -0.95694, -0.96378, -0.97003, -0.97570,
        -0.98079, -0.98528, -0.98918, -0.99248, -0.99518, -0.99729, -0.99880, -0.99970,
        -1.00000, -0.99970, -0.99880, -0.99729, -0.99518, -0.99248, -0.98918, -0.98528,
        -0.98079, -0.97570, -0.97003, -0.96378, -0.95694, -0.94953, -0.94154, -0.93299,
        -0.92388, -0.91421, -0.90399, -0.89322, -0.88192, -0.87009, -0.85773, -0.84485,
        -0.83147, -0.81758, -0.80321, -0.78835, -0.77301, -0.75721, -0.74095, -0.72425,
        -0.70711, -0.68954, -0.67156, -0.65317, -0.63439, -0.61523, -0.59570, -0.57581,
        -0.55557, -0.53500, -0.51410, -0.49290, -0.47140, -0.44961, -0.42756, -0.40524,
        -0.38268, -0.35990, -0.33689, -0.31368, -0.29028, -0.26671, -0.24298, -0.21910,
        -0.19509, -0.17096, -0.14673, -0.12241, -0.09802, -0.07356, -0.04907, -0.02454,
        -0.00000, 0.02454, 0.04907, 0.07356, 0.09802, 0.12241, 0.14673, 0.17096,
        0.19509, 0.21910, 0.24298, 0.26671, 0.29028, 0.31368, 0.33689, 0.35990,
        0.38268, 0.40524, 0.42756, 0.44961, 0.47140, 0.49290, 0.51410, 0.53500,
        0.55557, 0.57581, 0.59570, 0.61523, 0.63439, 0.65317, 0.67156, 0.68954,
        0.70711, 0.72425, 0.74095, 0.75721, 0.77301, 0.78835, 0.80321, 0.81758,
        0.83147, 0.84485, 0.85773, 0.87009, 0.88192, 0.89322, 0.90399, 0.91421,
        0.92388, 0.93299, 0.94154, 0.94953, 0.95694, 0.96378, 0.97003, 0.97570,
        0.98079, 0.98528, 0.98918, 0.99248, 0.99518, 0.99729, 0.99880, 0.99970);
    public static toPx(number: number): string {
        return number + "px";
    }
    public static sin(f: number): number {
        return Help.cos_table[(f + 0x40) & 0xFF];
    }
    public static cos(f: number): number {
        return Help.cos_table[(f) & 0xFF];
    }
    public static mod(j: number, n: number): number {
        return ((j % n) + n) % n;
    }
    public static scaleSprite(image: HTMLImageElement, scale: Point): CanvasInformation {
        var canv = CanvasInformation.create(image.width * scale.x, image.height * scale.y, true);
        canv.context.save();
        canv.context.scale(scale.x, scale.y);
        canv.context.drawImage(image, 0, 0);
        canv.context.restore();
        return canv;
    }
    public static scalePixelData(scale: Point, data: ImageData): ImageData {
        var Uint8ClampedArray: Uint8ClampedArray = data.data;
        var colors = new Array(Uint8ClampedArray.length / 4);
        for (var f: number = 0; f < Uint8ClampedArray.length; f += 4) {
            colors[f / 4] = (Help.colorObjectFromData(Uint8ClampedArray, f));
        }
        var d = CanvasInformation.create(1, 1, false).context.createImageData(data.width * scale.x, data.height * scale.y);
        Help.setDataFromColors(d.data, colors, scale, data.width, colors[0]);
        return d;
    }
    private static setDataFromColors(data: Uint8ClampedArray, colors: Color[], scale: Point, width: number, transparent: Color): void {
        for (var i: number = 0; i < colors.length; i++) {
            var curX = i % width;
            var curY = i / width;
            var g = colors[i];
            var isTrans = false;
            if (transparent) {
                if (g.r == transparent.r && g.g == transparent.g && g.b == transparent.b)
                    isTrans = true;
            }
            for (var j: number = 0; j < scale.x; j++) {
                for (var k: number = 0; k < scale.y; k++) {
                    var x = (curX * scale.x + j);
                    var y = (curY * scale.y + k);
                    var c = (x + y * (scale.x * width)) * 4;
                    if (isTrans) {
                        data[c + 0] = 0;
                        data[c + 1] = 0;
                        data[c + 2] = 0;
                        data[c + 3] = 0;
                        continue;
                    }
                    data[c] = <number>g.r;
                    data[c + 1] = <number>g.g;
                    data[c + 2] = <number>g.b;
                    data[c + 3] = 255;
                }
            }
        }
    }
    private static getBase64Image(data: ImageData): string {
        var canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;
        var ctx = canvas.getContext("2d");
        ctx.putImageData(data, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }
    private static colorObjectFromData(data: Uint8ClampedArray, c: number): Color {
        var r = <number>data[c];
        var g = <number>data[c + 1];
        var b = <number>data[c + 2];
        var a = <number>data[c + 3];
        return new Color(r, g, b, a);
    }
    public static getImageData(image: HTMLImageElement): ImageData {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        var data = ctx.getImageData(0, 0, image.width, image.height);
        return data;
    }
    public static scaleCsImage(image: SonicImage, scale: Point, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        var df = image.bytes;
        var colors = new Array(df.length);
        for (var f: number = 0; f < df.length; f++) {
            var c = image.palette[df[f]];
            colors[f] = new Color(c[0], c[1], c[2], c[3]);
        }
        var dc = CanvasInformation.create(1, 1, false);
        var d = dc.context.createImageData(image.width * scale.x, image.height * scale.y);
        Help.setDataFromColors(d.data, colors, scale, image.width, colors[0]);
        return Help.loadSprite(Help.getBase64Image(d), complete);
    }
    public static loaded(element: HTMLImageElement, set: boolean = true): void {
        element.setAttribute("loaded", set ? "true" : "false");
    }
    public static loadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        var sprite1 = new HTMLImageElement();
        sprite1.addEventListener("load",
            e => {
                Help.loaded(sprite1);
                if (complete)
                    complete(sprite1);
            },
            false);
        sprite1.src = src;
        return sprite1;
    }
    public static decodeString(lvl: string): string {
        return new Compressor().DecompressText(lvl);
    }
    public static fixAngle(angle: number): number {
        var fixedAng = <number>Math.floor((256 - angle) * 1.4062) % 360;
        var flop = 360 - fixedAng;
        return Help.degToRad(flop);
    }
    public static degToRad(angle: number): number {
        return angle * Math.PI / 180;
    }
    public static sign(m: number): number {
        return m == 0 ? 0 : (m < 0 ? -1 : 1);
    }
    public static floor(spinDashSpeed: number): number {
        if (spinDashSpeed > 0)
            return ~~spinDashSpeed;
        return Math.floor(spinDashSpeed);
    }
    public static max(f1: number, f2: number): number {
        return f1 < f2 ? f2 : f1;
    }
    public static min(f1: number, f2: number): number {
        return f1 > f2 ? f2 : f1;
    }
    public static clone<T>(o: T): T {
        return null;
    }
    public static getCursorPosition(ev: JQueryEventObject): Point {
        if (ev.originalEvent && (<any>ev.originalEvent).targetTouches && (<any>ev.originalEvent).targetTouches.length > 0)
            ev = (<any>ev.originalEvent).targetTouches[0];
        if (ev.pageX && ev.pageY)
            return new Point(ev.pageX, ev.pageY);
        return new Point(ev.clientX, ev.clientY/*, 0, ev.Which == 3*/);
    }

    public static stringify(obj: Object): string {
        return JSON.stringify(obj,
            (key, value) => {
                if (key.indexOf("$") == 0)
                    return undefined;
                if (key == "image")
                    return undefined;
                if (key == "imageData")
                    return undefined;
                if (key == "oldScale")
                    return undefined;
                if (key == "sprite")
                    return undefined;
                if (key == "sprites")
                    return undefined;
                if (key == "index")
                    return undefined;
                if (key == "_style")
                    return undefined;
                else return value;
            });
    }
    public static safeResize(block: CanvasInformation, width: number, height: number): CanvasInformation {
        var m = CanvasInformation.create(width, height, false);
        m.context.drawImage(block.canvas, 0, 0);
        return m;
    }
    public static getQueryString(): { [key: string]: string } {
        var result: { [key: string]: string } = {};
        var queryString: string = window.location.search.substring(1);
        var re = new RegExp("/([^&=]+)=([^&]*)/g");
        var m;
        while ((m = re.exec(queryString)) != null) {
            result[(<any>window).decodeURIComponent(m[1])] = (<any>window).decodeURIComponent(m[2]);
        }
        return result;
    }

    static merge<T>(base: T, update: T):T {
        for (var i in update) {
            base[i] = update[i];
        }
        return base;
    }
}