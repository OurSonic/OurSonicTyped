import {LevelObjectAsset} from './levelObjectAsset';
import {LevelObjectPiece} from './levelObjectPiece';
import {LevelObjectPieceLayout} from './levelObjectPieceLayout';
import {LevelObjectProjectile} from './levelObjectProjectile';

export class LevelObjectData {
  key: string;
  description: string;
  assets: LevelObjectAsset[];
  pieces: LevelObjectPiece[];
  pieceLayouts: LevelObjectPieceLayout[];
  projectiles: LevelObjectProjectile[];
  initScript: string;
  tickScript: string;
  collideScript: string;
  hurtScript: string;
  constructor() {
    this.assets = [];
    this.pieces = [];
    this.projectiles = [];
    this.pieceLayouts = [];
    this.key = '';
    this.description = '';
    this.initScript = '';
    this.tickScript = '';
    this.collideScript = '';
    this.hurtScript = '';
  }
}
