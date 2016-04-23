export class LevelObjectPiece {
    public AssetIndex: number;
    public FrameIndex: number;
    public PieceIndex: number;
    public Collided: boolean;
    public Xflip: boolean;
    public Yflip: boolean;
    public Visible: boolean;
    public Name: string;
    constructor(name: string) {
        this.Name = name;
    }
}
