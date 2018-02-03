import {Point, Rectangle} from "../../../common/Utils";
import {TilePieceInfo} from "./TilePieceInfo";
import {Solidity} from "../../../SLData";
import {TilePiece} from "./TilePiece";
import {SonicManager} from "../../SonicManager";
import {CanvasInformation} from "../../../common/CanvasInformation";
import {TileInfo} from "./TileInfo";
import {ChunkLayerState} from "../../../common/Enums";
import {TileAnimation} from "./TileAnimationManager";
import {TileAnimationData} from "../animations/TileAnimationData";

export class TileChunk {
    public isOnlyBackground: boolean;
    public isOnlyForeground: boolean;
    public isEmpty: boolean;
    public tilePieces: TilePieceInfo[][];
    public index: number;

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
            return this.tilePieces[(x / 16) | 0][(y / 16) | 0];
        }
        else {
            return this.tilePieces[x][y];
        }
    }

    public checkOnlyBackground(): void {
        for (let tilePiece of this.eachPiece()) {
            if (!tilePiece.isOnlyBackground) {
                this.isOnlyBackground = false;
                return;
            }
        }
        this.isOnlyBackground = true;
    }

    public checkOnlyForeground(): void {
        for (let tilePiece of this.eachPiece()) {
            if (!tilePiece.isOnlyForeground) {
                this.isOnlyForeground = false;
                return;
            }
        }
        this.isOnlyForeground = true;
    }

    public checkEmpty(): void {
        for (let tilePiece of this.eachPiece()) {
            if (tilePiece.index != 0) {
                this.isEmpty = false;
                return;
            }
        }
        this.isEmpty = true;
    }

    private eachPiece(): TilePiece[] {
        let __result = [];
        for (let pieceY: number = 0; pieceY < 8; pieceY++) {
            for (let pieceX: number = 0; pieceX < 8; pieceX++) {
                let tilePiece: TilePiece = this.tilePieces[pieceX][pieceY].getTilePiece();
                if (tilePiece != null) {
                    __result.push(tilePiece);
                }
            }
        }
        return __result;
    }

    public getImage(): CanvasInformation {
        let info = CanvasInformation.create(128, 128, true);
        for (let pieceY: number = 0; pieceY < 8; pieceY++) {
            for (let pieceX: number = 0; pieceX < 8; pieceX++) {
                let pieceInfo = this.tilePieces[pieceX][pieceY];
                let piece = pieceInfo.getTilePiece();
                if (piece == null)
                    continue;
                let canvas = piece.getImage(pieceInfo.xFlip, pieceInfo.yFlip).canvas;
                info.context.drawImage(canvas, pieceX * 16, pieceY * 16);
            }
        }
        return info;
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
