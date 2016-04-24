import {CanvasInformation} from "../../../common/CanvasInformation";
import {Point } from "../../../common/Utils";
import {SonicManager } from "../../SonicManager";

export class Tile {
    private canAnimate: boolean = true;
    protected curPaletteIndexes: number[];
    protected colors: number[][];
    public index: number=0;
    public isTileAnimated: boolean=false;
    public animatedPaletteIndexes: number[];
    public animatedTileIndexes: number[];
    public paletteIndexesToBeAnimated: { [key: number]: number[] };

    constructor(colors: number[][]) {
        this.colors = colors;
        this.curPaletteIndexes = null;
    }
    private baseCaches: { [key: number]: CanvasInformation } = {};
    private animatedPaletteCaches: { [key: number]: CanvasInformation } = {};
    public drawBase(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, palette: number, isAnimatedTile: boolean = false): void {
        if (this.animatedTileIndexes != null && (!isAnimatedTile && this.animatedTileIndexes.length > 0))
            return;
        let baseCacheIndex = this.getBaseCacheIndex(xflip, yflip, palette);
        let baseCache: CanvasInformation = this.baseCaches[baseCacheIndex];
        if (baseCache == null) {
        let squareSize = this.colors.length;
            let j: CanvasInformation;
            j = CanvasInformation.create(squareSize, squareSize, false);
            if (pos.x < 0 || pos.y < 0)
                return;
            let oPos = new Point(0, 0);
            if (xflip) {
                oPos.x = -squareSize;
                j.Context.scale(-1, 1);
            }
            if (yflip) {
                oPos.y = -squareSize;
                j.Context.scale(1, -1);
            }
            let palette_ = SonicManager.instance.sonicLevel.Palette;
            let colorPaletteIndex: number = (palette + SonicManager.instance.indexedPalette) % palette_.length;
            let x = oPos.x;
            let y = oPos.y;
            for (let _x: number = 0; _x < squareSize; _x++) {
                for (let _y: number = 0; _y < squareSize; _y++) {
                    let colorIndex = this.colors[_x][_y];
                    if (colorIndex == 0)
                        continue;
                    j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                    j.Context.fillRect(x + _x, y + _y, 1, 1);
                }
            }
            this.baseCaches[baseCacheIndex] = baseCache = j;
        }
        canvas.drawImage(baseCache.canvas, pos.x, pos.y);
    }
    private getBaseCacheIndex(xflip: boolean, yflip: boolean, palette: number): number {
        return (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
    }
    private getAnimatedPaletteCacheIndex(xflip: boolean, yflip: boolean, palette: number, animatedPaletteIndex: number, frameIndex: number): number {
        return (frameIndex << 8) + (animatedPaletteIndex << 7) + (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
    }
    public DrawAnimatedPalette(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, palette: number, animatedPaletteIndex: number, isAnimatedTile: boolean = false): void {
        if (this.animatedTileIndexes != null && (!isAnimatedTile && this.animatedTileIndexes.length > 0))
            return
        let animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xflip, yflip, palette, animatedPaletteIndex, SonicManager.instance.tilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
        let animatedPaletteCache: CanvasInformation = this.animatedPaletteCaches[animatedPaletteCacheIndex];
        if (animatedPaletteCache == null) {
            let squareSize = this.colors.length;
            let j: CanvasInformation;
            j = CanvasInformation.create(squareSize, squareSize, false);
            if (pos.x < 0 || pos.y < 0)
                return
            let oPos = new Point(0, 0);
            if (xflip) {
                oPos.x = -squareSize;
                j.Context.scale(-1, 1);
            }
            if (yflip) {
                oPos.y = -squareSize;
                j.Context.scale(1, -1);
            }
            let palette_ = SonicManager.instance.sonicLevel.Palette;
            let colorPaletteIndex: number = (palette + SonicManager.instance.indexedPalette) % palette_.length;
            let x = oPos.x;
            let y = oPos.y;
            for (let _x: number = 0; _x < squareSize; _x++) {
                for (let _y: number = 0; _y < squareSize; _y++) {
                    let colorIndex = this.colors[_x][_y];
                    if (colorIndex == 0)
                        continue;
                    if (this.paletteIndexesToBeAnimated[animatedPaletteIndex].indexOf(colorIndex) == -1)
                        continue;
                    j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                    j.Context.fillRect(x + _x, y + _y, 1, 1);
                }
            }
            this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = j;
        }
        canvas.drawImage(animatedPaletteCache.canvas, pos.x, pos.y);
    }
    public drawAnimatedTile(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, palette: number, animatedTileIndex: number): void {
        if (this.animatedTileIndexes.indexOf(animatedTileIndex) == -1)
            return
        let tileAnimationFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(animatedTileIndex);
        let tileAnimation = tileAnimationFrame.animation;
        let tileAnimationData = tileAnimation.animatedTileData;
        let animationIndex = tileAnimationData.AnimationTileIndex;
        let frame = tileAnimationFrame.frameData();
        if (!frame) {
            frame = tileAnimation.animatedTileData.DataFrames[0];
        }
        let file = tileAnimationData.GetAnimationFile();
        let va = file[frame.StartingTileIndex + (this.index - animationIndex)];
        if (va != null) {
            va.drawBase(canvas, pos, xflip, yflip, palette, true);
        }
        else {

        }
    }
    public ShouldTileAnimate(): boolean {
        return this.isTileAnimated && this.canAnimate;
    }
    public GetAllPaletteIndexes(): number[] {
        if (this.curPaletteIndexes == null) {
            let d = new Array<number>();
            for (let _x: number = 0; _x < this.colors.length; _x++) {
                let color = this.colors[_x];
                for (let _y: number = 0; _y < color.length; _y++) {
                    let col = color[_y];
                    if (col == 0)
                        continue;
                    if (d.filter(a => a != col).length==d.length)
                        d.push(col);
                }
            }
            this.curPaletteIndexes = d.slice(0);
        }
        return this.curPaletteIndexes;
    }
    public ClearCache(): void {
        this.curPaletteIndexes = null;
        this.baseCaches={};
    }
}