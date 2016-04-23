 
import {Rectangle, Point, Point } from "../../../Common/Utils";
import {LevelObjectAsset} from "LevelObjectAsset";
import {LevelObjectPiece } from "LevelObjectPiece";
import {SonicManager} from "../../SonicManager";

export class LevelObjectData {
    public key: string;
    public description: string;
    public assets: LevelObjectAsset[];
    public pieces: LevelObjectPiece[];
    public pieceLayouts: LevelObjectPieceLayout[];
    public projectiles: LevelObjectProjectile[];
    public initScript: string;
    public tickScript: string;
    public collideScript: string;
    public hurtScript: string;
    constructor() {
        this.assets = [];
        this.pieces = [];
        this.projectiles = [];
        this.pieceLayouts = [];
        this.key = "";
        this.description = "";
        this.initScript = "";
        this.tickScript = "";
        this.collideScript = "";
        this.hurtScript = "";
    }
}


export class LevelObjectPieceLayout {
    /*[IntrinsicProperty]*/
    public width: number;
    /*[IntrinsicProperty]*/
    public height: number;
    /*[IntrinsicProperty]*/
    public pieces: LevelObjectPieceLayoutPiece [];
    /*[IntrinsicProperty]*/
    public name: string;
    constructor(name: string) {
        this.name = name;
        this.width = 350;
        this.height = 280;
        this.pieces = [];
    }
    public update(): void {
        for (var t of SonicManager.instance.sonicLevel.objects) {
            t.reset();
        }
    }
    public drawUI(canvas: CanvasRenderingContext2D, showImages: boolean, selectedPieceIndex: number, levelObject: LevelObject): void {
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
            for (var i = 1; i < this.pieces.length; i++) {
                var j = this.pieces[i];
                canvas.beginPath();
                canvas.moveTo(j.x, j.y);
                canvas.lineTo(this.pieces[i - 1].x, this.pieces[i - 1].y);
                canvas.stroke();
            }
        }
        for (var levelObjectPieceLayoutPiece of this.pieces) {
            if (showImages) {
                var piece: LevelObjectPiece = levelObject.pieces[levelObjectPieceLayoutPiece.pieceIndex];
                var asset = levelObject.assets[piece.assetIndex];
                if (asset.frames.count > 0) {
                    var frm = asset.frames[0];
                    frm.drawUI(canvas,
                        new Point(levelObjectPieceLayoutPiece.x - frm.offsetX, levelObjectPieceLayoutPiece.y - frm.offsetY),
                        false,
                        false,
                        false,
                        false,
                        piece.xflip,
                        piece.yflip);
                }
            }
            else {
                var drawRadial: CanvasGradient;
                drawRadial = SonicManager.instance.mainCanvas.context.createRadialGradient(0, 0, 0, 10, 10, 50);
                drawRadial.addColorStop(0, "white");
                if (selectedPieceIndex == levelObjectPieceLayoutPiece.pieceIndex)
                    drawRadial.addColorStop(1, "yellow");
                else drawRadial.addColorStop(1, "red");
                canvas.fillStyle = drawRadial;
                canvas.beginPath();
                canvas.arc(levelObjectPieceLayoutPiece.x, levelObjectPieceLayoutPiece.y, 10, 0, Math.Pi * 2, true);
                canvas.closePath();
                canvas.fill();
            }
        }
        canvas.restore();
    }
    public draw(canvas: CanvasRenderingContext2D, x: number, y: number, framework: LevelObject, instance: LevelObjectInfo, showHeightMap: boolean): void {
        for (var j of instance.pieces) {
            if (!j.visible)
                continue;
            var piece = framework.pieces[j.pieceIndex];
            var asset = framework.assets[piece.assetIndex];
            if (asset.frames.count > 0) {
                var frm = asset.frames[j.frameIndex];
                frm.drawUI(canvas,
                    new Point((x) - (frm.offsetX), (y) - (frm.offsetY)),
                    false,
                    showHeightMap,
                    showHeightMap,
                    false,
                    instance.xflip ^ piece.xflip,
                    instance.yflip ^ piece.yflip);
            }
        }
    }
    public getRectangle(levelObject: LevelObject): Rectangle {
        var left: number = 10000000;
        var top: number = 10000000;
        var right: number = -10000000;
        var bottom: number = -10000000;
        for (var levelObjectPieceLayoutPiece of this.pieces) {
            var piece = levelObject.pieces[levelObjectPieceLayoutPiece.pieceIndex];
            var asset = levelObject.assets[piece.assetIndex];
            var frame = asset.frames[piece.frameIndex];
            var pieceX = levelObjectPieceLayoutPiece.x - frame.offsetX;
            var pieceY = levelObjectPieceLayoutPiece.y - frame.offsetY;
            var pieceWidth = frame.width;
            var pieceHeight = frame.height;
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
export class LevelObjectPieceLayoutPiece {
    public pieceIndex: number;
    public assetIndex: number;
    public frameIndex: number;
    public priority: boolean;
    public x: number;
    public y: number;
    public visible: boolean;
    constructor(pieceIndex: number) {
       this. pieceIndex = pieceIndex;
    }
}