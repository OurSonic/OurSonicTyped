import {TileInfo} from "./TileInfo";
import {Point} from "../../../common/Utils";
import {ChunkLayer} from "./TileChunk";
import {CanvasInformation} from "../../../common/CanvasInformation";
import {SonicManager} from "../../SonicManager";
import {HeightMap} from "../HeightMap";
import {ChunkLayerState} from "../../../common/Enums";

export class TilePiece {
    private static DrawInfo:number[][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    private static DrawOrder:number[][] = [[3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 1, 2, 3]];
    private onlyBackground:boolean = false;
    private onlyBackgroundSet:boolean = false;
    private onlyForeground:boolean = false;
    private onlyForegroundSet:boolean = false;
    private shouldAnimate:boolean = false;

    public Tiles:TileInfo[];

    public Index:number = 0;

    public AnimatedPaletteIndexes:number[];
    public AnimatedTileIndexes:number[];

    public Init():void {
        this.OnlyBackground();
        this.OnlyForeground();
    }

    public OnlyBackground():boolean {
        if (this.onlyBackgroundSet)
            return this.onlyBackground;
        for (let mj of this.Tiles) {
            if (mj) {
                if (mj.Priority) {
                    this.onlyBackgroundSet = true;
                    return (this.onlyBackground = false);
                }
            }
        }
        this.onlyBackgroundSet = true;
        return (this.onlyBackground = true);
    }

    public OnlyForeground():boolean {
        if (this.onlyForegroundSet)
            return this.onlyForeground;
        for (let mj of this.Tiles) {
            if (mj) {
                if (!mj.Priority) {
                    this.onlyForegroundSet = true;
                    return (this.onlyForeground = false);
                }
            }
        }
        this.onlyForegroundSet = true;
        return (this.onlyForeground = true);
    }

    public DrawBase(canvas:CanvasRenderingContext2D,
                    position:Point,
                    layer:ChunkLayerState,
                    xFlip:boolean,
                    yFlip:boolean):void {
        let drawOrderIndex = 0;
        drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
        let tilePieceLength:number = 8;
        let ac = CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
        let i = 0;
        let localPoint = new Point(0, 0);
        for (let tileItem of this.Tiles) {
            let tile = tileItem.GetTile();
            if (tile) {
                if (tileItem.Priority == (layer == 1)) {
                    let _xf = !!xFlip !== !!tileItem.XFlip;
                    let _yf = !!yFlip !== !!tileItem.YFlip;
                    let df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                    localPoint.x = df[0] * tilePieceLength;
                    localPoint.y = df[1] * tilePieceLength;
                    tile.drawBase(ac.Context, localPoint, _xf, _yf, tileItem.Palette);
                }
            }
            i++;
        }
        canvas.drawImage(ac.canvas, position.x, position.y);

    }

    private getAnimatedPaletteCacheIndex(xflip:boolean, yflip:boolean, animatedPaletteIndex:number, frameIndex:number):number {
        return (frameIndex << 8) + (animatedPaletteIndex << 7) + ((xflip ? 1 : 0) << 5) + ((yflip ? 1 : 0) << 4);
    }

    private animatedPaletteCaches:{ [key:number]:CanvasInformation} = {};

    public DrawAnimatedPalette(canvas:CanvasRenderingContext2D, position:Point, layer:ChunkLayerState, xFlip:boolean, yFlip:boolean, animatedPaletteIndex:number):void {
        let animatedPaletteCacheIndex = this.getAnimatedPaletteCacheIndex(xFlip, yFlip, animatedPaletteIndex, SonicManager.instance.tilePaletteAnimationManager.GetPaletteAnimation(animatedPaletteIndex).CurrentFrame);
        let animatedPaletteCache:CanvasInformation = this.animatedPaletteCaches[animatedPaletteCacheIndex];
        if (animatedPaletteCache == null) {
            let drawOrderIndex = 0;
            drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
            let tilePieceLength:number = 8;
            let ac = CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
            let i = 0;
            let localPoint = new Point(0, 0);
            for (let tileItem of this.Tiles) {
                let tile = tileItem.GetTile();
                if (tile) {
                    if (tileItem.Priority == (layer == 1)) {
                        let _xf = !!xFlip !== !!tileItem.XFlip;
                        let _yf = !!yFlip !== !!tileItem.YFlip;
                        let df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                        localPoint.x = df[0] * tilePieceLength;
                        localPoint.y = df[1] * tilePieceLength;
                        tile.DrawAnimatedPalette(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedPaletteIndex);
                    }
                }
                i++;
            }
            this.animatedPaletteCaches[animatedPaletteCacheIndex] = animatedPaletteCache = ac;
        }
        canvas.drawImage(animatedPaletteCache.canvas, position.x, position.y);
    }

    public DrawAnimatedTile(canvas:CanvasRenderingContext2D, position:Point, layer:ChunkLayerState, xFlip:boolean, yFlip:boolean, animatedTileIndex:number):void {
        let drawOrderIndex = 0;
        drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
        let tilePieceLength:number = 8;
        let ac = CanvasInformation.create(tilePieceLength * 2, tilePieceLength * 2, false);
        let i = 0;
        let localPoint = new Point(0, 0);
        for (let tileItem of this.Tiles) {
            let tile = tileItem.GetTile();
            if (tile) {
                if (tileItem.Priority == (layer == 1)) {
                    let _xf = !!xFlip !== !!tileItem.XFlip;
                    let _yf = !!yFlip !== !!tileItem.YFlip;
                    let df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
                    localPoint.x = df[0] * tilePieceLength;
                    localPoint.y = df[1] * tilePieceLength;
                    tile.drawAnimatedTile(ac.Context, localPoint, _xf, _yf, tileItem.Palette, animatedTileIndex);
                }
            }
            i++;
        }
        canvas.drawImage(ac.canvas, position.x, position.y);
    }

    public ShouldAnimate():boolean {
        if (this.shouldAnimate == null) {
            for (let t of this.Tiles) {
                let tile = t.GetTile();
                if (tile) {
                    if (tile.ShouldTileAnimate())
                        return (this.shouldAnimate = true);
                }
            }
            this.shouldAnimate = false;
        }
        return (this.shouldAnimate);
    }

    public getLayer1Angle():number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes1[this.Index]];
    }

    public getLayer2Angle():number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes2[this.Index]];
    }

    public getLayer1HeightMap():HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes1[this.Index]];
    }

    public getLayer2HeightMap():HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes2[this.Index]];
    }
}