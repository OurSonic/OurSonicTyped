import {Point, Rectangle } from "../../../Common/Utils";
import {TilePieceInfo } from "./TilePieceInfo";
import {Solidity } from "../../../SLData";
import {TilePiece } from "./TilePiece";
import {SonicManager } from "../../SonicManager";
import {CanvasInformation } from "../../../Common/CanvasInformation";
import {TileAnimationData} from "../Animations/TileAnimationData";
import {TilePaletteAnimation} from "./TilePaletteAnimationManager";
import {TileAnimation} from "./TileAnimationManager";
import {TileInfo} from "./TileInfo";
import {ChunkLayerState  } from "../../../Common/Enums";

export class TileChunk {
    public static TilePiecesSquareSize: number = 16;
    public static TileSquareSize: number = 8;
    public static Size: number = TileChunk.TilePiecesSquareSize * TileChunk.TilePieceSideLength;
    public static TilePieceSideLength: number = 8;
    public static TileSideLength: number = 16;
    private myLocalPoint: Point = new Point(0, 0);
    public IsOnlyBackground: boolean;
    public IsOnlyForeground: boolean;
    private Empty: boolean;
    public TilePieces: TilePieceInfo[][];
    public TileAnimations: { [key: number]: TileAnimationData };
    public Index: number;
    public HeightBlocks1: Solidity[][];
    public HeightBlocks2: Solidity[][];
    public AngleMap1: number[][];
    public AngleMap2: number[][];
    private tileAnimationIndexes: number[];
    private paletteAnimationIndexes: number[];
    constructor() {
        this.IsOnlyBackground = null;
    }
    public GetTilePieceAt(x: number, y: number, large: boolean): TilePiece {
        return this.GetTilePieceInfo(x, y, large).GetTilePiece();
    }
    public SetTilePieceAt(x: number, y: number, tp: TilePiece, large: boolean): void {
        if (this.GetTilePieceInfo(x, y, large).SetTilePiece(tp))
            this.ClearCache();
    }
    public GetTilePieceInfo(x: number, y: number, large: boolean): TilePieceInfo {
        if (large) {
            return this.TilePieces[x / TileChunk.TilePiecesSquareSize][y / TileChunk.TilePiecesSquareSize];
        }
        else {
            return this.TilePieces[x][y];
        }
    }
    public OnlyBackground(): boolean {
        if (!this.IsOnlyBackground) {
            for (var tilePiece of this.EachPiece()) {
                if (!tilePiece.OnlyBackground())
                    return (this.IsOnlyBackground = false);
            }
            this.IsOnlyBackground = true;
            return this.IsOnlyBackground;
        }
        return this.IsOnlyBackground;
    }
    public OnlyForeground(): boolean {
        if (!this.IsOnlyForeground) {
            for (var tilePiece of this.EachPiece()) {
                if (!tilePiece.OnlyForeground()) {
                    return (this.IsOnlyForeground = false);
                }
            }
            this.IsOnlyForeground = true;
            return this.IsOnlyForeground;
        }
        return this.IsOnlyForeground;
    }
    public IsEmpty(): boolean {
        if (!this.Empty) {
            for (var tilePiece of this.EachPiece()) {
                if (tilePiece.Index != 0) {
                    return (this.Empty = false);
                }
            }
            this.Empty = true;
        }
        return this.Empty;
    }
//todo look at this
    private EachPiece(): TilePiece[] {
        var __result = new Array<TilePiece>();
        for (var pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (var pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                var tilePiece: TilePiece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                if (tilePiece != null) {
                    __result.push(tilePiece);
                    /*yield return tilePiece;*/
                }
            }
        }
        return __result;
    }
    private HasPixelAnimations(): boolean {
        return this.GetAllPaletteAnimationIndexes().length > 0;
    }
    private HasTileAnimations(): boolean {
        return this.GetAllTileAnimationIndexes().length > 0;
    }
    private GetAllPaletteAnimationIndexes(): number[] {
        if (this.paletteAnimationIndexes == null) {
            this.paletteAnimationIndexes = new Array<number>();
            for (var tilePiece of this.EachPiece()) {
                if (tilePiece.AnimatedPaletteIndexes == null)
                    continue;
                for (var animatedPaletteIndex of tilePiece.AnimatedPaletteIndexes) {
                    if (this.paletteAnimationIndexes.indexOf(animatedPaletteIndex) == -1) {
                        this.paletteAnimationIndexes.push(animatedPaletteIndex);
                    }
                }
            }
        }
        return this.paletteAnimationIndexes;
    }
    private GetAllTileAnimationIndexes(): number[] {
        if (this.tileAnimationIndexes == null) {
            this.tileAnimationIndexes = new Array<number>();
            for (var tilePiece of this.EachPiece()) {
                for (var tileInfo of tilePiece.Tiles) {
                    var tile = tileInfo.GetTile();
                    if (tile == null)
                        continue;
                    if (tile.AnimatedTileIndexes == null)
                        continue;
                    for (var animatedTileIndex of tile.AnimatedTileIndexes) {
                        if (this.tileAnimationIndexes.indexOf(animatedTileIndex) == -1) {
                            this.tileAnimationIndexes.push(animatedTileIndex);
                        }
                    }
                }
            }
        }
        return this.tileAnimationIndexes;
    }
    public NeverAnimates(): boolean {
        return !(this.HasTileAnimations() || this.HasPixelAnimations());
    }
    public Draw(canvas: CanvasRenderingContext2D, position: Point, layer: ChunkLayerState): void {
        canvas.save();
        {
            canvas.drawImage(this.BaseCanvasCache[layer].Canvas, position.X, position.Y);
            if (this.HasPixelAnimations()) {
                var paletteAnimationCanvases = this.PaletteAnimationCanvasesCache[layer];
                for (var paletteAnimationIndex of this.GetAllPaletteAnimationIndexes()) {
                    var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                    if (paletteAnimationCanvasFrames == null)
                        continue;
                    let currentFrame = SonicManager.Instance.TilePaletteAnimationManager.GetCurrentFrame(paletteAnimationIndex);
                    this.  CurrentPaletteAnimationFrameIndexCache[paletteAnimationIndex] = currentFrame.FrameIndex;
                    var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.Frames[currentFrame.FrameIndex];
                    let canvasLayerToDraw = paletteAnimationCanvasFrame.Canvas.Canvas;
                    canvas.drawImage(canvasLayerToDraw, position.X + paletteAnimationCanvasFrames.Position.X, position.Y + paletteAnimationCanvasFrames.Position.Y);
                }
            }
            if (this.HasTileAnimations()) {
                var tileAnimationCanvases = this.TileAnimationCanvasesCache[layer];
                for (var tileAnimationIndex of this.GetAllTileAnimationIndexes()) {
                    var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                    if (tileAnimationCanvasFrames == null)
                        continue;
                    let currentFrame = SonicManager.Instance.TileAnimationManager.GetCurrentFrame(tileAnimationIndex);
                    this.CurrentTileAnimationFrameIndexCache[tileAnimationIndex] = currentFrame.FrameIndex;
                    var tileAnimationCanvasFrame = tileAnimationCanvasFrames.Frames[currentFrame.FrameIndex];
                    let canvasLayerToDraw = tileAnimationCanvasFrame.Canvas.Canvas;
                    canvas.drawImage(canvasLayerToDraw, position.X + tileAnimationCanvasFrames.Position.X, position.Y + tileAnimationCanvasFrames.Position.Y);
                }
            }
        }
        canvas.restore();
    }
    private drawTilePiecesAnimatedPalette(canvas: CanvasRenderingContext2D, layer: ChunkLayerState, piecesSquareSize: number, animatedPaletteIndex: number): void {
        for (var pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (var pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                var pieceInfo = this.TilePieces[pieceX][pieceY];
                var piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (piece.AnimatedPaletteIndexes.indexOf(animatedPaletteIndex) == -1)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                this.myLocalPoint.X = pieceX * piecesSquareSize;
                this.myLocalPoint.Y = pieceY * piecesSquareSize;
                piece.DrawAnimatedPalette(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedPaletteIndex);
            }
        }
    }
    private drawTilePiecesAnimatedTile(canvas: CanvasRenderingContext2D, layer: ChunkLayerState, piecesSquareSize: number, animatedTileIndex: number): void {
        for (var pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (var pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                var pieceInfo = this.TilePieces[pieceX][pieceY];
                var piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (piece.AnimatedTileIndexes.indexOf(animatedTileIndex) == -1)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                this.myLocalPoint.X = pieceX * piecesSquareSize;
                this.myLocalPoint.Y = pieceY * piecesSquareSize;
                piece.DrawAnimatedTile(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedTileIndex);
            }
        }
    }
    private drawTilePiecesBase(canvas: CanvasRenderingContext2D, layer: ChunkLayerState, piecesSquareSize: number): void {
        for (var pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (var pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                var pieceInfo = this.TilePieces[pieceX][pieceY];
                var piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                this.myLocalPoint.X = pieceX * piecesSquareSize;
                this.myLocalPoint.Y = pieceY * piecesSquareSize;
                piece.DrawBase(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip);
            }
        }
    }





/*cache */

