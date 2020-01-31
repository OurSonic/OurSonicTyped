import {SonicManager} from '../../sonicManager';
import {Tile} from './tile';
import {SonicLevel} from '../../sonicLevel';

export class TileInfo {
  constructor(private sonicManager: SonicManager) {}

  tileIndex: number = 0;
  priority: boolean = false;
  xFlip: boolean = false;
  yFlip: boolean = false;
  palette: number = 0;

  getTile(): Tile {
    const tile = this.sonicManager.sonicLevel.getTile(this.tileIndex);
    if (!tile) {
      return undefined;
    }

    if (this.sonicManager.tileAnimationManager === undefined) {
      return tile;
    }

    if (tile.animatedTileIndex === null) {
      return tile;
    }

    const tileAnimationFrame = this.sonicManager.tileAnimationManager.getCurrentFrame(tile.animatedTileIndex);
    if (!tileAnimationFrame) {
      return tile;
    }
    const tileAnimation = tileAnimationFrame.animation;
    const tileAnimationData = tileAnimation.animatedTileData;
    const animationIndex = tileAnimationData.animationTileIndex;
    let frame = tileAnimationFrame.frameData();
    if (!frame) {
      frame = tileAnimation.animatedTileData.dataFrames[0];
    }
    const file = tileAnimationData.getAnimationFile();
    const va = file[frame.startingTileIndex + (tile.index - animationIndex)];
    if (va != null) {
      return va;
    } else {
      return tile;
    }
  }
}
