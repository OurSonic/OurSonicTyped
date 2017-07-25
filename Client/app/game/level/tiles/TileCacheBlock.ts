/*[Serializable]*/
import {TilePieceInfo} from "./TilePieceInfo";
import {CanvasInformation} from "../../../common/CanvasInformation";

export class TileCacheBlock {
    public AnimatedKey: number=0;
    public Type: TileCacheBlockType;
    public TilePieceInfo: TilePieceInfo;
    public Block: CanvasInformation;
    public XPos: number=0;
    public YPos: number=0;
    constructor(type: TileCacheBlockType) {
        this.Type = type;
    }
}
export enum TileCacheBlockType {
    Block,
    TilePiece
}