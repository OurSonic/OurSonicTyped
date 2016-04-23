/*[Serializable]*/
import {TilePieceInfo} from "./TilePieceInfo";
import {CanvasInformation} from "../../../Common/CanvasInformation";

export class TileCacheBlock {
    public AnimatedKey: number;
    public Type: TileCacheBlockType;
    public TilePieceInfo: TilePieceInfo;
    public Block: CanvasInformation;
    public XPos: number;
    public YPos: number;
    constructor(type: TileCacheBlockType) {
        this.Type = type;
    }
}
export enum TileCacheBlockType {
    Block,
    TilePiece
}