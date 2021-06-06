import {CanvasInformation} from '../../../common/canvasInformation';
import {SonicManager} from '../../sonicManager';
import {HeightMap} from '../heightMap';
import {TileInfo} from './tileInfo';

export class TilePiece {
  constructor(private sonicManager: SonicManager) {}

  static drawInfo: number[][] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ];
  static drawOrder: number[][] = [
    [3, 2, 1, 0],
    [1, 0, 3, 2],
    [2, 3, 0, 1],
    [0, 1, 2, 3],
  ];
  isOnlyBackground: boolean = false;
  isOnlyForeground: boolean = false;

  tiles: TileInfo[];

  index: number = 0;

  init(): void {
    this.checkOnlyForeground();
    this.checkOnlyBackground();
  }

  checkOnlyBackground(): void {
    for (const mj of this.tiles) {
      if (mj && mj.priority) {
        this.isOnlyBackground = false;
        return;
      }
    }
    this.isOnlyBackground = true;
  }

  checkOnlyForeground(): void {
    for (const mj of this.tiles) {
      if (mj && !mj.priority) {
        this.isOnlyForeground = false;
        return;
      }
    }
    this.isOnlyForeground = true;
  }

  get layer1Angle(): number {
    return this.sonicManager.sonicLevel.angles[this.sonicManager.sonicLevel.collisionIndexes1[this.index]];
  }

  get layer2Angle(): number {
    return this.sonicManager.sonicLevel.angles[this.sonicManager.sonicLevel.collisionIndexes2[this.index]];
  }

  get layer1HeightMap(): HeightMap {
    return this.sonicManager.sonicLevel.heightMaps[this.sonicManager.sonicLevel.collisionIndexes1[this.index]];
  }

  get layer2HeightMap(): HeightMap {
    return this.sonicManager.sonicLevel.heightMaps[this.sonicManager.sonicLevel.collisionIndexes2[this.index]];
  }

  getImage(xFlip: boolean = false, yFlip: boolean = false): CanvasInformation {
    const info = CanvasInformation.create(16, 16, true);

    const drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : yFlip ? 2 : 3;
    for (let i = 0; i < this.tiles.length; i++) {
      const tileItem = this.tiles[i];
      const tile = tileItem.getTile();
      if (!tile) {
        continue;
      }
      const tileXFlip = xFlip !== tileItem.xFlip;
      const tileYFlip = yFlip !== tileItem.yFlip;
      const df = TilePiece.drawInfo[TilePiece.drawOrder[drawOrderIndex][i]];
      const image = tile.getImage(tileXFlip, tileYFlip, tileItem.palette).canvas;
      info.context.drawImage(image, df[0] * 8, df[1] * 8);
    }
    return info;
  }
}
