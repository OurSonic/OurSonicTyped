import {TileInfo} from "./TileInfo";
import {Point} from "../../../common/Utils";
import {ChunkLayer} from "./TileChunk";
import {CanvasInformation} from "../../../common/CanvasInformation";
import {SonicManager} from "../../SonicManager";
import {HeightMap} from "../HeightMap";
import {ChunkLayerState} from "../../../common/Enums";

export class TilePiece {
    static DrawInfo: number[][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    public static DrawOrder: number[][] = [[3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 1, 2, 3]];
    public  isOnlyBackground: boolean = false;
    public isOnlyForeground: boolean = false;
    private shouldAnimate: boolean = false;

    public Tiles: TileInfo[];

    public Index: number = 0;

    public AnimatedPaletteIndexes: number[];
    public AnimatedTileIndexes: number[];

    public Init(): void {
        this.checkOnlyForeground();
        this.checkOnlyBackground();
    }

    public checkOnlyBackground(): void {
        for (let mj of this.Tiles) {
            if (mj && mj.Priority) {
                this.isOnlyBackground = false;
                return;
            }
        }
        this.isOnlyBackground = true
    }

    public checkOnlyForeground(): void {
        for (let mj of this.Tiles) {
            if (mj && !mj.Priority) {
                this.isOnlyForeground = false;
                return;
            }
        }
        this.isOnlyForeground = true;
    }


    public ShouldAnimate(): boolean {
        if (this.shouldAnimate == null) {
            for (let t of this.Tiles) {
                let tile = t.GetTile();
                if (tile) {
                    if (tile.ShouldTileAnimate())
                        return (this.shouldAnimate = true);
                }
            }
            this.shouldAnimate = false;
        }
        return (this.shouldAnimate);
    }

    public getLayer1Angle(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes1[this.Index]];
    }

    public getLayer2Angle(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes2[this.Index]];
    }

    public getLayer1HeightMap(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes1[this.Index]];
    }

    public getLayer2HeightMap(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes2[this.Index]];
    }
}