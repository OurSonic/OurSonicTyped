export class LevelObjectPieceLayoutPiece {
    public PieceIndex: number;
    public AssetIndex: number;
    public FrameIndex: number;
    public Priority: boolean;
    public X: number;
    public Y: number;
    public Visible: boolean;
    constructor(pieceIndex: number) {
        this.PieceIndex = pieceIndex;
    }
}
