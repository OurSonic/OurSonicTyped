import {CanvasInformation} from "../../Common/CanvasInformation";

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
    public Sprites: number;
    public Tps: number;
    public Tcs: number;
    public Ss: number;
    public Hms: number;
    public Hmc: number;
    public Tls: number;
    public Px: number;
    public Aes: number;
}