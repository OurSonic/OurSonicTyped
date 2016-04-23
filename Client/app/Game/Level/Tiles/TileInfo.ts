import {Tile} from "./Tile";
import {SonicManager} from "../../SonicManager";

export class TileInfo {
    public _Tile: number;
    public Priority: boolean;
    public XFlip: boolean;
    public YFlip: boolean;
    public Palette: number;
    public Index: number;
    public GetTile(): Tile {
        return SonicManager.instance.sonicLevel.GetTile(this._Tile);
    }
}