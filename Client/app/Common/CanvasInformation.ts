///<reference path="../../typings/jQuery.d.ts"/>

export class CanvasInformation {
    private static blackPixel: HTMLCanvasElement;
    /*[IntrinsicProperty]*/
    public Context: CanvasRenderingContext2D;
    /*[IntrinsicProperty]*/
    public DomCanvas: JQuery;
    /*[IntrinsicProperty]*/
    public Canvas: HTMLCanvasElement;
    public static get BlackPixel(): HTMLCanvasElement {
        if (CanvasInformation.blackPixel == null) {
            var m = CanvasInformation.Create(0, 0, false);
            m.Context.fillStyle = "black";
            m.Context.fillRect(0, 0, 1, 1);
            CanvasInformation.blackPixel = m.Canvas;
        }
        return CanvasInformation.blackPixel;
    }
    constructor(context: CanvasRenderingContext2D, domCanvas: JQuery) {
        this.Context = context;
        this.DomCanvas = domCanvas;
        this.Canvas = <HTMLCanvasElement>domCanvas[0];
    }
    public static Create(w: number, h: number, pixelated: boolean): CanvasInformation {
        var canvas = document.createElement("canvas");
        return CanvasInformation.CreateFromElement(canvas, w, h, pixelated);
    }
    public static CreateFromElement(canvas: HTMLCanvasElement, w: number, h: number, pixelated: boolean): CanvasInformation {
        if (w == 0)
            w = 1;
        if (h == 0)
            h = 1;
        canvas.width = w;
        canvas.height = h;
        var ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        if (pixelated) {
            (<any>ctx).imageSmoothingEnabled = false;
        }
        return new CanvasInformation(ctx, $(canvas));
    }
}