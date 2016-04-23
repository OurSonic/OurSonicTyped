export class LevelObjectProjectile {
    public X: number;
    public Y: number;
    public Xsp: number;
    public Ysp: number;
    public Xflip: boolean;
    public Yflip: boolean;
    public AssetIndex: number;
    public FrameIndex: number;
    public Name: string;
    constructor(name: string) {
        this.Name = name;
    }
}