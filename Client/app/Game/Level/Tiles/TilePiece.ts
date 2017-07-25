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
    public isOnlyBackground: boolean = false;
    public isOnlyForeground: boolean = false;

    public tiles: TileInfo[];

    public index: number = 0;

    public animatedPaletteIndexes: number[];
    public animatedTileIndexes: number[];

    public Init(): void {
        this.checkOnlyForeground();
        this.checkOnlyBackground();
    }

    public checkOnlyBackground(): void {
        for (let mj of this.tiles) {
            if (mj && mj.priority) {
                this.isOnlyBackground = false;
                return;
            }
        }
        this.isOnlyBackground = true
    }

    public checkOnlyForeground(): void {
        for (let mj of this.tiles) {
            if (mj && !mj.priority) {
                this.isOnlyForeground = false;
                return;
            }
        }
        this.isOnlyForeground = true;
    }


    public getLayer1Angle(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes1[this.index]];
    }

    public getLayer2Angle(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes2[this.index]];
    }

    public getLayer1HeightMap(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes1[this.index]];
    }

    public getLayer2HeightMap(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes2[this.index]];
    }
}