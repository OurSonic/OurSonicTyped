import {SonicManager} from "../../SonicManager";
import {Solidity } from "../../../SLData";
import {TilePiece } from "./TilePiece";
import {HeightMap } from "../HeightMap";

export class TilePieceInfo {
    
    public block: number=0;
    public xFlip: boolean=false;
    public yFlip: boolean=false;
    public solid1: Solidity=Solidity.NotSolid;
    public solid2: Solidity=Solidity.NotSolid;
    
    public index: number=0;
    public getTilePiece(): TilePiece {
        return SonicManager.instance.sonicLevel.getTilePiece(this.block);
    }
    public setTilePiece(tp: TilePiece): boolean {
        if (this.block == tp.index)
            return false;
        this.block = tp.index;
        return true;
    }
    public getLayer1Angles(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes1[this.block]];
    }
    public getLayer2Angles(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes2[this.block]];
    }
    public getLayer1HeightMaps(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes1[this.block]];
    }
    public getLayer2HeightMaps(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes2[this.block]];
    }
}