    public ClearCache(): void {

    }
    private BaseCanvasCache: ChunkLayer<CanvasInformation>;
    private PaletteAnimationCanvasesCache: ChunkLayer<{[key:number]: PaletteAnimationCanvasFrames}>;
    private TileAnimationCanvasesCache: ChunkLayer<{[key:number]: TileAnimationCanvasFrames}>;
    public CurrentTileAnimationFrameIndexCache: number[];
    public CurrentPaletteAnimationFrameIndexCache: number[];
    public InitCache(): void {
        this.BaseCanvasCache = new ChunkLayer<CanvasInformation>();
        this.PaletteAnimationCanvasesCache = new ChunkLayer<{[key:number]: PaletteAnimationCanvasFrames}>();
        this.TileAnimationCanvasesCache = new ChunkLayer<{[key:number]: TileAnimationCanvasFrames}>();
        this.TileAnimationCanvasesCache[ChunkLayerState.Low] = {};
        this.TileAnimationCanvasesCache[ChunkLayerState.High] = {};
        this.PaletteAnimationCanvasesCache[ChunkLayerState.Low] = {};
        this.PaletteAnimationCanvasesCache[ChunkLayerState.High] = {};
        this.CurrentTileAnimationFrameIndexCache = new Array<number>();
        this.CurrentPaletteAnimationFrameIndexCache = new Array<number>();
    }
    public WarmCache(): void {
        this.CacheBase(ChunkLayerState.Low);
        this.CacheBase(ChunkLayerState.High);
        if (this.HasPixelAnimations()) {
            this.CachePaletteAnimation(ChunkLayerState.Low);
            this.CachePaletteAnimation(ChunkLayerState.High);
        }
        if (this.HasTileAnimations()) {
            this.CacheTileAnimation(ChunkLayerState.Low);
            this.CacheTileAnimation(ChunkLayerState.High);
        }
    }
    public CacheBase(layer: ChunkLayerState): void {
        if (layer == ChunkLayerState.Low ? (this.OnlyForeground()) : (this.OnlyBackground()))
            return
        this.BaseCanvasCache[layer] = CanvasInformation.Create(TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, false);
        this.drawTilePiecesBase(this.BaseCanvasCache[layer].Context, layer, TileChunk. TilePiecesSquareSize);
    }
    public CachePaletteAnimation(layer: ChunkLayerState): void {
        var paletteAnimationCanvases = this.PaletteAnimationCanvasesCache[layer];
        for (var paletteAnimationIndex of this.GetAllPaletteAnimationIndexes()) {
            var rect = this. getAnimationPaletteSurfaceInformation(paletteAnimationIndex, layer);
            if (rect == null) {
                continue;
            }
            var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex] = new PaletteAnimationCanvasFrames(paletteAnimationIndex);
            var tilePaletteAnimation: TilePaletteAnimation = SonicManager.Instance.TilePaletteAnimationManager.Animations[paletteAnimationIndex];
            paletteAnimationCanvasFrames.Position = new Point(rect.X * TileChunk.TilePiecesSquareSize, rect.Y * TileChunk.TilePiecesSquareSize);
            for (var currentFrame of tilePaletteAnimation.Frames) {
                tilePaletteAnimation.CurrentFrame = currentFrame.FrameIndex;
                var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.Frames[currentFrame.FrameIndex] = new PaletteAnimationCanvasFrame();
                currentFrame.SetPalette();
                var tilePaletteCanvas = CanvasInformation.Create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                paletteAnimationCanvasFrame.Canvas = tilePaletteCanvas;
                paletteAnimationCanvasFrame.Canvas.Context.save();
                paletteAnimationCanvasFrame.Canvas.Context.translate(-rect.X * TileChunk.TilePiecesSquareSize, -rect.Y * TileChunk.TilePiecesSquareSize);
                this.drawTilePiecesAnimatedPalette(tilePaletteCanvas.Context, layer, TileChunk.TilePiecesSquareSize, paletteAnimationIndex);
                paletteAnimationCanvasFrame.Canvas.Context.restore();
                currentFrame.ClearPalette();
            }
            tilePaletteAnimation.CurrentFrame = 0;
        }
    }
    public CacheTileAnimation(layer: ChunkLayerState): void {
        var tileAnimationCanvases = this.TileAnimationCanvasesCache[layer];
        for (var tileAnimationIndex of this.GetAllTileAnimationIndexes()) {
            var rect = this.getAnimationTileSurfaceInformation(tileAnimationIndex, layer);
            if (rect == null) {
                continue;
            }
            var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex] = new TileAnimationCanvasFrames(tileAnimationIndex);
            var tileAnimation: TileAnimation = SonicManager.Instance.TileAnimationManager.Animations[tileAnimationIndex];
            tileAnimationCanvasFrames.Position = new Point(rect.X * TileChunk.TilePiecesSquareSize, rect.Y * TileChunk.TilePiecesSquareSize);
            for (var currentFrame of tileAnimation.Frames) {
                var tileAnimationCanvasFrame = tileAnimationCanvasFrames.Frames[currentFrame.FrameIndex] = new TileAnimationCanvasFrame();
                var tileTileCanvas = CanvasInformation.Create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                tileAnimationCanvasFrame.Canvas = tileTileCanvas;
                tileAnimation.CurrentFrame = currentFrame.FrameIndex;
                tileAnimationCanvasFrame.Canvas.Context.save();
                tileAnimationCanvasFrame.Canvas.Context.translate(-rect.X * TileChunk.TilePiecesSquareSize, -rect.Y * TileChunk.TilePiecesSquareSize);
                this.drawTilePiecesAnimatedTile(tileTileCanvas.Context, layer, TileChunk.TilePiecesSquareSize, tileAnimationIndex);
                tileAnimationCanvasFrame.Canvas.Context.restore();
            }
            tileAnimation.CurrentFrame = 0;
        }
    }
    private getAnimationTileSurfaceInformation(tileAnimationIndex: number, layer: ChunkLayerState): Rectangle {
        var lowestX: number = 10000000;
        var highestX: number = -10000000;
        var lowestY: number = 10000000;
        var highestY: number = -10000000;
        for (var pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (var pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                var pieceInfo = this.TilePieces[pieceX][pieceY];
                var piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                if (piece.AnimatedTileIndexes.indexOf(tileAnimationIndex) == -1)
                    continue;
                if (pieceX < lowestX)
                    lowestX = pieceX;
                if (pieceX > highestX)
                    highestX = pieceX;
                if (pieceY < lowestY)
                    lowestY = pieceY;
                if (pieceY > highestY)
                    highestY = pieceY;
            }
        }
        if (lowestX == 10000000)
            return null;
        return new Rectangle(lowestX, lowestY, highestX - lowestX + 1, highestY - lowestY + 1);
    }
    private getAnimationPaletteSurfaceInformation(paletteAnimationIndex: number, layer: ChunkLayerState): Rectangle {
        var lowestX: number = 10000000;
        var highestX: number = -10000000;
        var lowestY: number = 10000000;
        var highestY: number = -10000000;
        for (var pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (var pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                var piece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                if (piece == null)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                if (piece.AnimatedPaletteIndexes.indexOf(paletteAnimationIndex) == -1)
                    continue;
                if (pieceX < lowestX)
                    lowestX = pieceX;
                if (pieceX > highestX)
                    highestX = pieceX;
                if (pieceY < lowestY)
                    lowestY = pieceY;
                if (pieceY > highestY)
                    highestY = pieceY;
            }
        }
        if (lowestX == 10000000)
            return null;
        return new Rectangle(lowestX, lowestY, highestX - lowestX + 1, highestY - lowestY + 1);
    }

