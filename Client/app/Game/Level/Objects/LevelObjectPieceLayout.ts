import {Rectangle, Point } from "../../../Common/Utils";
import {LevelObjectAsset} from "LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "LevelObjectProjectile";
import {SensorM } from "../../Sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "ObjectManager";
import {Sonic} from "../../Sonic/Sonic";
import {LevelObjectInfo} from "LevelObjectInfo";
import {LevelObjectPiece } from "LevelObjectPiece";
import {LevelObjectPieceLayoutPiece } from "LevelObjectPieceLayoutPiece";
import {LevelObject } from "LevelObject";

export class LevelObjectPieceLayout {
    /*[IntrinsicProperty]*/
    public Width: number;
    /*[IntrinsicProperty]*/
    public Height: number;
    /*[IntrinsicProperty]*/
    public Pieces: LevelObjectPieceLayoutPiece[];
    /*[IntrinsicProperty]*/
    public Name: string;
    constructor(name: string) {
        this.Name = name;
        this.Width = 350;
        this.Height = 280;
        this.Pieces = new Array<LevelObjectPieceLayoutPiece>();
    }
    public Update(): void {
        for (var t of SonicManager.Instance.SonicLevel.Objects) {
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
            for (var i = 1; i < this.Pieces.length; i++) {
                var j = this.Pieces[i];
                canvas.beginPath();
                canvas.moveTo(j.X, j.Y);
                canvas.lineTo(this.Pieces[i - 1].X, this.Pieces[i - 1].Y);
                canvas.stroke();
            }
        }
        for (var levelObjectPieceLayoutPiece of this.Pieces) {
            if (showImages) {
                var piece: LevelObjectPiece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                var asset = levelObject.Assets[piece.AssetIndex];
                if (asset.Frames.length > 0) {
                    var frm = asset.Frames[0];
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
                var drawRadial: CanvasGradient;
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
        for (var j of instance.Pieces) {
            if (!j.Visible)
                continue;
            var piece = framework.Pieces[j.PieceIndex];
            var asset = framework.Assets[piece.AssetIndex];
            if (asset.Frames.length > 0) {
                var frm = asset.Frames[j.FrameIndex];
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
        var left: number = 100000000;
        var top: number = 100000000;
        var right: number = -100000000;
        var bottom: number = -100000000;
        for (var levelObjectPieceLayoutPiece of this.Pieces) {
            var piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
            var asset = levelObject.Assets[piece.AssetIndex];
            var frame = asset.Frames[piece.FrameIndex];
            var pieceX = levelObjectPieceLayoutPiece.X - frame.OffsetX;
            var pieceY = levelObjectPieceLayoutPiece.Y - frame.OffsetY;
            var pieceWidth = frame.Width;
            var pieceHeight = frame.Height;
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
