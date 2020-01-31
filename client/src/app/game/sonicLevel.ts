import {Point} from '../common/utils';
import {TileAnimationData} from './level/animations/tileAnimationData';
import {HeightMap} from './level/heightMap';
import {LevelObjectInfo} from './level/objects/levelObjectInfo';
import {Ring} from './level/ring';
import {Tile} from './level/tiles/tile';
import {TileChunk} from './level/tiles/tileChunk';
import {TilePiece} from './level/tiles/tilePiece';
import {Help} from '../common/help';

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

  getTilePieceAt(x: number, y: number) {
    x = x | 0;
    y = y | 0;
    const tileChunkX = (x / 128) | 0;
    const tileChunkY = (Help.mod(y, this.levelHeight * 128) / 128) | 0;

    const chunk = this.getChunkAt(tileChunkX, tileChunkY);
    if (!chunk) {
      return undefined;
    }

    const interChunkX = x - tileChunkX * 128;
    const interChunkY = y - tileChunkY * 128;

    const tileX = (interChunkX / 16) | 0;
    const tileY = (interChunkY / 16) | 0;

    const interTileX = interChunkX - tileX * 16;
    const interTileY = interChunkY - tileY * 16;

    const tilePiece = chunk.getTilePieceAt(tileX, tileY, false);
    if (tilePiece === undefined) {
      return undefined;
    }
    const tilePieceInfo = chunk.getTilePieceInfo(tileX, tileY, false);
    const solidity = this.curHeightMap ? tilePieceInfo.solid1 : tilePieceInfo.solid2;

    const heightMap = this.curHeightMap ? tilePiece.getLayer1HeightMap() : tilePiece.getLayer2HeightMap();
    let tileAngle = this.curHeightMap ? tilePiece.getLayer1Angle() : tilePiece.getLayer2Angle();

    if (!(tileAngle === 0 || tileAngle === 255 || tileAngle === 1)) {
      if (tilePieceInfo.xFlip) {
        if (tilePieceInfo.yFlip) {
          tileAngle = 192 - tileAngle + 192;
          tileAngle = 128 - tileAngle + 128;
        } else {
          tileAngle = 128 - tileAngle + 128;
        }
      } else {
        if (tilePieceInfo.yFlip) {
          tileAngle = 192 - tileAngle + 192;
        } else {
          tileAngle = tileAngle;
        }
      }
    }

    let collisionMap: boolean[];
    if (tilePieceInfo.xFlip) {
      if (tilePieceInfo.yFlip) {
        collisionMap = heightMap.collisionBlockXFlipYFlip;
      } else {
        collisionMap = heightMap.collisionBlockXFlip;
      }
    } else {
      if (tilePieceInfo.yFlip) {
        collisionMap = heightMap.collisionBlockYFlip;
      } else {
        collisionMap = heightMap.collisionBlock;
      }
    }
    return {
      collisionMap,
      tileAngle,
      solidity,
      interTileX,
      interTileY,
      tilePiece,
      tileLeftEdge: x - interTileX,
      tileRightEdge: x - interTileX + 16,
      tileTopEdge: y - interTileY,
      tileBottomEdge: y - interTileY + 16
    };
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