/*debug*/

    public DrawAnimationDebug(canvas: CanvasRenderingContext2D, position: Point, layer: ChunkLayerState, debugDrawOptions: TileChunkDebugDrawOptions): void {
        if (debugDrawOptions == null)
            return
        canvas.save();
        canvas.fillStyle = "White";
        canvas.textBaseline = "top";
        {
            var yOffset: number = layer == ChunkLayerState.Low ? 0 : 64;
            if (debugDrawOptions.ShowBaseData) {
                canvas.fillText("Base", position.X + 0, position.Y + yOffset);
            }
            if (debugDrawOptions.ShowPaletteAnimationData) {
                if (this.HasPixelAnimations()) {
                    var paletteAnimationCanvases = this.PaletteAnimationCanvasesCache[layer];
                    for (var paletteAnimationIndex of this.GetAllPaletteAnimationIndexes()) {
                        var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                        if (paletteAnimationCanvasFrames == null)
                            continue;
                        let currentFrame = SonicManager.Instance.TilePaletteAnimationManager.GetCurrentFrame(paletteAnimationIndex);
                        canvas.fillText("Palette " + paletteAnimationIndex + "-" + currentFrame.FrameIndex, position.X + 25, position.Y + yOffset + (paletteAnimationIndex * 13));
                    }
                }
            }
            if (debugDrawOptions.ShowTileAnimationData) {
                if (this.HasTileAnimations()) {
                    var tileAnimationCanvases = this. TileAnimationCanvasesCache[layer];
                    for (var tileAnimationIndex of this.GetAllTileAnimationIndexes()) {
                        var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                        if (tileAnimationCanvasFrames == null)
                            continue;
                        let currentFrame = SonicManager.Instance.TileAnimationManager.GetCurrentFrame(tileAnimationIndex);
                        canvas.fillText("Tile " + tileAnimationIndex + "-" + currentFrame.FrameIndex, position.X + 75, position.Y + yOffset + (tileAnimationIndex * 13));
                    }
                }
            }
        }
        if (debugDrawOptions.OutlineChunk) {
            canvas.strokeStyle = "black";
            canvas.strokeRect(position.X, position.Y, 128, 128);
        }
        if (debugDrawOptions.OutlineTiles) {
            canvas.strokeStyle = "green";
            for (var x: number = 0; x < TileChunk.TileSideLength; x++) {
                for (var y: number = 0; y < TileChunk.TileSideLength; y++) {
                    canvas.strokeRect(position.X + (x * TileChunk.TileSquareSize), position.Y + (y * TileChunk.TileSquareSize), TileChunk.TileSquareSize, TileChunk.TileSquareSize);
                }
            }
        }
        if (debugDrawOptions.OutlineTilePieces) {
            canvas.strokeStyle = "purple";
            for (var x: number = 0; x < TileChunk.TilePieceSideLength; x++) {
                for (var y: number = 0; y < TileChunk.TilePieceSideLength; y++) {
                    canvas.strokeRect(position.X + (x * TileChunk.TilePiecesSquareSize), position.Y + (y * TileChunk.TilePiecesSquareSize), TileChunk. TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                }
            }
        }
        if (debugDrawOptions.OutlineTile != null) {

        }
        if (debugDrawOptions.OutlineTilePiece != null) {
            canvas.strokeStyle = "yellow";
            for (var x: number = 0; x < TileChunk.TilePieceSideLength; x++) {
                for (var y: number = 0; y < TileChunk.TilePieceSideLength; y++) {
                    var tilePieceInfo = this.GetTilePieceInfo(x, y, false);
                    if (tilePieceInfo == null)
                        continue;
                    var tilePiece = tilePieceInfo.GetTilePiece();
                    if (tilePiece == null)
                        continue;
                    if (tilePiece.Index == debugDrawOptions.OutlineTilePiece.Block) {
                        canvas.strokeRect(position.X + (x * TileChunk.TilePiecesSquareSize), position.Y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                    }
                }
            }
        }
        canvas.restore();
    }
    public Debug_DrawCache(): CanvasInformation {
        var numWide: number = 10;
        var numOfChunks: number = 0;
        for (var i: number = 0; i < 2; i++) {
            var chunkLayer = <ChunkLayerState>i;
            if (this.BaseCanvasCache[chunkLayer] != null)
                numOfChunks++;
            for (var paletteAnimationCanvasCache in this.PaletteAnimationCanvasesCache[chunkLayer]) {
                for (var frame in this.PaletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache].Frames) {
                    numOfChunks++;
                }
            }
            for (var tileAnimationCanvasCache in this.TileAnimationCanvasesCache[chunkLayer]) {
                for (var frame in this.TileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache].Frames) {
                    numOfChunks++;
                }
            }
        }
        var canvas = CanvasInformation.Create((numWide * 128), <number>Math.ceil(numOfChunks / numWide) * 128, false);
        canvas.Context.fillStyle = "#111111";
        canvas.Context.fillRect(0, 0, canvas.Canvas.width, canvas.Canvas.height);
        numOfChunks = 0;
        canvas.Context.strokeStyle = "#FFFFFF";
        canvas.Context.lineWidth = 4;
        for (var i: number = 0; i < 2; i++) {
            var chunkLayer = <ChunkLayerState>i;
            canvas.Context.strokeStyle = chunkLayer == ChunkLayerState.Low ? "Green" : "Yellow";
            if (this.BaseCanvasCache[chunkLayer] != null) {
                var context = canvas.Context;
                context.save();
                var x = <number>((numOfChunks % numWide) * 128);
                var y = <number>Math.floor(numOfChunks / numWide) * 128;
                context.translate(x, y);
                canvas.Context.fillStyle = chunkLayer == ChunkLayerState.Low ? "#333333" : "#777777";
                context.fillRect(0, 0, 128, 128);
                context.drawImage(this.BaseCanvasCache[chunkLayer].Canvas, 0, 0);
                context.strokeRect(0, 0, 128, 128);
                context.restore();
                numOfChunks++;
            }
            canvas.Context.strokeStyle = chunkLayer == ChunkLayerState.Low ? "pink" : "purple";
            for (var paletteAnimationCanvasCache in this.PaletteAnimationCanvasesCache[chunkLayer]) {
                var m = this.PaletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache];
                for (var f in m.Frames) {
                    let frame = m.Frames[f];
                    var context = canvas.Context;
                    context.save();
                    var x = <number>((numOfChunks % numWide) * 128);
                    var y = <number>Math.floor(numOfChunks / numWide) * 128;
                    context.translate(x, y);
                    canvas.Context.fillStyle = chunkLayer == ChunkLayerState.Low ? "#333333" : "#777777";
                    context.fillRect(0, 0, 128, 128);
                    context.drawImage(frame.Canvas.Canvas, m.Position.X, m.Position.Y);
                    context.strokeRect(0, 0, 128, 128);
                    context.restore();
                    numOfChunks++;
                }
            }
            canvas.Context.strokeStyle = chunkLayer == ChunkLayerState.Low ? "red" : "orange";
            for (var tileAnimationCanvasCache in this.TileAnimationCanvasesCache[chunkLayer]) {
                let m = this.TileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache];
                for (var f in m.Frames) {
                    let frame = m.Frames[f];
                    var context = canvas.Context;
                    context.save();
                    var x = <number>((numOfChunks % numWide) * 128);
                    var y = <number>Math.floor(numOfChunks / numWide) * 128;
                    context.translate(x, y);
                    canvas.Context.fillStyle = chunkLayer == ChunkLayerState.Low ? "#333333" : "#777777";
                    context.fillRect(0, 0, 128, 128);
                    context.drawImage(frame.Canvas.Canvas, m.Position.Y, m.Position.Y);
                    context.strokeRect(0, 0, 128, 128);
                    context.restore();
                    numOfChunks++;
                }
            }
        }
        canvas.Context.strokeStyle = "blue";
        canvas.Context.strokeRect(0, 0, canvas.Canvas.width, canvas.Canvas.height);
        canvas.Context.fillStyle = "white";
        canvas.Context.font = "20px bold";
        canvas.Context.fillText("Number Of Chunks: " + numOfChunks, 50, 50);
        return canvas;
    }   

}


