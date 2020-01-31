import {SonicManager} from '../../sonicManager';
import {Tile} from './tile';
import unbind = keyboardJS.unbind;

export class TileInfo {
  tileIndex: number = 0;
  priority: boolean = false;
  xFlip: boolean = false;
  yFlip: boolean = false;
  palette: number = 0;

  getTile(): Tile {
    const tile = SonicManager.instance.sonicLevel.getTile(this.tileIndex);
    if (!tile) {
      return undefined;
    }

    if (SonicManager.instance.tileAnimationManager === undefined) {
      return tile;
    }

    if (tile.animatedTileIndex === null) {
      return tile;
    }

    const tileAnimationFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(tile.animatedTileIndex);
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
    const file = tileAnimationData.GetAnimationFile();
    const va = file[frame.startingTileIndex + (tile.index - animationIndex)];
    if (va != null) {
      return va;
    } else {
      return tile;
    }
  }
}
