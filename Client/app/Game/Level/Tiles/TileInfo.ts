import {Tile} from "./Tile";
import {SonicManager} from "../../SonicManager";
import unbind = keyboardJS.unbind;

export class TileInfo {
    public tileIndex: number = 0;
    public priority: boolean = false;
    public xFlip: boolean = false;
    public yFlip: boolean = false;
    public palette: number = 0;

    public getTile(): Tile {
        var tile = SonicManager.instance.sonicLevel.getTile(this.tileIndex);
        if (!tile) return null;

        if (tile.animatedTileIndex === null || SonicManager.instance.tileAnimationManager === undefined)
            return tile;
        let tileAnimationFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(tile.animatedTileIndex);
        if (!tileAnimationFrame) return tile;
        let tileAnimation = tileAnimationFrame.animation;
        let tileAnimationData = tileAnimation.animatedTileData;
        let animationIndex = tileAnimationData.animationTileIndex;
        let frame = tileAnimationFrame.frameData();
        if (!frame) {
            frame = tileAnimation.animatedTileData.dataFrames[0];
        }
        let file = tileAnimationData.GetAnimationFile();
        let va = file[frame.startingTileIndex + (tile.index - animationIndex)];
        if (va != null) {
            return va;
        }
        else {
            return tile;
        }
    }
}