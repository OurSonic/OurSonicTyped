import {Help } from "../../../common/Help";
import {SonicManager } from "../../SonicManager";
import {LevelObjectAsset } from "./LevelObjectAsset";
import {LevelObjectAssetFrame } from "./LevelObjectAssetFrame";
import {LevelObjectProjectile } from "./LevelObjectProjectile";
import {LevelObjectData} from "./LevelObjectData";
import {LevelObject } from "./LevelObject";
import {LevelObjectPiece} from "./LevelObjectPiece";
import {LevelObjectPieceLayoutPiece} from "./LevelObjectPieceLayoutPiece";
import {Point, Rectangle } from "../../../common/Utils";
import {LevelObjectInfo} from "./LevelObjectInfo";

export class LevelObjectPieceLayout {
    
    public width: number;
    
    public height: number;
    
    public pieces: LevelObjectPieceLayoutPiece[];
    
    public name: string;
    constructor(name: string) {
        this.name = name;
        this.width = 350;
        this.height = 280;
        this.pieces = new Array<LevelObjectPieceLayoutPiece>();
    }
    public Update(): void {
        for (let t of SonicManager.instance.sonicLevel.Objects) {
            t.Reset();
        }
    }
    public DrawUI(canvas: CanvasRenderingContext2D, showImages: boolean, selectedPieceIndex: number, levelObject: LevelObject): void {
        canvas.save();
        if (!showImages) {
            canvas.strokeStyle = "#000000";
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
                let j = this.pieces[i];
                canvas.beginPath();
                canvas.moveTo(j.X, j.Y);
                canvas.lineTo(this.pieces[i - 1].X, this.pieces[i - 1].Y);
                canvas.stroke();
            }
        }
        for (let levelObjectPieceLayoutPiece of this.pieces) {
            if (showImages) {
                let piece: LevelObjectPiece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                let asset = levelObject.Assets[piece.assetIndex];
                if (asset.frames.length > 0) {
                    let frm = asset.frames[0];
                    frm.DrawUI(canvas,
                        new Point(levelObjectPieceLayoutPiece.X - frm.offsetX, levelObjectPieceLayoutPiece.Y - frm.offsetY),
                        false,
                        false,
                        false,
                        false,
                        piece.xflip,
                        piece.yflip);
                }
            }
            else {
                let drawRadial: CanvasGradient;
                drawRadial = SonicManager.instance.mainCanvas.Context.createRadialGradient(0, 0, 0, 10, 10, 50);
                drawRadial.addColorStop(0, "white");
                if (selectedPieceIndex == levelObjectPieceLayoutPiece.PieceIndex)
                    drawRadial.addColorStop(1, "yellow");
                else drawRadial.addColorStop(1, "red");
                canvas.fillStyle = drawRadial;
                canvas.beginPath();
                canvas.arc(levelObjectPieceLayoutPiece.X, levelObjectPieceLayoutPiece.Y, 10, 0, Math.PI * 2, true);
                canvas.closePath();
                canvas.fill();
            }
        }
        canvas.restore();
    }
    public Draw(canvas: CanvasRenderingContext2D, x: number, y: number, framework: LevelObject, instance: LevelObjectInfo, showHeightMap: boolean): void {
        for (let j of instance.Pieces) {
            if (!j.visible)
                continue;
            let piece = framework.Pieces[j.pieceIndex];
            let asset = framework.Assets[piece.assetIndex];
            if (asset.frames.length > 0) {
                let frm = asset.frames[j.frameIndex];
                frm.DrawUI(canvas,
                    new Point((x) - (frm.offsetX), (y) - (frm.offsetY)),
                    false,
                    showHeightMap,
                    showHeightMap,
                    false,
                    instance.Xflip !== !!piece.xflip,
                    instance.Yflip !== !!piece.yflip);
            }
        }
    }
    public GetRectangle(levelObject: LevelObject): Rectangle {
        let left: number = 100000000;
        let top: number = 100000000;
        let right: number = -100000000;
        let bottom: number = -100000000;
        for (let levelObjectPieceLayoutPiece of this.pieces) {
            let piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
            let asset = levelObject.Assets[piece.assetIndex];
            let frame = asset.frames[piece.frameIndex];
            let pieceX = levelObjectPieceLayoutPiece.X - frame.offsetX;
            let pieceY = levelObjectPieceLayoutPiece.Y - frame.offsetY;
            let pieceWidth = frame.width;
            let pieceHeight = frame.height;
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
