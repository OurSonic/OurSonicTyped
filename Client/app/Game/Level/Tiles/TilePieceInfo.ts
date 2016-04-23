import {SonicManager} from "../../SonicManager";
import {Solidity } from "../../../SLData";
import {TilePiece } from "./TilePiece";
import {HeightMap } from "../HeightMap";

export class TilePieceInfo {
    
    public Block: number;
    
    public XFlip: boolean;
    
    public YFlip: boolean;
    
    public Solid1: Solidity;
    
    public Solid2: Solidity;
    
    public Index: number;
    public GetTilePiece(): TilePiece {
        return SonicManager.Instance.SonicLevel.GetTilePiece(this.Block);
    }
    public SetTilePiece(tp: TilePiece): boolean {
        if (this.Block == tp.Index)
            return false;
        this.Block = tp.Index;
        return true;
    }
    public GetLayer1Angles(): number {
        return SonicManager.Instance.SonicLevel.Angles[SonicManager.Instance.SonicLevel.CollisionIndexes1[this.Block]];
    }
    public GetLayer2Angles(): number {
        return SonicManager.Instance.SonicLevel.Angles[SonicManager.Instance.SonicLevel.CollisionIndexes2[this.Block]];
    }
    public GetLayer1HeightMaps(): HeightMap {
        return SonicManager.Instance.SonicLevel.HeightMaps[SonicManager.Instance.SonicLevel.CollisionIndexes1[this.Block]];
    }
    public GetLayer2HeightMaps(): HeightMap {
        return SonicManager.Instance.SonicLevel.HeightMaps[SonicManager.Instance.SonicLevel.CollisionIndexes2[this.Block]];
    }
}