import {CanvasInformation} from '../../common/canvasInformation';

export class SpriteCache {
  rings: CanvasInformation[];
  heightMaps: CanvasInformation[];
  sonicSprites: {[key: string]: HTMLImageElement};
  heightMapChunks: {[key: string]: CanvasInformation};
  indexes: SpriteCacheIndexes;
  constructor() {
    this.rings = [];
    this.sonicSprites = {};
    this.heightMaps = [];
    this.heightMapChunks = {};
    this.indexes = new SpriteCacheIndexes();
  }
  clearCache(): void {
    this.heightMaps = [];
    this.heightMapChunks = {};
  }
}
export class SpriteCacheIndexes {
  sprites: number = 0;
  tps: number = 0;
  tcs: number = 0;
  ss: number = 0;
  hms: number = 0;
  hmc: number = 0;
  tls: number = 0;
  px: number = 0;
  aes: number = 0;
}
