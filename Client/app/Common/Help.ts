import {Point, IntersectingRectangle } from "./Utils";
import {CanvasInformation  } from "./CanvasInformation";
import {Color} from "./Color";
import {SonicImage} from "../Game/Level/SonicImage";
import {GameState} from "./Enums";
import {SonicManager} from "../Game/SonicManager";

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
    public static ToPx(number: number): string {
        return number + "px";
    }
    public static Sin(f: number): number {
        return Help.cos_table[(f + 0x40) & 0xFF];
    }
    public static Cos(f: number): number {
        return Help.cos_table[(f) & 0xFF];
    }
    public static Mod(j: number, n: number): number {
        return ((j % n) + n) % n;
    }
    public static ScaleSprite(image: HTMLImageElement, scale: Point): CanvasInformation {
        var canv = CanvasInformation.Create(image.width * scale.X, image.height * scale.Y, true);
        canv.Context.save();
        canv.Context.scale(scale.X, scale.Y);
        canv.Context.drawImage(image, 0, 0);
        canv.Context.restore();
        return canv;
    }
    public static ScalePixelData(scale: Point, data: ImageData): ImageData {
        var Uint8ClampedArray: Uint8ClampedArray = data.data;
        var colors = new Array(Uint8ClampedArray.length / 4|0);
        for (var f: number = 0; f < Uint8ClampedArray.length; f += 4) {
            colors[f / 4|0] = (Help.ColorObjectFromData(Uint8ClampedArray, f));
        }
        var d = CanvasInformation.Create(1, 1, false).Context.createImageData(data.width * scale.X, data.height * scale.Y);
        Help.SetDataFromColors(d.data, colors, scale, data.width, colors[0]);
        return d;
    }
    private static SetDataFromColors(data: Uint8ClampedArray, colors: Color[], scale: Point, width: number, transparent: Color): void {
        for (var i: number = 0; i < colors.length; i++) {
            var curX = i % width;
            var curY = i / width|0;
            var g = colors[i];
            var isTrans = false;
            if (transparent) {
                if (g.R == transparent.R && g.G == transparent.G && g.B == transparent.B)
                    isTrans = true;
            }
            for (var j: number = 0; j < scale.X; j++) {
                for (var k: number = 0; k < scale.Y; k++) {
                    var x = (curX * scale.X + j);
                    var y = (curY * scale.Y + k);
                    var c = (x + y * (scale.X * width)) * 4;
                    if (isTrans) {
                        data[c + 0] = 0;
                        data[c + 1] = 0;
                        data[c + 2] = 0;
                        data[c + 3] = 0;
                        continue;
                    }
                    data[c] = g.R|0;
                    data[c + 1] = g.G | 0;
                    data[c + 2] = g.B | 0;
                    data[c + 3] = 255;
                }
            }
        }
    }
    private static GetBase64Image(data: ImageData): string {
        var canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;
        var ctx = canvas.getContext("2d");
        ctx.putImageData(data, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }
    private static ColorObjectFromData(data: Uint8ClampedArray, c: number): Color {
        var r = data[c];
        var g = data[c + 1];
        var b = data[c + 2];
        var a = data[c + 3];
        return new Color(r, g, b, a);
    }
    public static GetImageData(image: HTMLImageElement): ImageData {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        var data = ctx.getImageData(0, 0, image.width, image.height);
        return data;
    }
    public static ScaleCsImage(image: SonicImage, scale: Point, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        var df = image.Bytes;
        var colors = new Array(df.length);
        for (var f: number = 0; f < df.length; f++) {
            var c = image.Palette[df[f]];
            colors[f] = new Color(c[0], c[1], c[2], c[3]);
        }
        var dc = CanvasInformation.Create(1, 1, false);
        var d = dc.Context.createImageData(image.Width * scale.X, image.Height * scale.Y);
        Help.SetDataFromColors(d.data, colors, scale, image.Width, colors[0]);
        return Help.LoadSprite(Help.GetBase64Image(d), complete);
    }
    public static IsLoaded(element: HTMLImageElement): boolean {
        return element.getAttribute("loaded") == "true";
    }
    public static Loaded(element: HTMLImageElement, set: boolean ): void {
        element.setAttribute("loaded", set ? "true" : "false");
    }
    public static LoadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        var sprite1 = new Image();
        sprite1.addEventListener("load",
            e => {
                Help.Loaded(sprite1, true);
                if (complete)
                    complete(sprite1);
            },
            false);
        sprite1.src = src;
        return sprite1;
    }
    public static DecodeString(lvl: string): string {
        return new Compressor().DecompressText(lvl);
    }
    public static FixAngle(angle: number): number {
        var fixedAng = Math.floor((256 - angle) * 1.4062) % 360 | 0;
        var flop = 360 - fixedAng;
        return Help.DegToRad(flop);
    }
    public static DegToRad(angle: number): number {
        return angle * Math.PI / 180;
    }
    public static Sign(m: number): number {
        return m == 0 ? 0 : (m < 0 ? -1 : 1);
    }
    public static Floor(spinDashSpeed: number): number {
        if (spinDashSpeed > 0)
            return ~~spinDashSpeed;
        return Math.floor(spinDashSpeed) | 0;
    }
    public static Max(f1: number, f2: number): number {
        return f1 < f2 ? f2 : f1;
    }
    public static Min(f1: number, f2: number): number {
        return f1 > f2 ? f2 : f1;
    }
    public static Clone<T>(o: T): T {
        return null;
    }
    public static RoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number = 5, fill: boolean = true, stroke: boolean = false): void {
        ctx.save();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke)
            ctx.stroke();
        if (fill)
            ctx.fill();
        ctx.restore();
    }
    public static GetCursorPosition(ev: JQueryEventObject): Point {
        if (ev.originalEvent && (<any>ev.originalEvent).targetTouches && (<any>ev.originalEvent).targetTouches.length > 0)
            ev = (<any>ev.originalEvent).targetTouches[0];
        if (ev.pageX && ev.pageY)
            return new Point(ev.pageX, ev.pageY);
        return new Point(ev.clientX, ev.clientY/*, 0, ev.Which == 3*/);
    }
    public static Stringify(obj: Object): string {
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
    public static SafeResize(block: CanvasInformation, width: number, height: number): CanvasInformation {
        var m = CanvasInformation.Create(width, height, false);
        m.Context.drawImage(block.Canvas, 0, 0);
        return m;
    }
    public static GetQueryString(): { [key: string]: string } {
        var result: { [key: string]: string } = {};
        var queryString: string = window.location.search.substring(1);
        var re = new RegExp("/([^&=]+)=([^&]*)/g");
        var m;
        while ((m = re.exec(queryString)) != null) {
            result[(<any>window).decodeURIComponent(m[1])] = (<any>window).decodeURIComponent(m[2]);
        }
        return result;
    }
    static Merge<T>(base: T, update: any ): T {
        for (var i in update) {
            base[i] = update[i];
        }
        return base;
    }

    static DefaultWindowLocation(gameState: GameState, scale: Point) {

        switch (gameState) {
            case GameState.Playing:
                return new IntersectingRectangle(0, 0, 320, 224);
            case GameState.Editing:
                var x = 0;
                var y = 0;
                if (SonicManager.Instance.SonicLevel && SonicManager.Instance.SonicLevel.StartPositions && SonicManager.Instance.SonicLevel.StartPositions[0]) {
                    x = SonicManager.Instance.SonicLevel.StartPositions[0].X - 128 * scale.X;
                    y = SonicManager.Instance.SonicLevel.StartPositions[0].Y - 128 * scale.Y;
                }
                return new IntersectingRectangle(x, y, window.innerWidth, window.innerHeight);
        }
        return null;

    }
}

