import {CanvasInformation} from '../../../common/canvasInformation';
import {Point} from '../../../common/utils';
import {SonicManager} from '../../sonicManager';

export class Tile {
  protected curPaletteIndexes: number[];
  colors: number[][];
  index: number = 0;
  animatedTileIndex: number = null;

  constructor(colors: number[][]) {
    this.colors = colors;
    this.curPaletteIndexes = null;
  }

  getImage(xFlip: boolean = false, yFlip: boolean = false, colorPaletteIndex: number = 0): CanvasInformation {
    const info = CanvasInformation.create(8, 8, true);
    const image = info.context.getImageData(0, 0, 8, 8);
    const buffer = new Uint32Array(image.data.buffer);
    const palette = SonicManager.instance.sonicLevel.palette;

    for (let x = 0; x < 8; x++) {
      let drawX = x;
      if (xFlip) {
        drawX = 7 - x;
      }

      const color = this.colors[x];
      for (let y = 0; y < 8; y++) {
        let drawY = y;
        if (yFlip) {
          drawY = 7 - y;
        }

        const col = color[drawY];
        if (col === 0) {
          continue;
        }

        buffer[y * 8 + x] = palette[colorPaletteIndex][col];
      }
    }
    info.context.putImageData(image, 0, 0);
    return info;
  }
}
