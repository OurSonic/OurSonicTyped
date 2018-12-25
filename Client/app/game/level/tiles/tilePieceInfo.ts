import {Solidity} from '../../../slData';
import {SonicManager} from '../../sonicManager';
import {HeightMap} from '../heightMap';
import {TilePiece} from './tilePiece';

export class TilePieceInfo {
  block: number = 0;
  xFlip: boolean = false;
  yFlip: boolean = false;
  solid1: Solidity = Solidity.NotSolid;
  solid2: Solidity = Solidity.NotSolid;

  index: number = 0;
  getTilePiece(): TilePiece {
    return SonicManager.instance.sonicLevel.getTilePiece(this.block);
  }
  setTilePiece(tp: TilePiece): boolean {
    if (this.block === tp.index) {
      return false;
    }
    this.block = tp.index;
    return true;
  }
  getLayer1Angles(): number {
    return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes1[this.block]];
  }
  getLayer2Angles(): number {
    return SonicManager.instance.sonicLevel.angles[SonicManager.instance.sonicLevel.collisionIndexes2[this.block]];
  }
  getLayer1HeightMaps(): HeightMap {
    return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes1[this.block]];
  }
  getLayer2HeightMaps(): HeightMap {
    return SonicManager.instance.sonicLevel.heightMaps[SonicManager.instance.sonicLevel.collisionIndexes2[this.block]];
  }
}
