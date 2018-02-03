import {LevelObjectInfo} from "./level/objects/LevelObjectInfo";
import {Point} from "../common/Utils";
import {HeightMap} from "./level/HeightMap";
import {Tile} from "./level/tiles/Tile";
import {Ring} from "./level/Ring";
import {TilePiece} from "./level/tiles/TilePiece";
import {TileAnimationData} from "./level/animations/TileAnimationData";
import {TileChunk} from "./level/tiles/TileChunk";

export class SonicLevel {
    public tileAnimations: TileAnimationData[];
    public animatedTileFiles: Tile[][];
    public chunkMap: number[][];
    public rings: Ring[];
    public curHeightMap: boolean = false;
    public levelWidth: number = 0;
    public levelHeight: number = 0;
    public tileChunks: TileChunk[];
    public tiles: Tile[];
    public tilePieces: TilePiece[];
    public objects: LevelObjectInfo[];
    public animatedPalettes: PaletteItem[];
    public palette: number[][];
    public startPositions: Point[];
    public curPaletteIndex: number = 0;
    public angles: number[];
    public collisionIndexes1: number[];
    public collisionIndexes2: number[];
    public heightMaps: HeightMap[];
    public bgChunkMap: number[][];
    public bgLevelWidth: number;
    public bgLevelHeight: number;

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

    public getChunkAt(x: number, y: number): TileChunk {
        return this.tileChunks[this.chunkMap[x][y]];
    }
    public getBackgroundChunkAt(x: number, y: number): TileChunk {
        return this.tileChunks[this.bgChunkMap[x][y]];
    }
    public getTile(tile: number): Tile {
        return this.tiles[tile];
    }

    public getTilePiece(block: number): TilePiece {
        return this.tilePieces[block];
    }

    public setChunkAt(x: number, y: number, tileChunk: TileChunk): void {
        this.chunkMap[x][y] = tileChunk.index;
    }
}

export class PaletteItem {
    public palette: number[];
    public skipIndex: number = 0;
    public totalLength: number = 0;
    public pieces: PaletteItemPieces[];
}

export class PaletteItemPieces {
    public paletteIndex: number = 0;
    public paletteMultiply: number = 0;
    public paletteOffset: number = 0;
}