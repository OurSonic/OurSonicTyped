
import {Rectangle, Point } from "../../../common/Utils";
import {LevelObjectAsset} from "./LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "./LevelObjectProjectile";
import {SensorM } from "../../sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "./ObjectManager";
import {Sonic} from "../../sonic/Sonic";
import {LevelObjectInfo} from "./LevelObjectInfo";
import {LevelObjectPiece } from "./LevelObjectPiece"; 
import {SonicLevel } from "../../SonicLevel";
import {LevelObjectPieceLayout} from "./LevelObjectPieceLayout";

export class LevelObject {
    private cacheCompiled: { [key: string]: (_: LevelObjectInfo, __: SonicLevel, ___: Sonic, ____: SensorM, _____: LevelObjectPiece) => boolean } = {};
    private cacheLast: { [key: string]: string } = {};
    public oldKey: string;
    public key: string;
    public assets: LevelObjectAsset[];
    public pieces: LevelObjectPiece[];
    public pieceLayouts: LevelObjectPieceLayout[];
    public projectiles: LevelObjectProjectile[];
    public initScript: string;
    public tickScript: string;
    public collideScript: string;
    public hurtScript: string;
    public description: string;
    constructor(key: string) {
        this.key = key;
        this.initScript = "this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};";
        this.pieces = [];
        this.pieceLayouts = [];
        this.projectiles = [];
        this.assets = [];
    }
    public init($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): void {
        $object.reset();
        this.evalMe("initScript").apply($object, [$object, level, sonic]);
    }
    public onCollide($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic, sensor: string, piece: LevelObjectPiece): boolean {
        return <boolean>this.evalMe("collideScript").apply($object, [$object, level, sonic, sensor, piece])
    }
    public onHurtSonic($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic, sensor: string, piece: LevelObjectPiece): boolean {
        return <boolean>this.evalMe("hurtScript").apply($object, [$object, level, sonic, sensor, piece])
    }
    public tick($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): boolean {
        if ($object.lastDrawTick != SonicManager.instance.tickCount - 1)
            this.init($object, level, sonic);
        $object.lastDrawTick = SonicManager.instance.tickCount;
        this.evalMe("tickScript").apply($object, [$object, level, sonic]);
        if ($object.state) {
            $object.xsp = $object.state.xsp;
            $object.ysp = $object.state.ysp;
        }
        $object.x += $object.xsp;
        $object.y += $object.ysp;
        return true;
    }
    public die(): void {

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