export class TileChunkDebugDrawOptions {
    public ShowBaseData: boolean;
    public ShowTileAnimationData: boolean;
    public ShowPaletteAnimationData: boolean;
    public OutlineChunk: boolean;
    public OutlineTilePieces: boolean;
    public OutlineTiles: boolean;
    public OutlineTilePiece: TilePieceInfo;
    public OutlineTile: TileInfo;
}
export class ChunkLayer<T>
{
    [layer: number]:T
}
export class PaletteAnimationCanvasFrames {
    constructor(paletteAnimationIndex: number) {
        this.PaletteAnimationIndex = paletteAnimationIndex;
        this.Frames = {};
    }

    public PaletteAnimationIndex: number;
    public Position: Point;
    public Frames: { [key: number]: PaletteAnimationCanvasFrame };
}
export class PaletteAnimationCanvasFrame {
    public Canvas: CanvasInformation;
}
export class TileAnimationCanvasFrames {
    constructor(tileAnimationIndex: number) {
        this.TileAnimationIndex = tileAnimationIndex;
        this.Frames = {};
    }

    public TileAnimationIndex: number;

    public Position: Point;

    public Frames: { [key: number]: TileAnimationCanvasFrame };
}
export class TileAnimationCanvasFrame {

    public Canvas: CanvasInformation;
}