import {Point, Rectangle} from "../../../common/Utils";
import {TilePieceInfo} from "./TilePieceInfo";
import {Solidity} from "../../../SLData";
import {TilePiece} from "./TilePiece";
import {SonicManager} from "../../SonicManager";
import {CanvasInformation} from "../../../common/CanvasInformation";
import {TileAnimationData} from "../Animations/TileAnimationData";
import {TilePaletteAnimation} from "./TilePaletteAnimationManager";
import {TileAnimation} from "./TileAnimationManager";
import {TileInfo} from "./TileInfo";
import {ChunkLayerState} from "../../../common/Enums";

export class TileChunk {
    public static TilePiecesSquareSize:number = 16;
    public static TileSquareSize:number = 8;
    public static Size:number = TileChunk.TilePiecesSquareSize * TileChunk.TilePieceSideLength;
    public static TilePieceSideLength:number = 8;
    public static TileSideLength:number = 16;
    private myLocalPoint:Point = new Point(0, 0);
    public IsOnlyBackground:boolean;
    public IsOnlyForeground:boolean;
    private Empty:boolean;
    public TilePieces:TilePieceInfo[][];
    public TileAnimations:{ [key:number]:TileAnimationData };
    public Index:number;
    public HeightBlocks1:Solidity[][];
    public HeightBlocks2:Solidity[][];
    public AngleMap1:number[][];
    public AngleMap2:number[][];
    private tileAnimationIndexes:number[];
    private paletteAnimationIndexes:number[];

    constructor() {
        this.IsOnlyBackground = null;
    }

    public GetTilePieceAt(x:number, y:number, large:boolean):TilePiece {
        return this.GetTilePieceInfo(x, y, large).GetTilePiece();
    }

    public SetTilePieceAt(x:number, y:number, tp:TilePiece, large:boolean):void {
        if (this.GetTilePieceInfo(x, y, large).SetTilePiece(tp))
            this.clearCache();
    }

    public GetTilePieceInfo(x:number, y:number, large:boolean):TilePieceInfo {
        if (large) {
            return this.TilePieces[(x / TileChunk.TilePiecesSquareSize) | 0][(y / TileChunk.TilePiecesSquareSize) | 0];
        }
        else {
            return this.TilePieces[x][y];
        }
    }

    public onlyBackground():boolean {
        if (!this.IsOnlyBackground) {
            for (let tilePiece of this.EachPiece()) {
                if (!tilePiece.OnlyBackground())
                    return (this.IsOnlyBackground = false);
            }
            this.IsOnlyBackground = true;
            return this.IsOnlyBackground;
        }
        return this.IsOnlyBackground;
    }

    public OnlyForeground():boolean {
        if (!this.IsOnlyForeground) {
            for (let tilePiece of this.EachPiece()) {
                if (!tilePiece.OnlyForeground()) {
                    return (this.IsOnlyForeground = false);
                }
            }
            this.IsOnlyForeground = true;
            return this.IsOnlyForeground;
        }
        return this.IsOnlyForeground;
    }

    public isEmpty():boolean {
        if (!this.Empty) {
            for (let tilePiece of this.EachPiece()) {
                if (tilePiece.Index != 0) {
                    return (this.Empty = false);
                }
            }
            this.Empty = true;
        }
        return this.Empty;
    }

