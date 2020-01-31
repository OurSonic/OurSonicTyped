import {Point, Rectangle} from '../../../common/utils';
import {SonicManager} from '../../sonicManager';
import {LevelObject} from './levelObject';
import {LevelObjectInfo} from './levelObjectInfo';
import {LevelObjectPiece} from './levelObjectPiece';
import {LevelObjectPieceLayoutPiece} from './levelObjectPieceLayoutPiece';

export class LevelObjectPieceLayout {
  width: number;

  height: number;

  pieces: LevelObjectPieceLayoutPiece[];

  name: string;
  constructor(name: string) {
    this.name = name;
    this.width = 350;
    this.height = 280;
    this.pieces = [];
  }
  update(): void {
    for (const t of SonicManager.instance.sonicLevel.objects) {
      t.reset();
    }
  }
  drawUI(
    canvas: CanvasRenderingContext2D,
    showImages: boolean,
    selectedPieceIndex: number,
    levelObject: LevelObject
  ): void {
    canvas.save();
    if (!showImages) {
      canvas.strokeStyle = '#000000';
      canvas.lineWidth = 2;
      canvas.beginPath();
      canvas.moveTo(-1000, 0);
      canvas.lineTo(1000, 0);
      canvas.closePath();
      canvas.stroke();
      canvas.beginPath();
      canvas.moveTo(0, -1000);
      canvas.lineTo(0, 1000);
      canvas.closePath();
      canvas.stroke();
      for (let i = 1; i < this.pieces.length; i++) {
        const j = this.pieces[i];
        canvas.beginPath();
        canvas.moveTo(j.x, j.y);
        canvas.lineTo(this.pieces[i - 1].x, this.pieces[i - 1].y);
        canvas.stroke();
      }
    }
    for (const levelObjectPieceLayoutPiece of this.pieces) {
      if (showImages) {
        const piece: LevelObjectPiece = levelObject.pieces[levelObjectPieceLayoutPiece.pieceIndex];
        const asset = levelObject.assets[piece.assetIndex];
        if (asset.frames.length > 0) {
          const frm = asset.frames[0];
          frm.drawUI(
            canvas,
            new Point(levelObjectPieceLayoutPiece.x - frm.offsetX, levelObjectPieceLayoutPiece.y - frm.offsetY),
            false,
            false,
            false,
            false,
            piece.xflip,
            piece.yflip
          );
        }
      } else {
        const drawRadial: CanvasGradient = null;
        // drawRadial = SonicManager.instance.lowTileCanvas.context.createRadialGradient(0, 0, 0, 10, 10, 50);
        drawRadial.addColorStop(0, 'white');
        if (selectedPieceIndex == levelObjectPieceLayoutPiece.pieceIndex) {
          drawRadial.addColorStop(1, 'yellow');
        } else {
          drawRadial.addColorStop(1, 'red');
        }
        canvas.fillStyle = drawRadial;
        canvas.beginPath();
        canvas.arc(levelObjectPieceLayoutPiece.x, levelObjectPieceLayoutPiece.y, 10, 0, Math.PI * 2, true);
        canvas.closePath();
        canvas.fill();
      }
    }
    canvas.restore();
  }
  draw(
    canvas: CanvasRenderingContext2D,
    x: number,
    y: number,
    framework: LevelObject,
    instance: LevelObjectInfo,
    showHeightMap: boolean
  ): void {
    for (const j of instance.pieces) {
      if (!j.visible) {
        continue;
      }
      const piece = framework.pieces[j.pieceIndex];
      const asset = framework.assets[piece.assetIndex];
      if (asset.frames.length > 0) {
        const frm = asset.frames[j.frameIndex];
        frm.drawUI(
          canvas,
          new Point(x - frm.offsetX + j.x, y - frm.offsetY + j.y),
          false,
          showHeightMap,
          showHeightMap,
          false,
          instance.xflip !== !!piece.xflip,
          instance.yflip !== !!piece.yflip
        );
      }
    }
  }
  getRectangle(levelObject: LevelObject): Rectangle {
    let left: number = 100000000;
    let top: number = 100000000;
    let right: number = -100000000;
    let bottom: number = -100000000;
    for (const levelObjectPieceLayoutPiece of this.pieces) {
      const piece = levelObject.pieces[levelObjectPieceLayoutPiece.pieceIndex];
      const asset = levelObject.assets[piece.assetIndex];
      const frame = asset.frames[piece.frameIndex];
      const pieceX = levelObjectPieceLayoutPiece.x - frame.offsetX;
      const pieceY = levelObjectPieceLayoutPiece.y - frame.offsetY;
      const pieceWidth = frame.width;
      const pieceHeight = frame.height;
      if (pieceX < left) {
        left = pieceX;
      }
      if (pieceY < top) {
        top = pieceY;
      }
      if (pieceX + pieceWidth > right) {
        right = pieceX + pieceWidth;
      }
      if (pieceY + pieceHeight > bottom) {
        bottom = pieceY + pieceHeight;
      }
    }
    return new Rectangle(left, top, right - left, bottom - top);
  }
}
