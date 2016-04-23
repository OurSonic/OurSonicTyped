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
        var baseCacheIndex = this.getBaseCacheIndex(xflip, yflip, palette);
        var baseCache: CanvasInformation = this.baseCaches[baseCacheIndex];
        if (baseCache == null) {
        var squareSize = this.Colors.length;
            var j: CanvasInformation;
            j = CanvasInformation.Create(squareSize, squareSize, false);
            if (pos.X < 0 || pos.Y < 0)
                return;
            var oPos = new Point(0, 0);
            if (xflip) {
                oPos.X = -squareSize;
                j.Context.scale(-1, 1);
            }
            if (yflip) {
                oPos.Y = -squareSize;
                j.Context.scale(1, -1);
            }
            var palette_ = SonicManager.Instance.SonicLevel.Palette;
            var colorPaletteIndex: number = (palette + SonicManager.Instance.IndexedPalette) % palette_.length;
            var x = oPos.X;
            var y = oPos.Y;
            for (var _x: number = 0; _x < squareSize; _x++) {
                for (var _y: number = 0; _y < squareSize; _y++) {
                    var colorIndex = this.Colors[_x][_y];
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
        var animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xflip, yflip, palette, animatedPaletteIndex, SonicManager.Instance.TilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
        var animatedPaletteCache: CanvasInformation = this.animatedPaletteCaches[animatedPaletteCacheIndex];
        if (animatedPaletteCache == null) {
            var squareSize = this.Colors.length;
            var j: CanvasInformation;
            j = CanvasInformation.Create(squareSize, squareSize, false);
            if (pos.X < 0 || pos.Y < 0)
                return
            var oPos = new Point(0, 0);
            if (xflip) {
                oPos.X = -squareSize;
                j.Context.scale(-1, 1);
            }
            if (yflip) {
                oPos.Y = -squareSize;
                j.Context.scale(1, -1);
            }
            var palette_ = SonicManager.Instance.SonicLevel.Palette;
            var colorPaletteIndex: number = (palette + SonicManager.Instance.IndexedPalette) % palette_.length;
            var x = oPos.X;
            var y = oPos.Y;
            for (var _x: number = 0; _x < squareSize; _x++) {
                for (var _y: number = 0; _y < squareSize; _y++) {
                    var colorIndex = this.Colors[_x][_y];
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
        var tileAnimationFrame = SonicManager.Instance.TileAnimationManager.GetCurrentFrame(animatedTileIndex);
        var tileAnimation = tileAnimationFrame.Animation;
        var tileAnimationData = tileAnimation.AnimatedTileData;
        var animationIndex = tileAnimationData.AnimationTileIndex;
        var frame = tileAnimationFrame.FrameData();
        if (!frame) {
            frame = tileAnimation.AnimatedTileData.DataFrames[0];
        }
        var file = tileAnimationData.GetAnimationFile();
        var va = file[frame.StartingTileIndex + (this.Index - animationIndex)];
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
            var d = new Array<number>();
            for (var _x: number = 0; _x < this.Colors.length; _x++) {
                var color = this.Colors[_x];
                for (var _y: number = 0; _y < color.length; _y++) {
                    var col = color[_y];
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