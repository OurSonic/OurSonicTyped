import {Solidity} from '../../../slData';
import {SonicManager} from '../../sonicManager';
import {HeightMap} from '../heightMap';
import {TilePiece} from './tilePiece';

export class TilePieceInfo {
  constructor(private sonicManager: SonicManager) {}

  block: number = 0;
  xFlip: boolean = false;
  yFlip: boolean = false;
  solid1: Solidity = Solidity.NotSolid;
  solid2: Solidity = Solidity.NotSolid;

  index: number = 0;
  getTilePiece(): TilePiece {
    return this.sonicManager.sonicLevel.getTilePiece(this.block);
  }
  setTilePiece(tp: TilePiece): boolean {
    if (this.block === tp.index) {
      return false;
    }
    this.block = tp.index;
    return true;
  }
  getLayer1Angles(): number {
    return this.sonicManager.sonicLevel.angles[this.sonicManager.sonicLevel.collisionIndexes1[this.block]];
  }
  getLayer2Angles(): number {
    return this.sonicManager.sonicLevel.angles[this.sonicManager.sonicLevel.collisionIndexes2[this.block]];
  }
  getLayer1HeightMaps(): HeightMap {
    return this.sonicManager.sonicLevel.heightMaps[this.sonicManager.sonicLevel.collisionIndexes1[this.block]];
  }
  getLayer2HeightMaps(): HeightMap {
    return this.sonicManager.sonicLevel.heightMaps[this.sonicManager.sonicLevel.collisionIndexes2[this.block]];
  }
}