    private EachPiece():TilePiece[] {
        let __result = [];
        for (let pieceY:number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX:number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let tilePiece:TilePiece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                if (tilePiece != null) {
                    __result.push(tilePiece);
                }
            }
        }
        return __result;
    }

    private hasPixelAnimations():boolean {
        return this.getAllPaletteAnimationIndexes().length > 0;
    }

    private HasTileAnimations():boolean {
        return this.getAllTileAnimationIndexes().length > 0;
    }

    private getAllPaletteAnimationIndexes():number[] {
        if (this.paletteAnimationIndexes == null) {
            this.paletteAnimationIndexes = [];
            for (let tilePiece of this.EachPiece()) {
                if (tilePiece.AnimatedPaletteIndexes == null)
                    continue;
                for (let animatedPaletteIndex of tilePiece.AnimatedPaletteIndexes) {
                    if (this.paletteAnimationIndexes.indexOf(animatedPaletteIndex) == -1) {
                        this.paletteAnimationIndexes.push(animatedPaletteIndex);
                    }
                }
            }
        }
        return this.paletteAnimationIndexes;
    }

    private getAllTileAnimationIndexes():number[] {
        if (this.tileAnimationIndexes == null) {
            this.tileAnimationIndexes = [];
            for (let tilePiece of this.EachPiece()) {
                for (let tileInfo of tilePiece.Tiles) {
                    let tile = tileInfo.GetTile();
                    if (tile == null)
                        continue;
                    if (tile.animatedTileIndexes == null)
                        continue;
                    for (let animatedTileIndex of tile.animatedTileIndexes) {
                        if (this.tileAnimationIndexes.indexOf(animatedTileIndex) == -1) {
                            this.tileAnimationIndexes.push(animatedTileIndex);
                        }
                    }
                }
            }
        }
        return this.tileAnimationIndexes;
    }

    public neverAnimates():boolean {
        return !(this.HasTileAnimations() || this.hasPixelAnimations());
    }

    public draw(canvas:CanvasRenderingContext2D, position:Point, layer:ChunkLayerState):void {
        canvas.save();
        {
            canvas.drawImage(this.baseCanvasCache[layer].canvas, position.x, position.y);
            if (this.hasPixelAnimations()) {
                let paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                for (let paletteAnimationIndex of this.getAllPaletteAnimationIndexes()) {
                    let paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                    if (paletteAnimationCanvasFrames == null)
                        continue;
                    let currentFrame = SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                    if (!currentFrame) {

                        debugger;
                        let currentFrame = SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                    }
                    this.currentPaletteAnimationFrameIndexCache[paletteAnimationIndex] = currentFrame.FrameIndex;
                    let paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.Frames[currentFrame.FrameIndex];
                    let canvasLayerToDraw = paletteAnimationCanvasFrame.Canvas.canvas;
                    canvas.drawImage(canvasLayerToDraw, position.x + paletteAnimationCanvasFrames.Position.x, position.y + paletteAnimationCanvasFrames.Position.y);
                }
            }
            if (this.HasTileAnimations()) {
                let tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                for (let tileAnimationIndex of this.getAllTileAnimationIndexes()) {
                    let tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                    if (tileAnimationCanvasFrames == null)
                        continue;
                    let currentFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(tileAnimationIndex);
                    this.currentTileAnimationFrameIndexCache[tileAnimationIndex] = currentFrame.frameIndex;
                    let tileAnimationCanvasFrame = tileAnimationCanvasFrames.Frames[currentFrame.frameIndex];
                    let canvasLayerToDraw = tileAnimationCanvasFrame.Canvas.canvas;
                    canvas.drawImage(canvasLayerToDraw, position.x + tileAnimationCanvasFrames.Position.x, position.y + tileAnimationCanvasFrames.Position.y);
                }
            }
        }
        canvas.restore();
    }

    private drawTilePiecesAnimatedPalette(canvas:CanvasRenderingContext2D, layer:ChunkLayerState, piecesSquareSize:number, animatedPaletteIndex:number):void {
        for (let pieceY:number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX:number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let pieceInfo = this.TilePieces[pieceX][pieceY];
                let piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (piece.AnimatedPaletteIndexes.indexOf(animatedPaletteIndex) == -1)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                this.myLocalPoint.x = pieceX * piecesSquareSize;
                this.myLocalPoint.y = pieceY * piecesSquareSize;
                piece.DrawAnimatedPalette(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedPaletteIndex);
            }
        }
    }

    private drawTilePiecesAnimatedTile(canvas:CanvasRenderingContext2D, layer:ChunkLayerState, piecesSquareSize:number, animatedTileIndex:number):void {
        for (let pieceY:number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX:number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let pieceInfo = this.TilePieces[pieceX][pieceY];
                let piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (piece.AnimatedTileIndexes.indexOf(animatedTileIndex) == -1)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                this.myLocalPoint.x = pieceX * piecesSquareSize;
                this.myLocalPoint.y = pieceY * piecesSquareSize;
                piece.DrawAnimatedTile(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedTileIndex);
            }
        }
    }

    private drawTilePiecesBase(canvas:CanvasRenderingContext2D, layer:ChunkLayerState, piecesSquareSize:number):void {
        for (let pieceY:number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX:number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let pieceInfo = this.TilePieces[pieceX][pieceY];
                let piece = pieceInfo.GetTilePiece();
                if (piece == null)
                    continue;
                if (layer == ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                    continue;
                this.myLocalPoint.x = pieceX * piecesSquareSize;
                this.myLocalPoint.y = pieceY * piecesSquareSize;
                piece.DrawBase(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip);
            }
        }
    }


    /*cache */

    public clearCache():void {
        this.initCache();
        this.warmCache();
    }

    private baseCanvasCache:ChunkLayer<CanvasInformation>;
    private paletteAnimationCanvasesCache:ChunkLayer<{[key:number]:PaletteAnimationCanvasFrames}>;
    private tileAnimationCanvasesCache:ChunkLayer<{[key:number]:TileAnimationCanvasFrames}>;
    public currentTileAnimationFrameIndexCache:number[];
    public currentPaletteAnimationFrameIndexCache:number[];

    public initCache():void {
        this.baseCanvasCache = new ChunkLayer<CanvasInformation>();
        this.paletteAnimationCanvasesCache = new ChunkLayer<{[key:number]:PaletteAnimationCanvasFrames}>();
        this.tileAnimationCanvasesCache = new ChunkLayer<{[key:number]:TileAnimationCanvasFrames}>();
        this.tileAnimationCanvasesCache[ChunkLayerState.Low] = {};
        this.tileAnimationCanvasesCache[ChunkLayerState.High] = {};
        this.paletteAnimationCanvasesCache[ChunkLayerState.Low] = {};
        this.paletteAnimationCanvasesCache[ChunkLayerState.High] = {};
        this.currentTileAnimationFrameIndexCache = [];
        this.currentPaletteAnimationFrameIndexCache = [];
    }

    public warmCache():void {
        this.cacheBase(ChunkLayerState.Low);
        this.cacheBase(ChunkLayerState.High);
        if (this.hasPixelAnimations()) {
            this.cachePaletteAnimation(ChunkLayerState.Low);
            this.cachePaletteAnimation(ChunkLayerState.High);
        }
        if (this.HasTileAnimations()) {
            this.cacheTileAnimation(ChunkLayerState.Low);
            this.cacheTileAnimation(ChunkLayerState.High);
        }
    }

    public cacheBase(layer:ChunkLayerState):void {
        if (layer == ChunkLayerState.Low ? (this.OnlyForeground()) : (this.onlyBackground()))
            return
        this.baseCanvasCache[layer] = CanvasInformation.create(TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, false);
        this.drawTilePiecesBase(this.baseCanvasCache[layer].Context, layer, TileChunk.TilePiecesSquareSize);
    }

    public cachePaletteAnimation(layer:ChunkLayerState):void {
        let paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
        for (let paletteAnimationIndex of this.getAllPaletteAnimationIndexes()) {
            let rect = this.getAnimationPaletteSurfaceInformation(paletteAnimationIndex, layer);
            if (rect == null) {
                continue;
            }
            let paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex] = new PaletteAnimationCanvasFrames(paletteAnimationIndex);
            let tilePaletteAnimation:TilePaletteAnimation = SonicManager.instance.tilePaletteAnimationManager.Animations[paletteAnimationIndex];
            paletteAnimationCanvasFrames.Position = new Point(rect.x * TileChunk.TilePiecesSquareSize, rect.y * TileChunk.TilePiecesSquareSize);
            for (let currentFrame of tilePaletteAnimation.Frames) {
                tilePaletteAnimation.CurrentFrame = currentFrame.FrameIndex;
                let paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.Frames[currentFrame.FrameIndex] = new PaletteAnimationCanvasFrame();
                currentFrame.SetPalette();
                let tilePaletteCanvas = CanvasInformation.create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                paletteAnimationCanvasFrame.Canvas = tilePaletteCanvas;
                paletteAnimationCanvasFrame.Canvas.Context.save();
                paletteAnimationCanvasFrame.Canvas.Context.translate(-rect.x * TileChunk.TilePiecesSquareSize, -rect.y * TileChunk.TilePiecesSquareSize);
                this.drawTilePiecesAnimatedPalette(tilePaletteCanvas.Context, layer, TileChunk.TilePiecesSquareSize, paletteAnimationIndex);
                paletteAnimationCanvasFrame.Canvas.Context.restore();
                currentFrame.ClearPalette();
            }
            tilePaletteAnimation.CurrentFrame = 0;
        }
    }

    public cacheTileAnimation(layer:ChunkLayerState):void {
        let tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
        for (let tileAnimationIndex of this.getAllTileAnimationIndexes()) {
            let rect = this.getAnimationTileSurfaceInformation(tileAnimationIndex, layer);
            if (rect == null) {
                continue;
            }
            let tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex] = new TileAnimationCanvasFrames(tileAnimationIndex);
            let tileAnimation:TileAnimation = SonicManager.instance.tileAnimationManager.Animations[tileAnimationIndex];
            tileAnimationCanvasFrames.Position = new Point(rect.x * TileChunk.TilePiecesSquareSize, rect.y * TileChunk.TilePiecesSquareSize);
            for (let currentFrame of tileAnimation.frames) {
                let tileAnimationCanvasFrame = tileAnimationCanvasFrames.Frames[currentFrame.frameIndex] = new TileAnimationCanvasFrame();
                let tileTileCanvas = CanvasInformation.create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                tileAnimationCanvasFrame.Canvas = tileTileCanvas;
                tileAnimation.currentFrame = currentFrame.frameIndex;
                tileAnimationCanvasFrame.Canvas.Context.save();
                tileAnimationCanvasFrame.Canvas.Context.translate(-rect.x * TileChunk.TilePiecesSquareSize, -rect.y * TileChunk.TilePiecesSquareSize);
                this.drawTilePiecesAnimatedTile(tileTileCanvas.Context, layer, TileChunk.TilePiecesSquareSize, tileAnimationIndex);
                tileAnimationCanvasFrame.Canvas.Context.restore();
            }
            tileAnimation.currentFrame = 0;
        }
    }

    private getAnimationTileSurfaceInformation(tileAnimationIndex:number, layer:ChunkLayerState):Rectangle {
        let lowestX:number = 10000000;
        let highestX:number = -10000000;
        let lowestY:number = 10000000;
        let highestY:number = -10000000;
        for (let pieceY:number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX:number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let pieceInfo = this.TilePieces[pieceX][pieceY];
                let piece = pieceInfo.GetTilePiece();
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

    private getAnimationPaletteSurfaceInformation(paletteAnimationIndex:number, layer:ChunkLayerState):Rectangle {
        let lowestX:number = 10000000;
        let highestX:number = -10000000;
        let lowestY:number = 10000000;
        let highestY:number = -10000000;
        for (let pieceY:number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX:number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let piece = this.TilePieces[pieceX][pieceY].GetTilePiece();
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

    public DrawAnimationDebug(canvas:CanvasRenderingContext2D, position:Point, layer:ChunkLayerState, debugDrawOptions:TileChunkDebugDrawOptions):void {
        if (debugDrawOptions == null)
            return
        canvas.save();
        canvas.fillStyle = "White";
        canvas.textBaseline = "top";
        {
            let yOffset:number = layer == ChunkLayerState.Low ? 0 : 64;
            if (debugDrawOptions.ShowBaseData) {
                canvas.fillText("Base", position.x + 0, position.y + yOffset);
            }
            if (debugDrawOptions.ShowPaletteAnimationData) {
                if (this.hasPixelAnimations()) {
                    let paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                    for (let paletteAnimationIndex of this.getAllPaletteAnimationIndexes()) {
                        let paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                        if (paletteAnimationCanvasFrames == null)
                            continue;
                        let currentFrame = SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                        canvas.fillText("Palette " + paletteAnimationIndex + "-" + currentFrame.FrameIndex, position.x + 25, position.y + yOffset + (paletteAnimationIndex * 13));
                    }
                }
            }
            if (debugDrawOptions.ShowTileAnimationData) {
                if (this.HasTileAnimations()) {
                    let tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                    for (let tileAnimationIndex of this.getAllTileAnimationIndexes()) {
                        let tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                        if (tileAnimationCanvasFrames == null)
                            continue;
                        let currentFrame = SonicManager.instance.tileAnimationManager.getCurrentFrame(tileAnimationIndex);
                        canvas.fillText("Tile " + tileAnimationIndex + "-" + currentFrame.frameIndex, position.x + 75, position.y + yOffset + (tileAnimationIndex * 13));
                    }
                }
            }
        }
        if (debugDrawOptions.OutlineChunk) {
            canvas.strokeStyle = "black";
            canvas.strokeRect(position.x, position.y, 128, 128);
        }
        if (debugDrawOptions.OutlineTiles) {
            canvas.strokeStyle = "green";
            for (let x:number = 0; x < TileChunk.TileSideLength; x++) {
                for (let y:number = 0; y < TileChunk.TileSideLength; y++) {
                    canvas.strokeRect(position.x + (x * TileChunk.TileSquareSize), position.y + (y * TileChunk.TileSquareSize), TileChunk.TileSquareSize, TileChunk.TileSquareSize);
                }
            }
        }
        if (debugDrawOptions.OutlineTilePieces) {
            canvas.strokeStyle = "purple";
            for (let x:number = 0; x < TileChunk.TilePieceSideLength; x++) {
                for (let y:number = 0; y < TileChunk.TilePieceSideLength; y++) {
                    canvas.strokeRect(position.x + (x * TileChunk.TilePiecesSquareSize), position.y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                }
            }
        }
        if (debugDrawOptions.OutlineTile != null) {

        }
        if (debugDrawOptions.OutlineTilePiece != null) {
            canvas.strokeStyle = "yellow";
            for (let x:number = 0; x < TileChunk.TilePieceSideLength; x++) {
                for (let y:number = 0; y < TileChunk.TilePieceSideLength; y++) {
                    let tilePieceInfo = this.GetTilePieceInfo(x, y, false);
                    if (tilePieceInfo == null)
                        continue;
                    let tilePiece = tilePieceInfo.GetTilePiece();
                    if (tilePiece == null)
                        continue;
                    if (tilePiece.Index == debugDrawOptions.OutlineTilePiece.Block) {
                        canvas.strokeRect(position.x + (x * TileChunk.TilePiecesSquareSize), position.y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                    }
                }
            }
        }
        canvas.restore();
    }

    public Debug_DrawCache():CanvasInformation {
        let numWide:number = 10;
        let numOfChunks:number = 0;
        for (let i:number = 0; i < 2; i++) {
            let chunkLayer = <ChunkLayerState>i;
            if (this.baseCanvasCache[chunkLayer] != null)
                numOfChunks++;
            for (let paletteAnimationCanvasCache in this.paletteAnimationCanvasesCache[chunkLayer]) {
                for (let frame in this.paletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache].frames) {
                    numOfChunks++;
                }
            }
            for (let tileAnimationCanvasCache in this.tileAnimationCanvasesCache[chunkLayer]) {
                for (let frame in this.tileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache].frames) {
                    numOfChunks++;
                }
            }
        }
        let canvas = CanvasInformation.create((numWide * 128), (Math.ceil(numOfChunks / numWide) | 0) * 128, false);
        canvas.Context.fillStyle = "#111111";
        canvas.Context.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        numOfChunks = 0;
        canvas.Context.strokeStyle = "#FFFFFF";
        canvas.Context.lineWidth = 4;
        for (let i:number = 0; i < 2; i++) {
            let chunkLayer = <ChunkLayerState>i;
            canvas.Context.strokeStyle = chunkLayer == ChunkLayerState.Low ? "Green" : "Yellow";
            if (this.baseCanvasCache[chunkLayer] != null) {
                let context = canvas.Context;
                context.save();
                let x = ((numOfChunks % numWide) * 128) | 0;
                let y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                context.translate(x, y);
                canvas.Context.fillStyle = chunkLayer == ChunkLayerState.Low ? "#333333" : "#777777";
                context.fillRect(0, 0, 128, 128);
                context.drawImage(this.baseCanvasCache[chunkLayer].canvas, 0, 0);
                context.strokeRect(0, 0, 128, 128);
                context.restore();
                numOfChunks++;
            }
            canvas.Context.strokeStyle = chunkLayer == ChunkLayerState.Low ? "pink" : "purple";
            for (let paletteAnimationCanvasCache in this.paletteAnimationCanvasesCache[chunkLayer]) {
                let m = this.paletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache];
                for (let f in m.frames) {
                    let frame = m.frames[f];
                    let context = canvas.Context;
                    context.save();
                    let x = ((numOfChunks % numWide) * 128) | 0;
                    let y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                    context.translate(x, y);
                    canvas.Context.fillStyle = chunkLayer == ChunkLayerState.Low ? "#333333" : "#777777";
                    context.fillRect(0, 0, 128, 128);
                    context.drawImage(frame.canvas.canvas, m.Position.x, m.Position.y);
                    context.strokeRect(0, 0, 128, 128);
                    context.restore();
                    numOfChunks++;
                }
            }
            canvas.Context.strokeStyle = chunkLayer == ChunkLayerState.Low ? "red" : "orange";
            for (let tileAnimationCanvasCache in this.tileAnimationCanvasesCache[chunkLayer]) {
                let m = this.tileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache];
                for (let f in m.frames) {
                    let frame = m.frames[f];
                    let context = canvas.Context;
                    context.save();
                    let x = ((numOfChunks % numWide) * 128) | 0;
                    let y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                    context.translate(x, y);
                    canvas.Context.fillStyle = chunkLayer == ChunkLayerState.Low ? "#333333" : "#777777";
                    context.fillRect(0, 0, 128, 128);
                    context.drawImage(frame.canvas.canvas, m.Position.y, m.Position.y);
                    context.strokeRect(0, 0, 128, 128);
                    context.restore();
                    numOfChunks++;
                }
            }
        }
        canvas.Context.strokeStyle = "blue";
        canvas.Context.strokeRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.Context.fillStyle = "white";
        canvas.Context.font = "20px bold";
        canvas.Context.fillText("Number Of Chunks: " + numOfChunks, 50, 50);
        return canvas;
    }

}


export class TileChunkDebugDrawOptions {
    public ShowBaseData:boolean;
    public ShowTileAnimationData:boolean;
    public ShowPaletteAnimationData:boolean;
    public OutlineChunk:boolean;
    public OutlineTilePieces:boolean;
    public OutlineTiles:boolean;
    public OutlineTilePiece:TilePieceInfo;
    public OutlineTile:TileInfo;
}
export class ChunkLayer<T> {
    [layer:number]:T
}
export class PaletteAnimationCanvasFrames {
    constructor(paletteAnimationIndex:number) {
        this.PaletteAnimationIndex = paletteAnimationIndex;
        this.Frames = {};
    }

    public PaletteAnimationIndex:number;
    public Position:Point;
    public Frames:{ [key:number]:PaletteAnimationCanvasFrame };
}
export class PaletteAnimationCanvasFrame {
    public Canvas:CanvasInformation;
}
export class TileAnimationCanvasFrames {
    constructor(tileAnimationIndex:number) {
        this.TileAnimationIndex = tileAnimationIndex;
        this.Frames = {};
    }

    public TileAnimationIndex:number;

    public Position:Point;

    public Frames:{ [key:number]:TileAnimationCanvasFrame };
}
export class TileAnimationCanvasFrame {

    public Canvas:CanvasInformation;
}