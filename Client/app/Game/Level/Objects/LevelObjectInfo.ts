import {Rectangle, Point } from "../../../common/Utils";
import {LevelObjectAsset} from "./LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "./LevelObjectProjectile";
import {SensorM } from "../../sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "./ObjectManager";
import {Sonic} from "../../sonic/Sonic";
import {LevelObject } from "./LevelObject";
import {LevelObjectPiece } from "./LevelObjectPiece";
import {SonicLevel} from "../../SonicLevel";
import {LevelObjectPieceLayout} from "./LevelObjectPieceLayout";

export class LevelObjectInfo {
    private _rect: Rectangle = new Rectangle(0, 0, 0, 0);
    public lastDrawTick: number=0;
    public o: SLDataObjectEntry;
    public x: number=0;
    public y: number=0;
    public xsp: number=0;
    public ysp: number=0;
    public xflip: boolean=false;
    public yflip: boolean=false;
    public subdata: number=0;
    public key: string;
    public objectData: LevelObject;
    public upperNibble: number=0;
    public lowerNibble: number=0;
    public pieceLayoutIndex: number=0;
    public pieces: LevelObjectPiece[];
    public dead: boolean=false;
    public state: LevelObjectInfo;
    public index: number=0;
    public debug: string[];
    public consoleLog: (_: string[]) => void;
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
    public log(txt: string, level: number = 100): void {
        if (!this.debug)
            this.debug = [];
        if (level == 0)
            this.debug.push(" -- " + txt + " -- ");
        else this.debug.push(txt);
        if (this.consoleLog)
            this.consoleLog(this.debug);
    }
    public setPieceLayoutIndex(ind: number): void {
        this.pieceLayoutIndex = ind;
        let pcs = this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces;
        this.pieces = [];
        for (let t of pcs) {
            //todo look into this...
            this.pieces.push(<LevelObjectPiece><any>t);
        }
    }
    public setObjectData(obj: LevelObject): void {
        this.objectData = obj;
        if (this.objectData.pieceLayouts.length > this.pieceLayoutIndex && this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces.length > 0)
            this.setPieceLayoutIndex(this.pieceLayoutIndex);
    }
    public tick($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): boolean {
        if (this.dead || !this.objectData)
            return false;
        try {
            return this.objectData.tick($object, level, sonic);
        }
        catch (EJ) {
            this.log(EJ.Message, 0);
            return false;
        }

    }
    public mainPieceLayout(): LevelObjectPieceLayout {
        return this.objectData.pieceLayouts[this.pieceLayoutIndex];
    }
    public getRect(): Rectangle {
        if (this.objectData.pieceLayouts.length == 0) {
            this._rect.x = this.x;
            this._rect.y = this.y;
            this._rect.width = ObjectManager.broken.width;
            this._rect.height = ObjectManager.broken.height;
            return this._rect;
        }
        return this.objectData.pieceLayouts[this.pieceLayoutIndex].getRectangle(this.objectData);
    }
    public draw(canvas: CanvasRenderingContext2D, x: number, y: number, showHeightMap: boolean): void {
        if (this.dead || !this.objectData)
            return
        if (this.objectData.pieceLayouts.length == 0) {
            canvas.drawImage(ObjectManager.broken,
                (x - ObjectManager.broken.width / 2),
                (y - ObjectManager.broken.height / 2),
                ObjectManager.broken.width,
                ObjectManager.broken.height);
            return;
        }
        let levelObjectPieceLayout = this.mainPieceLayout();

        levelObjectPieceLayout.draw(canvas, x, y, this.objectData, this, showHeightMap);
        if (this.consoleLog != null) {
            let gr = this.getRect();
            canvas.save();
            canvas.fillStyle = "rgba(228,228,12,0.4)";
            let wd = 1;
            canvas.fillRect(gr.x - this.x + x - (gr.width / 2) - wd,
                gr.y - this.y + y - (gr.height / 2) - wd,
                gr.width - (gr.x - this.x) + wd * 2,
                gr.height - (gr.y - this.y) + wd * 2);
            canvas.restore();
        }
    }
    public reset(): void {
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
        if (this.objectData.pieceLayouts.length > this.pieceLayoutIndex && this.objectData.pieceLayouts[this.pieceLayoutIndex].pieces.length > 0)
            this.setPieceLayoutIndex(this.pieceLayoutIndex);
    }
    public collides(sonic: Point): LevelObjectPiece {
        return this.collision(sonic, false);
    }
    public hurtsSonic(sonic: Point): LevelObjectPiece {
        return this.collision(sonic, true);
    }
    public kill(): void {
        this.dead = true;
    }
    public collision(sonic: Point, isHurtMap: boolean): LevelObjectPiece {
        if (this.dead || !this.objectData || this.objectData.pieceLayouts.length == 0)
            return null;
        let pieces = this.pieces;
        let mX: number = ((sonic.x) - this.x) | 0;
        let mY: number = ((sonic.y) - this.y)|0;
        let piecesLength = pieces.length;
        for (let i = 0; i < piecesLength; i++) {
            let j = pieces[i];
            let piece = this.objectData.pieces[j.pieceIndex];
            let asset = this.objectData.assets[piece.assetIndex];
            if (asset.frames.length > 0) {
                let frm = asset.frames[j.frameIndex];
                let map = isHurtMap ? frm.hurtSonicMap : frm.collisionMap;
                if (this.twoDArray(map, (mX + frm.offsetX), (mY + frm.offsetY), this.xflip !== !!piece.xflip, this.yflip !== !!piece.xflip) == true)
                    return j;
            }
        }
        return null;
    }
    public twoDArray(map: number[][], x: number, y: number, xflip: boolean, yflip: boolean): boolean {
        if (!map || x < 0 || y < 0 || x > map.length)
            return false;
        let d = map[x];
        if (!d || y > d.length)
            return false;
        return d[y] > 0;
    }
    public collide(sonic: Sonic, sensor: string, piece: any): boolean {
        try {
            return this.objectData.onCollide(this, SonicManager.instance.sonicLevel, sonic, sensor, piece);
        }
        catch (EJ) {
            console.log(EJ);
            this.log(EJ.Message, 0);
            return false;
        }

    }
    public hurtSonic(sonic: Sonic, sensor: string, piece: any): boolean {
        try {
            return this.objectData.onHurtSonic(this, SonicManager.instance.sonicLevel, sonic, sensor, piece);
        }
        catch (EJ) {
            this.log(EJ.Message, 0);
            return false;
        }

    }
}