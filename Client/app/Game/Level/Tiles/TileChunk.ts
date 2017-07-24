import {Point, Rectangle} from "../../../common/Utils";
import {TilePieceInfo} from "./TilePieceInfo";
import {Solidity} from "../../../SLData";
import {TilePiece} from "./TilePiece";
import {SonicManager} from "../../SonicManager";
import {CanvasInformation} from "../../../common/CanvasInformation";
import {TileInfo} from "./TileInfo";
import {ChunkLayerState} from "../../../common/Enums";
import {TileAnimation} from "./TileAnimationManager";
import {TileAnimationData} from "../Animations/TileAnimationData";

export class TileChunk {
    public static tilePiecesSquareSize: number = 16;
    public static TileSquareSize: number = 8;
    public static Size: number = 128;
    public static TilePieceSideLength: number = 8;
    public static TileSideLength: number = 16;
    private myLocalPoint: Point = new Point(0, 0);
    public isOnlyBackground: boolean;
    public isOnlyForeground: boolean;
    public isEmpty: boolean;
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
    }

    public getTilePieceAt(x: number, y: number, large: boolean): TilePiece {
        return this.getTilePieceInfo(x, y, large).getTilePiece();
    }

    public setTilePieceAt(x: number, y: number, tp: TilePiece, large: boolean): void {
        this.getTilePieceInfo(x, y, large).setTilePiece(tp);
    }

    public getTilePieceInfo(x: number, y: number, large: boolean): TilePieceInfo {
        if (large) {
            return this.TilePieces[(x / TileChunk.tilePiecesSquareSize) | 0][(y / TileChunk.tilePiecesSquareSize) | 0];
        }
        else {
            return this.TilePieces[x][y];
        }
    }

    public checkOnlyBackground(): void {
        for (let tilePiece of this.EachPiece()) {
            if (!tilePiece.isOnlyBackground) {
                this.isOnlyBackground = false;
                return;
            }
        }
        this.isOnlyBackground = true;
    }

    public checkOnlyForeground(): void {
        for (let tilePiece of this.EachPiece()) {
            if (!tilePiece.isOnlyForeground) {
                this.isOnlyForeground = false;
                return;
            }
        }
        this.isOnlyForeground = true;
    }

    public checkEmpty(): void {
        for (let tilePiece of this.EachPiece()) {
            if (tilePiece.Index != 0) {
                this.isEmpty = false;
                return;
            }
        }
        this.isEmpty = true;
    }

    private EachPiece(): TilePiece[] {
        let __result = [];
        for (let pieceY: number = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
            for (let pieceX: number = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                let tilePiece: TilePiece = this.TilePieces[pieceX][pieceY].getTilePiece();
                if (tilePiece != null) {
                    __result.push(tilePiece);
                }
            }
        }
        return __result;
    }

    private hasPixelAnimations(): boolean {
        return this.getAllPaletteAnimationIndexes().length > 0;
    }

    private HasTileAnimations(): boolean {
        return this.getAllTileAnimationIndexes().length > 0;
    }

    private getAllPaletteAnimationIndexes(): number[] {
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

    private getAllTileAnimationIndexes(): number[] {
        if (this.tileAnimationIndexes == null) {
            this.tileAnimationIndexes = [];
            for (let tilePiece of this.EachPiece()) {
                for (let tileInfo of tilePiece.Tiles) {
                    let tile = tileInfo.GetTile();
                    if (tile == null)
                        continue;
                    if (tile.animatedTileIndex == null)
                        continue;
                    if (this.tileAnimationIndexes.indexOf(tile.animatedTileIndex) == -1) {
                        this.tileAnimationIndexes.push(tile.animatedTileIndex);
                    }
                }
            }
        }
        return this.tileAnimationIndexes;
    }

    public neverAnimates(): boolean {
        return !(this.HasTileAnimations() || this.hasPixelAnimations());
    }
}


export class TileChunkDebugDrawOptions {
    public showBaseData: boolean;
    public showTileAnimationData: boolean;
    public showPaletteAnimationData: boolean;
    public putlineChunk: boolean;
    public outlineTilePieces: boolean;
    public outlineTiles: boolean;
    public outlineTilePiece: TilePieceInfo;
    public outlineTile: TileInfo;
}

export class ChunkLayer<T> {
    [layer: number]: T
}

export class PaletteAnimationCanvasFrames {
    constructor(paletteAnimationIndex: number) {
        this.paletteAnimationIndex = paletteAnimationIndex;
        this.frames = {};
    }

    public paletteAnimationIndex: number;
    public position: Point;
    public frames: { [key: number]: PaletteAnimationCanvasFrame };
}

export class PaletteAnimationCanvasFrame {
}

export class TileAnimationCanvasFrames {
    constructor(tileAnimationIndex: number) {
        this.tileAnimationIndex = tileAnimationIndex;
        this.frames = {};
    }

    public tileAnimationIndex: number;

    public position: Point;

    public frames: { [key: number]: TileAnimationCanvasFrame };
}

export class TileAnimationCanvasFrame {

    public canvas: CanvasInformation;
}