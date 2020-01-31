export class LevelObjectPieceLayoutPiece {
  pieceIndex: number;
  assetIndex: number;
  frameIndex: number;
  priority: boolean;
  x: number;
  y: number;
  visible: boolean;
  constructor(pieceIndex: number) {
    this.pieceIndex = pieceIndex;
  }
}
