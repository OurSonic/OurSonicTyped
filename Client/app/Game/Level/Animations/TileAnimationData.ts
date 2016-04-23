import {Tile} from "../Tiles/Tile";
import {SonicManager} from "../../SonicManager";

export class TileAnimationData {

       /*   function Animation(name, images) {
    this.images = images;
    this.name = name;
    this.draw = function (canvas, x, y, scale, animationIndex) {
        canvas.save(); 
        var jv = (function (ind, imgs) {
            var dj = 0;
            for (var vm in imgs) {
                if (dj == ind)
                    return vm;
                dj++;

            }
            return null;
        })(animationIndex, this.images);
        
        canvas.drawImage(sonicManager.SpriteCache.animationSprites[animationIndex + " " + name + scale.x + scale.y],
            (x - this.images[jv].width / 2) * scale.x, (y - this.images[jv].height / 2) * scale.y);
        canvas.restore();
    };
}*/


    public AnimationTileFile: number;
    public NumberOfTiles: number;
    public LastAnimatedIndex: number;
    public LastAnimatedFrame: number;
    public AnimationTileIndex: number;
    public DataFrames: TileAnimationDataFrame[];
    public AutomatedTiming: number;
    constructor() {

    }
    public GetAnimationFile(): Tile[] {
        return SonicManager.Instance.SonicLevel.AnimatedTileFiles[this.AnimationTileFile];
    }
}
export class TileAnimationDataFrame {
    /*[IntrinsicProperty]*/
    public Ticks: number;
    /*[IntrinsicProperty]*/
    public StartingTileIndex: number;
}