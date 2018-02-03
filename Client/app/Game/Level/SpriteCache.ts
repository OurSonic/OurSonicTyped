import {CanvasInformation} from "../../common/CanvasInformation";

export class SpriteCache {
    public Rings: CanvasInformation[];
    public HeightMaps: CanvasInformation[];
    public SonicSprites: {[key:string]:HTMLImageElement};
    public HeightMapChunks: {[key:string]:CanvasInformation};
    public Indexes: SpriteCacheIndexes;
    constructor() {
        this.Rings = [];
        this.SonicSprites = {};
        this.HeightMaps = [];
        this.HeightMapChunks = {};
        this.Indexes = new SpriteCacheIndexes();
    }
    public ClearCache(): void {
        this.HeightMaps = [];
        this.HeightMapChunks = {};
    }
}
export class SpriteCacheIndexes {
    public Sprites: number=0;
    public Tps: number = 0;
    public Tcs: number = 0;
    public Ss: number = 0;
    public Hms: number = 0;
    public Hmc: number = 0;
    public Tls: number = 0;
    public Px: number = 0;
    public Aes: number = 0;
}