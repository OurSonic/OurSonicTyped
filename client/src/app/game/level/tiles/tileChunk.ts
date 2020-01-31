import {CanvasInformation} from '../../../common/canvasInformation';
import {TileInfo} from './tileInfo';
import {TilePiece} from './tilePiece';
import {TilePieceInfo} from './tilePieceInfo';

export class TileChunk {
  isOnlyBackground: boolean;
  isOnlyForeground: boolean;
  isEmpty: boolean;
  tilePieces: TilePieceInfo[][];
  index: number;

  constructor() {}

  getTilePieceAt(x: number, y: number, large: boolean): TilePiece {
    return this.getTilePieceInfo(x, y, large).getTilePiece();
  }

  setTilePieceAt(x: number, y: number, tp: TilePiece, large: boolean): void {
    this.getTilePieceInfo(x, y, large).setTilePiece(tp);
  }

  getTilePieceInfo(x: number, y: number, large: boolean): TilePieceInfo {
    if (large) {
      return this.tilePieces[(x / 16) | 0][(y / 16) | 0];
    } else {
      return this.tilePieces[x][y];
    }
  }

  checkOnlyBackground(): void {
    for (const tilePiece of this.eachPiece()) {
      if (!tilePiece.isOnlyBackground) {
        this.isOnlyBackground = false;
        return;
      }
    }
    this.isOnlyBackground = true;
  }

  checkOnlyForeground(): void {
    for (const tilePiece of this.eachPiece()) {
      if (!tilePiece.isOnlyForeground) {
        this.isOnlyForeground = false;
        return;
      }
    }
    this.isOnlyForeground = true;
  }

  checkEmpty(): void {
    for (const tilePiece of this.eachPiece()) {
      if (tilePiece.index !== 0) {
        this.isEmpty = false;
        return;
      }
    }
    this.isEmpty = true;
  }

  private eachPiece(): TilePiece[] {
    const __result = [];
    for (let pieceY: number = 0; pieceY < 8; pieceY++) {
      for (let pieceX: number = 0; pieceX < 8; pieceX++) {
        const tilePiece: TilePiece = this.tilePieces[pieceX][pieceY].getTilePiece();
        if (tilePiece != null) {
          __result.push(tilePiece);
        }
      }
    }
    return __result;
  }

  getImage(): CanvasInformation {
    const info = CanvasInformation.create(128, 128, true);
    for (let pieceY: number = 0; pieceY < 8; pieceY++) {
      for (let pieceX: number = 0; pieceX < 8; pieceX++) {
        const pieceInfo = this.tilePieces[pieceX][pieceY];
        const piece = pieceInfo.getTilePiece();
        if (piece == null) {
          continue;
        }
        const canvas = piece.getImage(pieceInfo.xFlip, pieceInfo.yFlip).canvas;
        info.context.drawImage(canvas, pieceX * 16, pieceY * 16);
      }
    }
    return info;
  }
}

export class TileChunkDebugDrawOptions {
  showBaseData: boolean;
  showTileAnimationData: boolean;
  showPaletteAnimationData: boolean;
  putlineChunk: boolean;
  outlineTilePieces: boolean;
  outlineTiles: boolean;
  outlineTilePiece: TilePieceInfo;
  outlineTile: TileInfo;
}
