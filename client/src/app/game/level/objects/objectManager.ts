import {Help} from '../../../common/help';
import {SonicManager} from '../../sonicManager';
import {LevelObject} from './levelObject';
import {LevelObjectAsset} from './levelObjectAsset';
import {LevelObjectAssetFrame} from './levelObjectAssetFrame';
import {LevelObjectData} from './levelObjectData';
import {LevelObjectPieceLayout} from './levelObjectPieceLayout';
import {LevelObjectProjectile} from './levelObjectProjectile';

export class ObjectManager {
  static broken = Help.loadSprite('assets/sprites/broken.png', (e) => {});
  private sonicManager: SonicManager;

  constructor(sonicManager: SonicManager) {
    this.sonicManager = sonicManager;
  }

  Init(): void {}

  static ExtendObject(d: LevelObjectData): LevelObject {
    const obj = new LevelObject(d.key);
    obj.collideScript = d.collideScript;
    obj.hurtScript = d.hurtScript;
    obj.initScript = d.initScript;
    obj.tickScript = d.tickScript;

    obj.description = d.description;
    obj.assets = [];
    for (let i: number = 0; i < d.assets.length; i++) {
      const asset = d.assets[i];
      const levelObjectAsset = Help.merge(new LevelObjectAsset(asset.name), {name: asset.name});
      levelObjectAsset.frames = [];
      for (let index: number = 0; index < asset.frames.length; index++) {
        const fr = asset.frames[index];
        levelObjectAsset.frames[index] = Help.merge(new LevelObjectAssetFrame(fr.name), {
          offsetX: fr.offsetX,
          width: fr.width,
          transparentColor: fr.transparentColor || '000000',
          height: fr.height,
          offsetY: fr.offsetY,
          hurtSonicMap: fr.hurtSonicMap,
          collisionMap: fr.collisionMap,
          colorMap: fr.colorMap,
          palette: fr.palette,
        });
      }
      obj.assets[i] = levelObjectAsset;
    }
    obj.pieces = [];
    for (let index: number = 0; index < d.pieces.length; index++) {
      const piece = d.pieces[index];
      obj.pieces[index] = piece;
    }
    obj.pieceLayouts = [];
    for (let index: number = 0; index < d.pieceLayouts.length; index++) {
      const pl = d.pieceLayouts[index];
      obj.pieceLayouts[index] = Help.merge(new LevelObjectPieceLayout(pl.name), {
        height: pl.height,
        width: pl.width,
      });
      obj.pieceLayouts[index].pieces = [];
      for (let i: number = 0; i < d.pieceLayouts[index].pieces.length; i++) {
        obj.pieceLayouts[index].pieces[i] = d.pieceLayouts[index].pieces[i];
      }
    }
    obj.projectiles = [];
    for (let index: number = 0; index < d.projectiles.length; index++) {
      let proj = d.projectiles[index];
      proj = Help.merge(new LevelObjectProjectile(proj.name), {
        x: proj.x,
        y: proj.y,
        xsp: proj.xsp,
        ysp: proj.ysp,
        xflip: proj.xflip,
        yflip: proj.yflip,
        assetIndex: proj.assetIndex,
        frameIndex: proj.frameIndex,
      });
      obj.projectiles[index] = proj;
    }
    return obj;
  }
}
