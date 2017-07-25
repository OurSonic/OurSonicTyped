export class LevelObjectPiece {
    public assetIndex: number;
    public frameIndex: number;
    public pieceIndex: number;
    public collided: boolean;
    public xflip: boolean;
    public yflip: boolean;
    public visible: boolean;
    public name: string;
    public x:number;
    public y:number;
    constructor(name: string) {
        this.name = name;
    }
}
