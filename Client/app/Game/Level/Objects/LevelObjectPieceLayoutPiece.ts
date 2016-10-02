export class LevelObjectPieceLayoutPiece {
    public pieceIndex: number;
    public assetIndex: number;
    public frameIndex: number;
    public priority: boolean;
    public x: number;
    public y: number;
    public visible: boolean;
    constructor(pieceIndex: number) {
        this.pieceIndex = pieceIndex;
    }
}
