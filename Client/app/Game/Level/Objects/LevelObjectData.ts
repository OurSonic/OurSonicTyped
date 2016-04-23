
import {Rectangle, Point } from "../../../Common/Utils";
import {LevelObjectAsset} from "LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "LevelObjectProjectile";
import {SensorM } from "../../Sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "./ObjectManager";
import {Sonic} from "../../Sonic/Sonic";
import {LevelObjectInfo} from "./LevelObjectInfo";
import {LevelObjectPiece } from "./LevelObjectPiece";
import {LevelObjectPieceLayout} from "./LevelObjectPieceLayout";

/*[Serializable]*/
export class LevelObjectData {
    public Key: string;
    public Description: string;
    public Assets: LevelObjectAsset[];
    public Pieces: LevelObjectPiece[];
    public PieceLayouts: LevelObjectPieceLayout[];
    public Projectiles: LevelObjectProjectile[];
    public InitScript: string;
    public TickScript: string;
    public CollideScript: string;
    public HurtScript: string;
    constructor() {
        this.Assets = [];
        this.Pieces = [];
        this.Projectiles = [];
        this.PieceLayouts = [];
        this.Key = "";
        this.Description = "";
        this.InitScript = "";
        this.TickScript = "";
        this.CollideScript = "";
        this.HurtScript = "";
    }
}








