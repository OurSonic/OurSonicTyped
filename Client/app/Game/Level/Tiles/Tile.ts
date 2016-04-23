import {CanvasInformation} from "../../../Common/CanvasInformation";
import {Point } from "../../../Common/Utils";
import {SonicManager } from "../../SonicManager";

export class Tile {
    private canAnimate: boolean = true;
    protected CurPaletteIndexes: number[];
    protected Colors: number[][];
    public Index: number;
    public IsTileAnimated: boolean;
    public AnimatedPaletteIndexes: number[];
    public AnimatedTileIndexes: number[];
    public PaletteIndexesToBeAnimated: { [key: number]: number[] };

    constructor(colors: number[][]) {
        this.Colors = colors;
        this.CurPaletteIndexes = null;
    }
    private baseCaches: { [key: number]: CanvasInformation } = {};
    private animatedPaletteCaches: { [key: number]: CanvasInformation } = {};
    public DrawBase(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, palette: number, isAnimatedTile: boolean = false): void {
        if (this.AnimatedTileIndexes != null && (!isAnimatedTile && this.AnimatedTileIndexes.length > 0))
            return;
        let baseCacheIndex = this.getBaseCacheIndex(xflip, yflip, palette);
        let baseCache: CanvasInformation = this.baseCaches[baseCacheIndex];
        if (baseCache == null) {
        let squareSize = this.Colors.length;
            let j: CanvasInformation;
            j = CanvasInformation.Create(squareSize, squareSize, false);
            if (pos.X < 0 || pos.Y < 0)
                return;
            let oPos = new Point(0, 0);
            if (xflip) {
                oPos.X = -squareSize;
                j.Context.scale(-1, 1);
            }
            if (yflip) {
                oPos.Y = -squareSize;
                j.Context.scale(1, -1);
            }
            let palette_ = SonicManager.Instance.SonicLevel.Palette;
            let colorPaletteIndex: number = (palette + SonicManager.Instance.IndexedPalette) % palette_.length;
            let x = oPos.X;
            let y = oPos.Y;
            for (let _x: number = 0; _x < squareSize; _x++) {
                for (let _y: number = 0; _y < squareSize; _y++) {
                    let colorIndex = this.Colors[_x][_y];
                    if (colorIndex == 0)
                        continue;
                    j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                    j.Context.fillRect(x + _x, y + _y, 1, 1);
                }
            }
            this.baseCaches[baseCacheIndex] = baseCache = j;
        }
        canvas.drawImage(baseCache.Canvas, pos.X, pos.Y);
    }
    private getBaseCacheIndex(xflip: boolean, yflip: boolean, palette: number): number {
        return (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
    }
    private getAnimatedPaletteCacheIndex(xflip: boolean, yflip: boolean, palette: number, animatedPaletteIndex: number, frameIndex: number): number {
        return (frameIndex << 8) + (animatedPaletteIndex << 7) + (palette << 6) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
    }
    public DrawAnimatedPalette(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, palette: number, animatedPaletteIndex: number, isAnimatedTile: boolean = false): void {
        if (this.AnimatedTileIndexes != null && (!isAnimatedTile && this.AnimatedTileIndexes.length > 0))
            return
        let animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xflip, yflip, palette, animatedPaletteIndex, SonicManager.Instance.TilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
        let animatedPaletteCache: CanvasInformation = this.animatedPaletteCaches[animatedPaletteCacheIndex];
        if (animatedPaletteCache == null) {
            let squareSize = this.Colors.length;
            let j: CanvasInformation;
            j = CanvasInformation.Create(squareSize, squareSize, false);
            if (pos.X < 0 || pos.Y < 0)
                return
            let oPos = new Point(0, 0);
            if (xflip) {
                oPos.X = -squareSize;
                j.Context.scale(-1, 1);
            }
            if (yflip) {
                oPos.Y = -squareSize;
                j.Context.scale(1, -1);
            }
            let palette_ = SonicManager.Instance.SonicLevel.Palette;
            let colorPaletteIndex: number = (palette + SonicManager.Instance.IndexedPalette) % palette_.length;
            let x = oPos.X;
            let y = oPos.Y;
            for (let _x: number = 0; _x < squareSize; _x++) {
                for (let _y: number = 0; _y < squareSize; _y++) {
                    let colorIndex = this.Colors[_x][_y];
                    if (colorIndex == 0)
                        continue;
                    if (this.PaletteIndexesToBeAnimated[animatedPaletteIndex].indexOf(colorIndex) == -1)
                        continue;
                    j.Context.fillStyle = palette_[colorPaletteIndex][colorIndex];
                    j.Context.fillRect(x + _x, y + _y, 1, 1);
                }
            }
            this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = j;
        }
        canvas.drawImage(animatedPaletteCache.Canvas, pos.X, pos.Y);
    }
    public DrawAnimatedTile(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, palette: number, animatedTileIndex: number): void {
        if (this.AnimatedTileIndexes.indexOf(animatedTileIndex) == -1)
            return
        let tileAnimationFrame = SonicManager.Instance.TileAnimationManager.GetCurrentFrame(animatedTileIndex);
        let tileAnimation = tileAnimationFrame.Animation;
        let tileAnimationData = tileAnimation.AnimatedTileData;
        let animationIndex = tileAnimationData.AnimationTileIndex;
        let frame = tileAnimationFrame.FrameData();
        if (!frame) {
            frame = tileAnimation.AnimatedTileData.DataFrames[0];
        }
        let file = tileAnimationData.GetAnimationFile();
        let va = file[frame.StartingTileIndex + (this.Index - animationIndex)];
        if (va != null) {
            va.DrawBase(canvas, pos, xflip, yflip, palette, true);
        }
        else {

        }
    }
    public ShouldTileAnimate(): boolean {
        return this.IsTileAnimated && this.canAnimate;
    }
    public GetAllPaletteIndexes(): number[] {
        if (this.CurPaletteIndexes == null) {
            let d = new Array<number>();
            for (let _x: number = 0; _x < this.Colors.length; _x++) {
                let color = this.Colors[_x];
                for (let _y: number = 0; _y < color.length; _y++) {
                    let col = color[_y];
                    if (col == 0)
                        continue;
                    if (d.filter(a => a != col).length==d.length)
                        d.push(col);
                }
            }
            this.CurPaletteIndexes = d.slice(0);
        }
        return this.CurPaletteIndexes;
    }
    public ClearCache(): void {
        this.CurPaletteIndexes = null;
    }
}