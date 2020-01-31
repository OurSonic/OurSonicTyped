///<reference path="../../typings/jQuery.d.ts"/>

export class CanvasInformation {
  context: CanvasRenderingContext2D;
  domCanvas: JQuery;
  canvas: HTMLCanvasElement;

  constructor(context: CanvasRenderingContext2D, domCanvas: JQuery) {
    this.context = context;
    this.domCanvas = domCanvas;
    this.canvas = domCanvas[0] as HTMLCanvasElement;
  }

  static create(w: number, h: number, pixelated: boolean): CanvasInformation {
    const canvas = document.createElement('canvas');
    return CanvasInformation.createFromElement(canvas, w, h, pixelated);
  }

  static createFromElement(canvas: HTMLCanvasElement, w: number, h: number, pixelated: boolean): CanvasInformation {
    if (w === 0) {
      w = 1;
    }
    if (h === 0) {
      h = 1;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (pixelated) {
      (ctx as any).mozImageSmoothingEnabled = false; /// future
      (ctx as any).msImageSmoothingEnabled = false; /// future
      (ctx as any).imageSmoothingEnabled = false; /// future
    }
    return new CanvasInformation(ctx, $(canvas));
  }
}
