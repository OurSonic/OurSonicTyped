import {LevelObjectInfo } from "./level/Objects/LevelObjectInfo";
import {Point} from "../common/Utils";
import {HeightMap } from "./level/HeightMap";
import {Tile } from "./level/Tiles/Tile";
import {Ring } from "./level/Ring";
import {TilePiece } from "./level/Tiles/TilePiece";
import {TileAnimationData} from "./level/Animations/TileAnimationData";
import {TileChunk  } from "./level/Tiles/TileChunk";

export class SonicLevel {
    public TileAnimations: TileAnimationData[];
    public AnimatedTileFiles: Tile[][];
    public ChunkMap: number[][];
    public Rings: Ring[];
    public CurHeightMap: boolean=false;
    public LevelWidth: number=0;
    public LevelHeight: number=0;
    public TileChunks: TileChunk[];
    public Tiles: Tile[];
    public TilePieces: TilePiece[];
    public Objects: LevelObjectInfo[];
    public AnimatedPalettes: PaletteItem[];
    public Palette: string[][];
    public StartPositions: Point[];
    public CurPaletteIndex: number=0;
    public Angles: number[];
    public CollisionIndexes1: number[];
    public CollisionIndexes2: number[];
    public HeightMaps: HeightMap[];
    public AnimatedChunks: TileChunk[];
    public BGChunkMap: number[][];

    constructor() {
        this.Tiles = new Array<Tile>();
        this.TilePieces = new Array<TilePiece>();
        this.TileChunks = new Array<TileChunk>();
        this.ChunkMap = new Array(0);
        this.Rings = new Array<Ring>();
        this.Objects = new Array<LevelObjectInfo>();
        this.HeightMaps = new Array<HeightMap>();
        this.Tiles = new Array<Tile>();
        this.CurHeightMap = true;
        this.CurPaletteIndex = 0;
        this.LevelWidth = 0;
        this.LevelHeight = 0;
    }
    public getChunkAt(x: number, y: number): TileChunk {
        return this.TileChunks[this.ChunkMap[x][y]];
    }
    public ClearCache(): void {
        for (let tile of this.Tiles) {
            tile.ClearCache();
        }
        for (let chunk of this.TileChunks) {
            chunk.clearCache();
        }
    }
    public GetTile(tile: number): Tile {
        return this.Tiles[tile];
    }
    public GetTilePiece(block: number): TilePiece {
        return this.TilePieces[block];
    }
    public SetChunkAt(x: number, y: number, tileChunk: TileChunk): void {
        this.ChunkMap[x][y] = tileChunk.Index;
    }
}

export class PaletteItem {
    public Palette: string[];
    public SkipIndex: number=0;
    public TotalLength: number=0;
    public Pieces: PaletteItemPieces[];
}
export class PaletteItemPieces {
    public PaletteIndex: number=0;
    public PaletteMultiply: number=0;
    public PaletteOffset: number=0;
}