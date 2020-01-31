export class CanvasInformation {
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.context = context;
    this.canvas = canvas;
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
    const ctx = canvas.getContext('2d');
    if (pixelated) {
      ctx.imageSmoothingEnabled = false;
    }
    return new CanvasInformation(ctx, canvas);
  }
}
