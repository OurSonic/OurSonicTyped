import {LevelObjectInfo } from "Level/Objects/LevelObjectInfo";
import {Point} from "../Common/Utils";
import {HeightMap } from "./Level/HeightMap";
import {Tile } from "./Level/Tiles/Tile";
import {Ring } from "./Level/Ring";
import {TilePiece } from "./Level/Tiles/TilePiece";
import {TileAnimationData} from "./Level/Animations/TileAnimationData";
import {TileChunk  } from "./Level/Tiles/TileChunk";

export class SonicLevel {
    public TileAnimations: TileAnimationData[];
    public AnimatedTileFiles: Tile[][];
    public ChunkMap: number[][];
    public Rings: Ring[];
    public CurHeightMap: boolean;
    public LevelWidth: number;
    public LevelHeight: number;
    public TileChunks: TileChunk[];
    public Tiles: Tile[];
    public TilePieces: TilePiece[];
    public Objects: LevelObjectInfo[];
    public AnimatedPalettes: PaletteItem[];
    public Palette: string[][];
    public StartPositions: Point[];
    public CurPaletteIndex: number;
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
            chunk.ClearCache();
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
    public SkipIndex: number;
    public TotalLength: number;
    public Pieces: PaletteItemPieces[];
}
export class PaletteItemPieces {
    public PaletteIndex: number;
    public PaletteMultiply: number;
    public PaletteOffset: number;
}