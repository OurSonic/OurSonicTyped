import {CanvasInformation} from '../../common/canvasInformation';
import {RotationMode} from '../../common/enums';
import {Help} from '../../common/help';
import {Point} from '../../common/utils';
import {SonicEngine} from '../sonicEngine';
import {SonicManager} from '../sonicManager';

export class HeightMap {
  static colors: string[] = new Array('', 'rgba(255,98,235,0.6)', 'rgba(24,218,235,0.6)', 'rgba(24,98,235,0.6)');
  protected Width: number = 0;
  protected Height: number = 0;
  Items: number[];
  Index: number = 0;
  collisionBlock: boolean[];
  collisionBlockXFlip: boolean[];
  collisionBlockYFlip: boolean[];
  collisionBlockXFlipYFlip: boolean[];

  constructor(heightMap: number[], i: number) {
    this.Items = heightMap;
    this.Width = 16;
    this.Height = 16;
    this.Index = i;
    this.buildCollisionBlocks();
  }

  setItem(x: number, y: number, rotationMode: RotationMode): void {
    let jx = 0;
    let jy = 0;
    switch (rotationMode) {
      case RotationMode.Floor:
        jx = x;
        jy = y;
        break;
      case RotationMode.LeftWall:
        jx = y;
        jy = 15 - x;
        break;
      case RotationMode.Ceiling:
        jx = x;
        jy = 15 - y;
        break;
      case RotationMode.RightWall:
        jx = y;
        jy = x;
        break;
    }
    this.Items[jx] = 16 - jy;
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
    if (this.Items == null) {
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
    const fd = SonicEngine.instance.spriteCache.HeightMaps[this.Index + (solid << 20)];
    if (this.Index !== -1 && fd) {
      canvas.drawImage(fd.canvas, x, y);
    } else {
      const ntcanvas = CanvasInformation.create(16, 16, false);
      const ncanvas = ntcanvas.context;
      if (solid > 0) {
        ncanvas.fillStyle = HeightMap.colors[solid];
        for (let xi = 0; xi < 16; xi++) {
          for (let yi = 0; yi < 16; yi++) {
            let jx = 0;
            let jy = 0;
            if (HeightMap.itemsGood(this.Items, xi, yi)) {
              jx = xi;
              jy = yi;
              const _x = jx;
              const _y = jy;
              ncanvas.lineWidth = 1;
              ncanvas.fillRect(_x, _y, 1, 1);
              if (angle !== 255) {
                ncanvas.beginPath();
                ncanvas.lineWidth = 1;
                ncanvas.strokeStyle = 'rgba(163,241,255,0.8)';
                ncanvas.moveTo(16 / 2, 16 / 2);
                ncanvas.lineTo(16 / 2 - Help.sin(angle) * 8, 16 / 2 - Help.cos(angle) * 8);
                ncanvas.stroke();
              }
            }
          }
        }
      }
      SonicEngine.instance.spriteCache.HeightMaps[this.Index + (solid << 20)] = ntcanvas;
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
        this.collisionBlock[x + y * 16] = HeightMap.itemsGood(this.Items, x, y);
        this.collisionBlockXFlip[15 - x + y * 16] = HeightMap.itemsGood(this.Items, x, y);
        this.collisionBlockYFlip[x + (15 - y) * 16] = HeightMap.itemsGood(this.Items, x, y);
        this.collisionBlockXFlipYFlip[15 - x + (15 - y) * 16] = HeightMap.itemsGood(this.Items, x, y);
      }
    }
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
