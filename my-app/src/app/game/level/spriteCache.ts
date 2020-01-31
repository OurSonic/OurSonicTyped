import {CanvasInformation} from '../../common/canvasInformation';

export class SpriteCache {
  Rings: CanvasInformation[];
  HeightMaps: CanvasInformation[];
  SonicSprites: {[key: string]: HTMLImageElement};
  HeightMapChunks: {[key: string]: CanvasInformation};
  Indexes: SpriteCacheIndexes;
  constructor() {
    this.Rings = [];
    this.SonicSprites = {};
    this.HeightMaps = [];
    this.HeightMapChunks = {};
    this.Indexes = new SpriteCacheIndexes();
  }
  ClearCache(): void {
    this.HeightMaps = [];
    this.HeightMapChunks = {};
  }
}
export class SpriteCacheIndexes {
  Sprites: number = 0;
  Tps: number = 0;
  Tcs: number = 0;
  Ss: number = 0;
  Hms: number = 0;
  Hmc: number = 0;
  Tls: number = 0;
  Px: number = 0;
  Aes: number = 0;
}
