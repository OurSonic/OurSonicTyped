import {SonicManager} from '../../sonicManager';
import {Tile} from '../tiles/tile';

export class TileAnimationData {
  /*   function animation(name, images) {
    this.images = images;
    this.name = name;
    this.draw = function (canvas, x, y, scale, animationIndex) {
        canvas.save(); 
        let jv = (function (ind, imgs) {
            let dj = 0;
            for (let vm in imgs) {
                if (dj == ind)
                    return vm;
                dj++;

            }
            return null;
        })(animationIndex, this.images);
        
        canvas.drawImage(sonicManager.spriteCache.animationSprites[animationIndex + " " + name + scale.x + scale.y],
            (x - this.images[jv].width / 2) * scale.x, (y - this.images[jv].height / 2) * scale.y);
        canvas.restore();
    };
}*/

  animationTileFile: number = 0;
  numberOfTiles: number = 0;
  lastAnimatedIndex: number = 0;
  lastAnimatedFrame: number = 0;
  animationTileIndex: number = 0;
  dataFrames: TileAnimationDataFrame[];
  constructor(private sonicManager: SonicManager) {}

  getAnimationFile(): Tile[] {
    return this.sonicManager.sonicLevel.animatedTileFiles[this.animationTileFile];
  }
}
export class TileAnimationDataFrame {
  ticks: number = 0;
  startingTileIndex: number = 0;
}
