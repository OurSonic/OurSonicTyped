///<reference path="../../typings/jQuery.d.ts"/>



export class CanvasInformation {
    private static _blackPixel: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public domCanvas: JQuery;
    public canvas: HTMLCanvasElement;
    public static get blackPixel(): HTMLCanvasElement {
        if (CanvasInformation._blackPixel == null) {
            var m = CanvasInformation.create(0, 0, false);
            m.context.fillStyle = "black";
            m.context.fillRect(0, 0, 1, 1);
            CanvasInformation._blackPixel = m.canvas;
        }
        return CanvasInformation._blackPixel;
    }
    constructor(context: CanvasRenderingContext2D, domCanvas: JQuery) {
        this.context = context;
        this.domCanvas = domCanvas;

        this.canvas = <HTMLCanvasElement>domCanvas[0]; 
    }
    public static create(w: number, h: number, pixelated: boolean): CanvasInformation {
        var canvas = document.createElement("canvas");
        return CanvasInformation.createFromElement(canvas, w, h, pixelated);
    }
    public static createFromElement(canvas: HTMLCanvasElement, w: number, h: number, pixelated: boolean): CanvasInformation {
        if (w == 0)
            w = 1;
        if (h == 0)
            h = 1;
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        if (pixelated) {
            (<any>ctx).webkitImageSmoothingEnabled = false;
            (<any>ctx).mozImageSmoothingEnabled = false;
            (<any>ctx).imageSmoothingEnabled = false;
        }
        return new CanvasInformation(ctx, jQuery(canvas));
    }
}
