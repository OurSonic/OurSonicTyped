import {LevelObjectInfo } from "Level/Objects/LevelObjectInfo";
import {Point} from "../Common/Utils";
import {HeightMap } from "./Level/HeightMap";

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
    public GetChunkAt(x: number, y: number): TileChunk {
        return this.TileChunks[this.ChunkMap[x][y]];
    }
    public ClearCache(): void {
        for (var tile of this.Tiles.Array()) {
            tile.ClearCache();
        }
        for (var chunk of this.TileChunks.Array()) {
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