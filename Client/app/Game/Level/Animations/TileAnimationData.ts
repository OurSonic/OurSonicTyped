import {Tile} from "../Tiles/Tile";
import {SonicManager} from "../../SonicManager";

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


    public animationTileFile: number=0;
    public numberOfTiles: number=0;
    public LastAnimatedIndex: number=0;
    public LastAnimatedFrame: number=0;
    public animationTileIndex: number=0;
    public dataFrames: TileAnimationDataFrame[];
    public automatedTiming: number=0;
    constructor() {

    }
    public GetAnimationFile(): Tile[] {
        return SonicManager.instance.sonicLevel.animatedTileFiles[this.animationTileFile];
    }
}
export class TileAnimationDataFrame {
    public ticks: number=0;
    public startingTileIndex: number=0;
}