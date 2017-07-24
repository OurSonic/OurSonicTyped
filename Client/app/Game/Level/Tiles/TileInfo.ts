import {Tile} from "./Tile";
import {SonicManager} from "../../SonicManager";
import unbind = keyboardJS.unbind;

export class TileInfo {
    public _Tile: number = 0;
    public Priority: boolean = false;
    public XFlip: boolean = false;
    public YFlip: boolean = false;
    public Palette: number = 0;
    public Index: number = 0;

    public GetTile(): Tile {
        var tile = SonicManager.instance.sonicLevel.getTile(this._Tile);
        if (!tile) return null;

        if (tile.animatedTileIndex === null || SonicManager.instance.tileAnimationManager===undefined)
            return tile;
        let tileAnimationFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(tile.animatedTileIndex);
        let tileAnimation = tileAnimationFrame.animation;
        let tileAnimationData = tileAnimation.animatedTileData;
        let animationIndex = tileAnimationData.AnimationTileIndex;
        let frame = tileAnimationFrame.frameData();
        if (!frame) {
            frame = tileAnimation.animatedTileData.DataFrames[0];
        }
        let file = tileAnimationData.GetAnimationFile();
        let va = file[frame.StartingTileIndex + (tile.index - animationIndex)];
        if (va != null) {
            return va;
        }
        else {
            return tile;
        }
    }
}