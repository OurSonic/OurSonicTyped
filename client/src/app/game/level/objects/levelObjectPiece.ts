export class LevelObjectPiece {
  assetIndex: number;
  frameIndex: number;
  pieceIndex: number;
  collided: boolean;
  xflip: boolean;
  yflip: boolean;
  visible: boolean;
  name: string;
  x: number;
  y: number;
  constructor(name: string) {
    this.name = name;
  }
}
