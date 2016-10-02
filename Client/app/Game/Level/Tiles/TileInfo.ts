import {Tile} from "./Tile";
import {SonicManager} from "../../SonicManager";

export class TileInfo {
    public _Tile: number=0;
    public Priority: boolean=false;
    public XFlip: boolean=false;
    public YFlip: boolean=false;
    public Palette: number=0;
    public Index: number=0;
    public GetTile(): Tile {
        return SonicManager.instance.sonicLevel.getTile(this._Tile);
    }
}