import {Help } from "../../../Common/Help";
import {SonicManager } from "../../SonicManager";
import {LevelObjectAsset } from "./LevelObjectAsset";
import {LevelObjectAssetFrame } from "./LevelObjectAssetFrame";
import {LevelObjectProjectile } from "./LevelObjectProjectile";
import {LevelObjectData} from "./LevelObjectData";
import {LevelObject } from "./LevelObject";
import {LevelObjectPiece} from "./LevelObjectPiece";
import {LevelObjectPieceLayoutPiece} from "./LevelObjectPieceLayoutPiece";
import {Point, Rectangle } from "../../../Common/Utils";
import {LevelObjectInfo} from "./LevelObjectInfo";

export class LevelObjectPieceLayout {
    
    public Width: number;
    
    public Height: number;
    
    public Pieces: LevelObjectPieceLayoutPiece[];
    
    public Name: string;
    constructor(name: string) {
        this.Name = name;
        this.Width = 350;
        this.Height = 280;
        this.Pieces = new Array<LevelObjectPieceLayoutPiece>();
    }
    public Update(): void {
        for (let t of SonicManager.Instance.SonicLevel.Objects) {
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
            for (let i = 1; i < this.Pieces.length; i++) {
                let j = this.Pieces[i];
                canvas.beginPath();
                canvas.moveTo(j.X, j.Y);
                canvas.lineTo(this.Pieces[i - 1].X, this.Pieces[i - 1].Y);
                canvas.stroke();
            }
        }
        for (let levelObjectPieceLayoutPiece of this.Pieces) {
            if (showImages) {
                let piece: LevelObjectPiece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                let asset = levelObject.Assets[piece.AssetIndex];
                if (asset.Frames.length > 0) {
                    let frm = asset.Frames[0];
                    frm.DrawUI(canvas,
                        new Point(levelObjectPieceLayoutPiece.X - frm.OffsetX, levelObjectPieceLayoutPiece.Y - frm.OffsetY),
                        false,
                        false,
                        false,
                        false,
                        piece.Xflip,
                        piece.Yflip);
                }
            }
            else {
                let drawRadial: CanvasGradient;
                drawRadial = SonicManager.Instance.mainCanvas.Context.createRadialGradient(0, 0, 0, 10, 10, 50);
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
            if (!j.Visible)
                continue;
            let piece = framework.Pieces[j.PieceIndex];
            let asset = framework.Assets[piece.AssetIndex];
            if (asset.Frames.length > 0) {
                let frm = asset.Frames[j.FrameIndex];
                frm.DrawUI(canvas,
                    new Point((x) - (frm.OffsetX), (y) - (frm.OffsetY)),
                    false,
                    showHeightMap,
                    showHeightMap,
                    false,
                    instance.Xflip !== piece.Xflip,
                    instance.Yflip !== piece.Yflip);
            }
        }
    }
    public GetRectangle(levelObject: LevelObject): Rectangle {
        let left: number = 100000000;
        let top: number = 100000000;
        let right: number = -100000000;
        let bottom: number = -100000000;
        for (let levelObjectPieceLayoutPiece of this.Pieces) {
            let piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
            let asset = levelObject.Assets[piece.AssetIndex];
            let frame = asset.Frames[piece.FrameIndex];
            let pieceX = levelObjectPieceLayoutPiece.X - frame.OffsetX;
            let pieceY = levelObjectPieceLayoutPiece.Y - frame.OffsetY;
            let pieceWidth = frame.Width;
            let pieceHeight = frame.Height;
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
