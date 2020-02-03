import {CanvasInformation} from '../../common/canvasInformation';
import {RotationMode} from '../../common/enums';
import {Help} from '../../common/help';
import {SonicEngine} from '../sonicEngine';

export class HeightMap {
  static colors = ['rgba(255,0,0,0.87)', 'rgba(0,255,0,0.87)', 'rgba(0,0,255,0.87)', 'rgba(255,255,0,0.87)'];
  width: number = 0;
  height: number = 0;
  index: number = 0;

  items: number[];
  itemsXFlip: number[];
  itemsYFlip: number[];
  itemsXFlipYFlip: number[];

  items90deg: number[];
  items90degXFlip: number[];
  items90degYFlip: number[];
  items90degXFlipYFlip: number[];

  collisionBlock: boolean[];
  collisionBlockXFlip: boolean[];
  collisionBlockYFlip: boolean[];
  collisionBlockXFlipYFlip: boolean[];

  constructor(heightMap: number[], i: number) {
    this.items = heightMap;
    this.width = 16;
    this.height = 16;
    this.index = i;
    this.buildCollisionBlocks();
  }

  draw(
    canvas: CanvasRenderingContext2D,
    x: number,
    y: number,
    xflip: boolean,
    yflip: boolean,
    solid: number,
    angle: number
  ): void {
    if (this.items == null) {
      return;
    }
    canvas.save();

    if (xflip) {
      x = -x - 16;
      canvas.scale(-1, 1);
    }
    if (yflip) {
      y = -y - 16;
      canvas.scale(1, -1);
    }
    const fd = SonicEngine.instance.spriteCache.heightMaps[this.index + (solid << 20)];
    if (this.index !== -1 && fd) {
      canvas.drawImage(fd.canvas, x, y);
    } else {
      const ntcanvas = CanvasInformation.create(16, 16, false);
      const ncanvas = ntcanvas.context;
      if (solid > 0) {
        ncanvas.fillStyle = HeightMap.colors[Math.round(angle / 63) % 4];
        for (let xi = 0; xi < 16; xi++) {
          for (let yi = 0; yi < 16; yi++) {
            let jx = 0;
            let jy = 0;
            if (HeightMap.itemsGood(this.items, xi, yi)) {
              jx = xi;
              jy = yi;
              const _x = jx;
              const _y = jy;
              ncanvas.lineWidth = 1;
              ncanvas.fillRect(_x, _y, 1, 1);
              ncanvas.beginPath();
              ncanvas.lineWidth = 1;
              ncanvas.strokeStyle = 'rgba(163,241,255,0.97)';
              ncanvas.moveTo(16 / 2, 16 / 2);
              ncanvas.lineTo(16 / 2 - Help.sin(angle) * 8, 16 / 2 - Help.cos(angle) * 8);
              ncanvas.stroke();
            }
          }
        }
        ncanvas.strokeStyle = 'rgba(0,0,0,.9)';
        ncanvas.strokeRect(0, 0, 16, 16);
      }
      SonicEngine.instance.spriteCache.heightMaps[this.index + (solid << 20)] = ntcanvas;
      canvas.drawImage(ntcanvas.canvas, x, y);
    }
    canvas.restore();
  }

  private buildCollisionBlocks() {
    this.collisionBlock = new Array(64);
    this.collisionBlockXFlip = new Array(64);
    this.collisionBlockYFlip = new Array(64);
    this.collisionBlockXFlipYFlip = new Array(64);
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        this.collisionBlock[x + y * 16] = HeightMap.itemsGood(this.items, x, y);
        this.collisionBlockXFlip[15 - x + y * 16] = HeightMap.itemsGood(this.items, x, y);
        this.collisionBlockYFlip[x + (15 - y) * 16] = HeightMap.itemsGood(this.items, x, y);
        this.collisionBlockXFlipYFlip[15 - x + (15 - y) * 16] = HeightMap.itemsGood(this.items, x, y);
      }
    }

    this.itemsXFlip = this.items.map(a => a);
    this.itemsXFlip.reverse();
    this.itemsYFlip = this.items.map(a => (a === 16 ? 16 : 16 - a));
    this.itemsXFlipYFlip = this.items.map(a => (a === 16 ? 16 : 16 - a));
    this.itemsXFlipYFlip.reverse();

    const items90deg = new Array(16);

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if (this.collisionBlock[x + y * 16]) {
          items90deg[y] = 16 - x;
          break;
        }
      }
      if (!items90deg[y]) {
        items90deg[y] = 0;
      }
    }

    this.items90deg = items90deg;
    this.items90degXFlip = items90deg.map(a => a);
    this.items90degXFlip.reverse();
    this.items90degYFlip = items90deg.map(a => (a === 16 ? 16 : 16 - a));
    this.items90degXFlipYFlip = items90deg.map(a => (a === 16 ? 16 : 16 - a));
    this.items90degXFlipYFlip.reverse();
  }

  private static itemsGood(items: number[], x: number, y: number): boolean {
    if (items[x] < 0) {
      return Math.abs(items[x]) >= y;
    }
    return items[x] >= 16 - y;
  }

  static fullCollision = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
  ];
  static empty = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ];
}
