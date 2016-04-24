
import {Rectangle, Point } from "../../../common/Utils";
import {LevelObjectAsset} from "LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "LevelObjectProjectile";
import {SensorM } from "../../sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "./ObjectManager";
import {Sonic} from "../../sonic/Sonic";
import {LevelObjectInfo} from "./LevelObjectInfo";
import {LevelObjectPiece } from "./LevelObjectPiece";
import {LevelObjectPieceLayout} from "./LevelObjectPieceLayout";

export class LevelObjectData {
    public key: string;
    public description: string;
    public assets: LevelObjectAsset[];
    public pieces: LevelObjectPiece[];
    public pieceLayouts: LevelObjectPieceLayout[];
    public projectiles: LevelObjectProjectile[];
    public initScript: string;
    public tickScript: string;
    public collideScript: string;
    public hurtScript: string;
    constructor() {
        this.assets = [];
        this.pieces = [];
        this.projectiles = [];
        this.pieceLayouts = [];
        this.key = "";
        this.description = "";
        this.initScript = "";
        this.tickScript = "";
        this.collideScript = "";
        this.hurtScript = "";
    }
}








