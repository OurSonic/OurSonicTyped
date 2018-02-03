///<reference path="../../typings/jQuery.d.ts"/>

export class CanvasInformation {

    public context: CanvasRenderingContext2D;
    public domCanvas: JQuery;
    public canvas: HTMLCanvasElement;

    constructor(context: CanvasRenderingContext2D, domCanvas: JQuery) {
        this.context = context;
        this.domCanvas = domCanvas;
        this.canvas = <HTMLCanvasElement>domCanvas[0];
    }

    public static create(w: number, h: number, pixelated: boolean): CanvasInformation {
        let canvas = document.createElement("canvas");
        return CanvasInformation.createFromElement(canvas, w, h, pixelated);
    }

    public static createFromElement(canvas: HTMLCanvasElement, w: number, h: number, pixelated: boolean): CanvasInformation {
        if (w == 0)
            w = 1;
        if (h == 0)
            h = 1;
        canvas.width = w;
        canvas.height = h;
        let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        if (pixelated) {
            (<any>ctx).mozImageSmoothingEnabled = false; /// future
            (<any>ctx).msImageSmoothingEnabled = false; /// future
            (<any>ctx).imageSmoothingEnabled = false; /// future
        }
        return new CanvasInformation(ctx, $(canvas));
    }
}