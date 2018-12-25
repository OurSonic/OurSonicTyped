import {Point, Rectangle} from '../../../common/utils';
import {SLDataObjectEntry} from '../../../slData';
import {Sonic} from '../../sonic/sonic';
import {SonicLevel} from '../../sonicLevel';
import {SonicManager} from '../../sonicManager';
import {LevelObject} from './levelObject';
import {LevelObjectPiece} from './levelObjectPiece';
import {LevelObjectPieceLayout} from './levelObjectPieceLayout';
import {ObjectManager} from './objectManager';

export class LevelObjectInfo {
  private _rect: Rectangle = new Rectangle(0, 0, 0, 0);
  lastDrawTick: number = 0;
  o: SLDataObjectEntry;
  x: number = 0;
  y: number = 0;
  xsp: number = 0;
  ysp: number = 0;
  xflip: boolean = false;
  yflip: boolean = false;
  subdata: number = 0;
  key: string;
  objectData: LevelObject;
  upperNibble: number = 0;
  lowerNibble: number = 0;
  pieceLayoutIndex: number = 0;
  pieces: LevelObjectPiece[];
  dead: boolean = false;
  state: LevelObjectInfo;
  index: number = 0;
  debug: string[];
  consoleLog: (_: string[]) => void;
  constructor(o: SLDataObjectEntry) {
    this.o = o;
    this.x = o.x;
    this.y = o.y;
    this.xflip = o.xFlip;
    this.yflip = o.yFlip;
    this.subdata = o.subType;
    this.key = o.iD.toString();
    this.upperNibble = this.subdata >> 4;
    this.lowerNibble = this.subdata & 0xf;
  }
  log(txt: string, level: number = 100): void {
    if (!this.debug) {
      this.debug = [];
    }
    if (level === 0) {
      this.debug.push(' -- ' + txt + ' -- ');
    } else {
      this.debug.push(txt);
    }
    if (this.consoleLog) {
      this.consoleLog(this.debug);
    }
  }
  setPieceLayoutIndex(ind: number): void {
    this.pieceLayoutIndex = ind;
    const pcs = this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces;
    this.pieces = [];
    for (const t of pcs) {
      // todo look into this...
      this.pieces.push((t as any) as LevelObjectPiece);
    }
  }
  setObjectData(obj: LevelObject): void {
    this.objectData = obj;
    if (
      this.objectData.pieceLayouts.length > this.pieceLayoutIndex &&
      this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces.length > 0
    ) {
      this.setPieceLayoutIndex(this.pieceLayoutIndex);
    }
  }
  tick($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): boolean {
    if (this.dead || !this.objectData) {
      return false;
    }
    try {
      return this.objectData.tick($object, level, sonic);
    } catch (EJ) {
      this.log(EJ.Message, 0);
      return false;
    }
  }
  mainPieceLayout(): LevelObjectPieceLayout {
    return this.objectData.pieceLayouts[this.pieceLayoutIndex];
  }
  getRect(): Rectangle {
    if (this.objectData.pieceLayouts.length === 0) {
      this._rect.x = this.x;
      this._rect.y = this.y;
      this._rect.width = ObjectManager.broken.width;
      this._rect.height = ObjectManager.broken.height;
      return this._rect;
    }
    return this.objectData.pieceLayouts[this.pieceLayoutIndex].getRectangle(this.objectData);
  }
  draw(canvas: CanvasRenderingContext2D, x: number, y: number, showHeightMap: boolean): void {
    if (this.dead || !this.objectData) {
      return;
    }
    if (this.objectData.pieceLayouts.length === 0) {
      canvas.drawImage(
        ObjectManager.broken,
        x - ObjectManager.broken.width / 2,
        y - ObjectManager.broken.height / 2,
        ObjectManager.broken.width,
        ObjectManager.broken.height
      );
      return;
    }
    const levelObjectPieceLayout = this.mainPieceLayout();

    levelObjectPieceLayout.draw(canvas, x, y, this.objectData, this, showHeightMap);
    if (this.consoleLog != null) {
      const gr = this.getRect();
      canvas.save();
      canvas.fillStyle = 'rgba(228,228,12,0.4)';
      const wd = 1;
      canvas.fillRect(
        gr.x - this.x + x - gr.width / 2 - wd,
        gr.y - this.y + y - gr.height / 2 - wd,
        gr.width - (gr.x - this.x) + wd * 2,
        gr.height - (gr.y - this.y) + wd * 2
      );
      canvas.restore();
    }
  }
  reset(): void {
    this.x = this.o.x;
    this.y = this.o.y;
    this.xsp = 0;
    this.ysp = 0;
    this.state = null;
    this.xflip = this.o.xFlip;
    this.yflip = this.o.yFlip;
    this.dead = false;
    this.pieceLayoutIndex = 0;
    this.subdata = this.o.subType;
    this.upperNibble = this.subdata >> 4;
    this.lowerNibble = this.subdata & 0xf;
    if (
      this.objectData.pieceLayouts.length > this.pieceLayoutIndex &&
      this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces.length > 0
    ) {
      this.setPieceLayoutIndex(this.pieceLayoutIndex);
    }
  }
  collides(sonic: Point): LevelObjectPiece {
    return this.collision(sonic, false);
  }
  hurtsSonic(sonic: Point): LevelObjectPiece {
    return this.collision(sonic, true);
  }
  kill(): void {
    this.dead = true;
  }
  collision(sonic: Point, isHurtMap: boolean): LevelObjectPiece {
    if (this.dead || !this.objectData || this.objectData.pieceLayouts.length == 0) {
      return null;
    }
    const pieces = this.pieces;
    const mX: number = (sonic.x - this.x) | 0;
    const mY: number = (sonic.y - this.y) | 0;
    const piecesLength = pieces.length;
    for (let i = 0; i < piecesLength; i++) {
      const j = pieces[i];
      const piece = this.objectData.pieces[j.pieceIndex];
      const asset = this.objectData.assets[piece.assetIndex];
      if (asset.frames.length > 0) {
        const frm = asset.frames[j.frameIndex];
        const map = isHurtMap ? frm.hurtSonicMap : frm.collisionMap;
        if (
          this.twoDArray(
            map,
            mX + frm.offsetX,
            mY + frm.offsetY,
            this.xflip !== !!piece.xflip,
            this.yflip !== !!piece.xflip
          ) == true
        ) {
          return j;
        }
      }
    }
    return null;
  }
  twoDArray(map: number[][], x: number, y: number, xflip: boolean, yflip: boolean): boolean {
    if (!map || x < 0 || y < 0 || x > map.length) {
      return false;
    }
    const d = map[x];
    if (!d || y > d.length) {
      return false;
    }
    return d[y] > 0;
  }
  collide(sonic: Sonic, sensor: string, piece: any): boolean {
    try {
      return this.objectData.onCollide(this, SonicManager.instance.sonicLevel, sonic, sensor, piece);
    } catch (EJ) {
      console.log(EJ);
      this.log(EJ.Message, 0);
      return false;
    }
  }
  hurtSonic(sonic: Sonic, sensor: string, piece: any): boolean {
    try {
      return this.objectData.onHurtSonic(this, SonicManager.instance.sonicLevel, sonic, sensor, piece);
    } catch (EJ) {
      this.log(EJ.Message, 0);
      return false;
    }
  }
}
