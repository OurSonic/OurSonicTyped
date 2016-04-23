export class LevelObjectPiece {
    public assetIndex: number;
    public frameIndex: number;
    public pieceIndex: number;
    public collided: boolean;
    public xflip: boolean;
    public yflip: boolean;
    public visible: boolean;
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}
