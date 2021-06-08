import {SonicImage} from '../game/level/sonicImage';
import {CanvasInformation} from './canvasInformation';
import {Color} from './color';
import {Point} from './utils';
export class Help {
  static DRAWGL = true;
  // prettier-ignore
  private static cosTable = [
    1.00000, 0.99970, 0.99880, 0.99729, 0.99518, 0.99248, 0.98918, 0.98528,
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
    0.98079, 0.98528, 0.98918, 0.99248, 0.99518, 0.99729, 0.99880, 0.99970];

  static sin(f: number): number {
    return Help.cosTable[(f + 0x40) & 0xff];
  }
  static cos(f: number): number {
    return Help.cosTable[f & 0xff];
  }
  static mod(j: number, n: number): number {
    return ((j % n) + n) % n;
  }
  static scaleSprite(image: HTMLImageElement, scale: Point): CanvasInformation {
    const canv = CanvasInformation.create(image.width * scale.x, image.height * scale.y, true);
    canv.context.save();
    canv.context.scale(scale.x, scale.y);
    canv.context.drawImage(image, 0, 0);
    canv.context.restore();
    return canv;
  }
  static scalePixelData(scale: Point, data: ImageData): ImageData {
    const Uint8ClampedArray: Uint8ClampedArray = data.data;
    const colors = new Array((Uint8ClampedArray.length / 4) | 0);
    for (let f: number = 0; f < Uint8ClampedArray.length; f += 4) {
      colors[(f / 4) | 0] = Help.colorObjectFromData(Uint8ClampedArray, f);
    }
    const d = CanvasInformation.create(1, 1, false).context.createImageData(
      data.width * scale.x,
      data.height * scale.y
    );
    Help.setDataFromColors(d.data, colors, scale, data.width, colors[0]);
    return d;
  }
  private static setDataFromColors(
    data: Uint8ClampedArray,
    colors: Color[],
    scale: Point,
    width: number,
    transparent: Color
  ): void {
    for (let i: number = 0; i < colors.length; i++) {
      const curX = i % width;
      const curY = (i / width) | 0;
      const g = colors[i];
      let isTrans = false;
      if (transparent) {
        if (g.r === transparent.r && g.g === transparent.g && g.b === transparent.b) {
          isTrans = true;
        }
      }
      for (let j: number = 0; j < scale.x; j++) {
        for (let k: number = 0; k < scale.y; k++) {
          const x = curX * scale.x + j;
          const y = curY * scale.y + k;
          const c = (x + y * (scale.x * width)) * 4;
          if (isTrans) {
            data[c + 0] = 0;
            data[c + 1] = 0;
            data[c + 2] = 0;
            data[c + 3] = 0;
            continue;
          }
          data[c] = g.r | 0;
          data[c + 1] = g.g | 0;
          data[c + 2] = g.b | 0;
          data[c + 3] = 255;
        }
      }
    }
  }
  private static getBase64Image(data: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }
  private static colorObjectFromData(data: Uint8ClampedArray, c: number): Color {
    const r = data[c];
    const g = data[c + 1];
    const b = data[c + 2];
    const a = data[c + 3];
    return new Color(r, g, b, a);
  }
  static getImageData(image: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, image.width, image.height);
    return data;
  }
  static scaleCsImage(image: SonicImage, scale: Point, complete: (_: HTMLImageElement) => void): HTMLImageElement {
    const df = image.Bytes;
    const colors = new Array(df.length);
    for (let f: number = 0; f < df.length; f++) {
      const c = image.Palette[df[f]];
      colors[f] = new Color(c[0], c[1], c[2], c[3]);
    }
    const dc = CanvasInformation.create(1, 1, false);
    const d = dc.context.createImageData(image.Width * scale.x, image.Height * scale.y);
    Help.setDataFromColors(d.data, colors, scale, image.Width, colors[0]);
    return Help.loadSprite(Help.getBase64Image(d), complete);
  }
  static isLoaded(element: HTMLImageElement): boolean {
    return element.getAttribute('loaded') === 'true';
  }
  static loaded(element: HTMLImageElement, set: boolean): void {
    element.setAttribute('loaded', set ? 'true' : 'false');
  }
  static loadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
    const sprite1 = new Image();
    sprite1.addEventListener(
      'load',
      (e) => {
        Help.loaded(sprite1, true);
        if (complete) {
          complete(sprite1);
        }
      },
      false
    );
    sprite1.src = src;
    return sprite1;
  }
  static decodeString(lvl: string): string {
    return new Compressor().DecompressText(lvl);
  }
  static fixAngle(angle: number): number {
    const fixedAng = Math.floor((256 - angle) * 1.4062) % 360 | 0;
    const flop = 360 - fixedAng;
    return Help.degToRad(flop);
  }
  static degToRad(angle: number): number {
    return (angle * Math.PI) / 180;
  }
  static sign(m: number): number {
    return m === 0 ? 0 : m < 0 ? -1 : 1;
  }
  static floor(spinDashSpeed: number): number {
    if (spinDashSpeed > 0) {
      return ~~spinDashSpeed;
    }
    return Math.floor(spinDashSpeed) | 0;
  }
  static max(f1: number, f2: number): number {
    return f1 < f2 ? f2 : f1;
  }
  static min(f1: number, f2: number): number {
    return f1 > f2 ? f2 : f1;
  }

  static merge<T>(base: T, update: any): T {
    for (const i in update) {
      base[i] = update[i];
    }
    return base;
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  }
}
export function assertType<T>(assertion: any): asserts assertion is T {}
