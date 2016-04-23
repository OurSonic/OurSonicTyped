import {Rectangle, Point } from "../../../Common/Utils";
import {LevelObjectAsset} from "LevelObjectAsset";
import {SonicManager} from "../../SonicManager";
import {LevelObjectProjectile} from "./LevelObjectProjectile";
import {SensorM } from "../../Sonic/SensorManager";
import {SLDataObjectEntry  } from "../../../SLData";
import {ObjectManager } from "./ObjectManager";
import {Sonic} from "../../Sonic/Sonic";
import {LevelObject } from "./LevelObject";
import {LevelObjectPiece } from "./LevelObjectPiece";
import {SonicLevel} from "../../SonicLevel";
import {LevelObjectPieceLayout} from "./LevelObjectPieceLayout";

export class LevelObjectInfo {
    private _rect: Rectangle = new Rectangle(0, 0, 0, 0);
    public lastDrawTick: number;
    public O: SLDataObjectEntry;
    public X: number;
    public Y: number;
    public Xsp: number;
    public Ysp: number;
    public Xflip: boolean;
    public Yflip: boolean;
    public Subdata: number;
    public Key: string;
    public ObjectData: LevelObject;
    public UpperNibble: number;
    public LowerNibble: number;
    public PieceLayoutIndex: number;
    public Pieces: LevelObjectPiece[];
    public Dead: boolean;
    public State: LevelObjectInfo;
    public Index: number;
    public Debug: string[];
    public ConsoleLog: (_: string[]) => void;
    constructor(o: SLDataObjectEntry) {
        this.O = o;
        this.X = o.X;
        this.Y = o.Y;
        this.Xflip = o.XFlip;
        this.Yflip = o.YFlip;
        this.Subdata = o.SubType;
        this.Key = o.ID.toString();
        this.UpperNibble = this.Subdata >> 4;
        this.LowerNibble = this.Subdata & 0xf;
    }
    public Log(txt: string, level: number = 100): void {
        if (!this.Debug)
            this.Debug = [];
        if (level == 0)
            this.Debug.push(" -- " + txt + " -- ");
        else this.Debug.push(txt);
        if (this.ConsoleLog)
            this.ConsoleLog(this.Debug);
    }
    public SetPieceLayoutIndex(ind: number): void {
        this.PieceLayoutIndex = ind;
        let pcs = this.ObjectData.PieceLayouts[this.PieceLayoutIndex].Pieces;
        this.Pieces = [];
        for (let t of pcs) {
            //todo look into this...
            this.Pieces.push(<LevelObjectPiece><any>t);
        }
    }
    public SetObjectData(obj: LevelObject): void {
        this.ObjectData = obj;
        if (this.ObjectData.PieceLayouts.length > this.PieceLayoutIndex && this.ObjectData.PieceLayouts[this.PieceLayoutIndex].Pieces.length > 0)
            this.SetPieceLayoutIndex(this.PieceLayoutIndex);
    }
    public Tick($object: LevelObjectInfo, level: SonicLevel, sonic: Sonic): boolean {
        if (this.Dead || !this.ObjectData)
            return false;
        try {
            return this.ObjectData.Tick($object, level, sonic);
        }
        catch (EJ) {
            this.Log(EJ.Message, 0);
            return false;
        }

    }
    public MainPieceLayout(): LevelObjectPieceLayout {
        return this.ObjectData.PieceLayouts[this.PieceLayoutIndex];
    }
    public GetRect(): Rectangle {
        if (this.ObjectData.PieceLayouts.length == 0) {
            this._rect.X = this.X;
            this._rect.Y = this.Y;
            this._rect.Width = ObjectManager.broken.width;
            this._rect.Height = ObjectManager.broken.height;
            return this._rect;
        }
        return this.ObjectData.PieceLayouts[this.PieceLayoutIndex].GetRectangle(this.ObjectData);
    }
    public Draw(canvas: CanvasRenderingContext2D, x: number, y: number, showHeightMap: boolean): void {
        if (this.Dead || !this.ObjectData)
            return
        if (this.ObjectData.PieceLayouts.length == 0) {
            canvas.drawImage(ObjectManager.broken,
                (x - ObjectManager.broken.width / 2),
                (y - ObjectManager.broken.height / 2),
                ObjectManager.broken.width,
                ObjectManager.broken.height);
            return;
        }
        this.MainPieceLayout().Draw(canvas, x, y, this.ObjectData, this, showHeightMap);
        if (this.ConsoleLog != null) {
            let gr = this.GetRect();
            canvas.save();
            canvas.fillStyle = "rgba(228,228,12,0.4)";
            let wd = 1;
            canvas.fillRect(gr.X - this.X + x - (gr.Width / 2) - wd,
                gr.Y - this.Y + y - (gr.Height / 2) - wd,
                gr.Width - (gr.X - this.X) + wd * 2,
                gr.Height - (gr.Y - this.Y) + wd * 2);
            canvas.restore();
        }
    }
    public Reset(): void {
        this.X = this.O.X;
        this.Y = this.O.Y;
        this.Xsp = 0;
        this.Ysp = 0;
        this.State = null;
        this.Xflip = this.O.XFlip;
        this.Yflip = this.O.YFlip;
        this.Dead = false;
        this.PieceLayoutIndex = 0;
        this.Subdata = this.O.SubType;
        this.UpperNibble = this.Subdata >> 4;
        this.LowerNibble = this.Subdata & 0xf;
        if (this.ObjectData.PieceLayouts.length > this.PieceLayoutIndex && this.ObjectData.PieceLayouts[this.PieceLayoutIndex].Pieces.length > 0)
            this.SetPieceLayoutIndex(this.PieceLayoutIndex);
    }
    public Collides(sonic: Point): LevelObjectPiece {
        return this.Collision(sonic, false);
    }
    public HurtsSonic(sonic: Point): LevelObjectPiece {
        return this.Collision(sonic, true);
    }
    public Kill(): void {
        this.Dead = true;
    }
    public Collision(sonic: Point, isHurtMap: boolean): LevelObjectPiece {
        if (this.Dead || !this.ObjectData || this.ObjectData.PieceLayouts.length == 0)
            return null;
        let pcs = this.Pieces;
        let mX: number = ((sonic.X) - this.X) | 0;
        let mY: number = ((sonic.Y) - this.Y)|0;
        for (let j of pcs) {
            let piece = this.ObjectData.Pieces[j.PieceIndex];
            let asset = this.ObjectData.Assets[piece.AssetIndex];
            if (asset.Frames.length > 0) {
                let frm = asset.Frames[j.FrameIndex];
                let map = isHurtMap ? frm.HurtSonicMap : frm.CollisionMap;
                if (this.twoDArray(map, (mX + frm.OffsetX), (mY + frm.OffsetY), this.Xflip !== piece.Xflip, this.Yflip !== piece.Yflip) == true)
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
    public Collide(sonic: Sonic, sensor: string, piece: any): boolean {
        try {
            return this.ObjectData.OnCollide(this, SonicManager.Instance.SonicLevel, sonic, sensor, piece);
        }
        catch (EJ) {
            this.Log(EJ.Message, 0);
            return false;
        }

    }
    public HurtSonic(sonic: Sonic, sensor: string, piece: any): boolean {
        try {
            return this.ObjectData.OnHurtSonic(this, SonicManager.Instance.SonicLevel, sonic, sensor, piece);
        }
        catch (EJ) {
            this.Log(EJ.Message, 0);
            return false;
        }

    }
}