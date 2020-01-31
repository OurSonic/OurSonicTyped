import {SensorResult} from '../../sonic/sensorManager';
import {Sonic} from '../../sonic/sonic';
import {SonicLevel} from '../../sonicLevel';
import {SonicManager} from '../../sonicManager';
import {LevelObjectAsset} from './levelObjectAsset';
import {LevelObjectInfo} from './levelObjectInfo';
import {LevelObjectPiece} from './levelObjectPiece';
import {LevelObjectPieceLayout} from './levelObjectPieceLayout';
import {LevelObjectProjectile} from './levelObjectProjectile';

export class LevelObject {
  private cacheCompiled: {
    [key: string]: (_: LevelObjectInfo, __: SonicLevel, ___: Sonic, ____: SensorResult, _____: LevelObjectPiece) => boolean;
  } = {};
  private cacheLast: {[key: string]: string} = {};
  oldKey: string;
  key: string;
  assets: LevelObjectAsset[];
  pieces: LevelObjectPiece[];
  pieceLayouts: LevelObjectPieceLayout[];
  projectiles: LevelObjectProjectile[];
  initScript: string;
  tickScript: string;
  collideScript: string;
  hurtScript: string;
  description: string;
  constructor(key: string) {
    this.key = key;
    this.initScript = 'this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};';
    this.pieces = [];
    this.pieceLayouts = [];
    this.projectiles = [];
    this.assets = [];
  }
  init($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): void {
    $object.reset();
    this.evalMe('initScript').apply($object, [$object, level, sonic, null, null]);
  }
  onCollide(
    $object: LevelObjectInfo,
    level: SonicLevel,
    sonic: Sonic,
    sensor: string,
    piece: LevelObjectPiece
  ): boolean {
    return this.evalMe('collideScript').apply($object, [
      $object,
      level,
      sonic,
      sensor as any /*todo bad*/,
      piece
    ]) as boolean;
  }
  onHurtSonic(
    $object: LevelObjectInfo,
    level: SonicLevel,
    sonic: Sonic,
    sensor: string,
    piece: LevelObjectPiece
  ): boolean {
    return this.evalMe('hurtScript').apply($object, [
      $object,
      level,
      sonic,
      sensor as any /*todo bad*/,
      piece
    ]) as boolean;
  }
  tick($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): boolean {
    if ($object.lastDrawTick !== SonicManager.instance.tickCount - 1) {
      this.init($object, level, sonic);
    }
    $object.lastDrawTick = SonicManager.instance.tickCount;
    this.evalMe('tickScript').apply($object, [$object, level, sonic, null, null]);
    if ($object.state) {
      $object.xsp = $object.state.xsp;
      $object.ysp = $object.state.ysp;
    }
    $object.x += $object.xsp;
    $object.y += $object.ysp;
    return true;
  }
  die(): void {}

  private evalMe(
    js: string
  ): (_: LevelObjectInfo, __: SonicLevel, ___: Sonic, ____: SensorResult, _____: LevelObjectPiece) => boolean {
    if (this.cacheLast[js] == null) {
      this.cacheLast[js] = null;
    }
    if (this.cacheLast[js] !== this[js]) {
      this.cacheCompiled[js] = null;
    }
    this.cacheLast[js] = this[js];
    if (this.cacheCompiled[js] == null) {
      this.cacheCompiled[js] = eval('(function(object,level,sonic,sensor,piece){' + this[js] + '});') as (
        _: LevelObjectInfo,
        __: SonicLevel,
        ___: Sonic,
        ____: SensorResult,
        _____: LevelObjectPiece
      ) => boolean;
    }
    return this.cacheCompiled[js];
  }
}
