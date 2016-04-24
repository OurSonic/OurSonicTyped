///<reference path="../../typings/jQuery.d.ts"/>

export class CanvasInformation {
    private static blackPixel: HTMLCanvasElement;
    
    public Context: CanvasRenderingContext2D;
    
    public domCanvas: JQuery;
    
    public canvas: HTMLCanvasElement;
    public static get BlackPixel(): HTMLCanvasElement {
        if (CanvasInformation.blackPixel == null) {
            let m = CanvasInformation.create(0, 0, false);
            m.Context.fillStyle = "black";
            m.Context.fillRect(0, 0, 1, 1);
            CanvasInformation.blackPixel = m.canvas;
        }
        return CanvasInformation.blackPixel;
    }
    constructor(context: CanvasRenderingContext2D, domCanvas: JQuery) {
        this.Context = context;
        this.domCanvas = domCanvas;
        this.canvas = <HTMLCanvasElement>domCanvas[0];
    }
    public static create(w: number, h: number, pixelated: boolean): CanvasInformation {
        let canvas = document.createElement("canvas");
        return CanvasInformation.CreateFromElement(canvas, w, h, pixelated);
    }
    public static CreateFromElement(canvas: HTMLCanvasElement, w: number, h: number, pixelated: boolean): CanvasInformation {
        if (w == 0)
            w = 1;
        if (h == 0)
            h = 1;
        canvas.width = w;
        canvas.height = h;
        let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        if (pixelated) {
            (<any>ctx).imageSmoothingEnabled = false;
        }
        return new CanvasInformation(ctx, $(canvas));
    }
}