
import {Rectangle, Point } from "../../../Common/Utils";
import {LevelObjectAsset} from "LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "LevelObjectProjectile";
import {SensorM } from "../../Sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "./ObjectManager";
import {Sonic} from "../../Sonic/Sonic";
import {LevelObjectInfo} from "LevelObjectInfo";
import {LevelObjectPiece } from "LevelObjectPiece"; 
import {SonicLevel } from "../../SonicLevel";
import {LevelObjectPieceLayout} from "./LevelObjectPieceLayout";

export class LevelObject {
    private cacheCompiled: { [key: string]: (_: LevelObjectInfo, __: SonicLevel, ___: Sonic, ____: SensorM, _____: LevelObjectPiece) => boolean } = {};
    private cacheLast: { [key: string]: string } = {};
    public oldKey: string;
    public Key: string;
    public Assets: LevelObjectAsset[];
    public Pieces: LevelObjectPiece[];
    public PieceLayouts: LevelObjectPieceLayout[];
    public Projectiles: LevelObjectProjectile[];
    public InitScript: string;
    public TickScript: string;
    public CollideScript: string;
    public HurtScript: string;
    public Description: string;
    constructor(key: string) {
        this.Key = key;
        this.InitScript = "this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};";
        this.Pieces = [];
        this.PieceLayouts = [];
        this.Projectiles = [];
        this.Assets = [];
    }
    public Init($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): void {
        $object.Reset();
        this.evalMe("InitScript").apply($object, [$object, level, sonic]);
    }
    public OnCollide($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic, sensor: string, piece: LevelObjectPiece): boolean {
        return <boolean>this.evalMe("CollideScript").apply($object, [$object, level, sonic, sensor, piece])
    }
    public OnHurtSonic($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic, sensor: string, piece: LevelObjectPiece): boolean {
        return <boolean>this.evalMe("HurtScript").apply($object, [$object, level, sonic, sensor, piece])
    }
    public Tick($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): boolean {
        if ($object.lastDrawTick != SonicManager.instance.tickCount - 1)
            this.Init($object, level, sonic);
        $object.lastDrawTick = SonicManager.instance.tickCount;
        this.evalMe("TickScript").apply($object, [$object, level, sonic]);
        if ($object.State) {
            $object.Xsp = $object.State.Xsp;
            $object.Ysp = $object.State.Ysp;
        }
        $object.X += $object.Xsp;
        $object.Y += $object.Ysp;
        return true;
    }
    public Die(): void {

    }

    private evalMe(js: string): (_: LevelObjectInfo, __: SonicLevel, ___: Sonic, ____: SensorM, _____: LevelObjectPiece) => boolean {
        if (this.cacheLast[js] == null)
            this.cacheLast[js] = null;
        if (this.cacheLast[js] != this[js])
            this.cacheCompiled[js] = null;
        this.cacheLast[js] = this[js];
        if (this.cacheCompiled[js] == null) {
            this.cacheCompiled[js] = <(_: LevelObjectInfo, __: SonicLevel, ___: Sonic, ____: SensorM, _____: LevelObjectPiece) => boolean>(eval("(function(object,level,sonic,sensor,piece){" + this[js] + "});"));
        }
        return this.cacheCompiled[js];
    }
}
