import {CanvasInformation} from "../../common/CanvasInformation";

export class SpriteCache {
    public Rings: CanvasInformation[];
    public TileChunks: CanvasInformation[];
    public Tilepieces: {[key:string]:CanvasInformation};
    public HeightMaps: CanvasInformation[];
    public Tiles: HTMLImageElement[];
    public SonicSprites: {[key:string]:HTMLImageElement};
    public HeightMapChunks: {[key:string]:CanvasInformation};
    public Indexes: SpriteCacheIndexes;
    public AnimationSprites: {[key:string]:CanvasInformation};
    constructor() {
        this.Rings = new Array<CanvasInformation>();
        this.TileChunks = new Array<CanvasInformation>();
        this.Tilepieces = {};
        this.Tiles = new Array<HTMLImageElement>();
        this.SonicSprites = {};
        this.HeightMaps = new Array<CanvasInformation>();
        this.HeightMapChunks = {};
        this.Indexes = new SpriteCacheIndexes();
    }
    public ClearCache(): void {
        this.HeightMaps = new Array<CanvasInformation>();
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