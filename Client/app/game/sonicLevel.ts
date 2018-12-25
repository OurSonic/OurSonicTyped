import {Point} from '../common/utils';
import {TileAnimationData} from './level/animations/tileAnimationData';
import {HeightMap} from './level/heightMap';
import {LevelObjectInfo} from './level/objects/levelObjectInfo';
import {Ring} from './level/ring';
import {Tile} from './level/tiles/tile';
import {TileChunk} from './level/tiles/tileChunk';
import {TilePiece} from './level/tiles/tilePiece';

export class SonicLevel {
  tileAnimations: TileAnimationData[];
  animatedTileFiles: Tile[][];
  chunkMap: number[][];
  rings: Ring[];
  curHeightMap: boolean = false;
  levelWidth: number = 0;
  levelHeight: number = 0;
  tileChunks: TileChunk[];
  tiles: Tile[];
  tilePieces: TilePiece[];
  objects: LevelObjectInfo[];
  animatedPalettes: PaletteItem[];
  palette: number[][];
  startPositions: Point[];
  curPaletteIndex: number = 0;
  angles: number[];
  collisionIndexes1: number[];
  collisionIndexes2: number[];
  heightMaps: HeightMap[];
  bgChunkMap: number[][];
  bgLevelWidth: number;
  bgLevelHeight: number;

  constructor() {
    this.tiles = [];
    this.tilePieces = [];
    this.tileChunks = [];
    this.chunkMap = [];
    this.rings = [];
    this.objects = [];
    this.heightMaps = [];
    this.tiles = [];
    this.curHeightMap = true;
    this.curPaletteIndex = 0;
    this.levelWidth = 0;
    this.levelHeight = 0;
  }

  getChunkAt(x: number, y: number): TileChunk {
    return this.tileChunks[this.chunkMap[x][y]];
  }
  getBackgroundChunkAt(x: number, y: number): TileChunk {
    return this.tileChunks[this.bgChunkMap[x][y]];
  }
  getTile(tile: number): Tile {
    return this.tiles[tile];
  }

  getTilePiece(block: number): TilePiece {
    return this.tilePieces[block];
  }

  setChunkAt(x: number, y: number, tileChunk: TileChunk): void {
    this.chunkMap[x][y] = tileChunk.index;
  }
}

export class PaletteItem {
  palette: number[];
  skipIndex: number = 0;
  totalLength: number = 0;
  pieces: PaletteItemPieces[];
}

export class PaletteItemPieces {
  paletteIndex: number = 0;
  paletteMultiply: number = 0;
  paletteOffset: number = 0;
}
