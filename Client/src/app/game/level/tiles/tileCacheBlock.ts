import {CanvasInformation} from '../../../common/canvasInformation';
import {TilePieceInfo} from './tilePieceInfo';

export class TileCacheBlock {
  AnimatedKey: number = 0;
  Type: TileCacheBlockType;
  TilePieceInfo: TilePieceInfo;
  Block: CanvasInformation;
  XPos: number = 0;
  YPos: number = 0;
  constructor(type: TileCacheBlockType) {
    this.Type = type;
  }
}
export enum TileCacheBlockType {
  Block,
  TilePiece
}
