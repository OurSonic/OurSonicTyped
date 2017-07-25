import {TileInfo} from "./TileInfo";
import {SonicManager} from "../../SonicManager";
import {HeightMap} from "../HeightMap";
import {CanvasInformation} from "../../../common/CanvasInformation";

export class TilePiece {
    static DrawInfo: number[][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    public static DrawOrder: number[][] = [[3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 1, 2, 3]];
    public isOnlyBackground: boolean = false;
    public isOnlyForeground: boolean = false;

    public tiles: TileInfo[];

    public index: number = 0;


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


    public getImage(xFlip: boolean = false, yFlip: boolean = false): CanvasInformation {
        let info = CanvasInformation.create(16, 16, true);

        let drawOrderIndex = xFlip ? (yFlip ? 0 : 1) : (yFlip ? 2 : 3);
        for (let i = 0; i < this.tiles.length; i++) {
            let tileItem = this.tiles[i];
            let tile = tileItem.getTile();
            if (!tile)
                continue;
            let tileXFlip = xFlip !== tileItem.xFlip;
            let tileYFlip = yFlip !== tileItem.yFlip;
            let df = TilePiece.DrawInfo[TilePiece.DrawOrder[drawOrderIndex][i]];
            let image = tile.getImage(tileXFlip, tileYFlip, tileItem.palette).canvas;
            info.context.drawImage(image, df[0] * 8, df[1] * 8);
        }
        return info;
    }
}