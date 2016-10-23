import {SonicManager} from "../../SonicManager";
import {Solidity } from "../../../SLData";
import {TilePiece } from "./TilePiece";
import {HeightMap } from "../HeightMap";

export class TilePieceInfo {
    
    public Block: number=0;
    
    public XFlip: boolean=false;
    
    public YFlip: boolean=false;
    
    public Solid1: Solidity=Solidity.NotSolid;
    
    public Solid2: Solidity=Solidity.NotSolid;
    
    public Index: number=0;
    public getTilePiece(): TilePiece {
        return SonicManager.instance.sonicLevel.getTilePiece(this.Block);
    }
    public setTilePiece(tp: TilePiece): boolean {
        if (this.Block == tp.Index)
            return false;
        this.Block = tp.Index;
        return true;
    }
    public getLayer1Angles(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes1[this.Block]];
    }
    public getLayer2Angles(): number {
        return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes2[this.Block]];
    }
    public getLayer1HeightMaps(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes1[this.Block]];
    }
    public getLayer2HeightMaps(): HeightMap {
        return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes2[this.Block]];
    }
}