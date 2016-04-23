export class LevelObjectProjectile {
    public x: number;
    public y: number;
    public xsp: number;
    public ysp: number;
    public xflip: boolean;
    public yflip: boolean;
    public assetIndex: number;
    public frameIndex: number;
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}