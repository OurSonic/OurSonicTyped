import {CanvasInformation } from "../../../Common/CanvasInformation";
import {Point } from "../../../Common/Utils";

export class LevelObjectAssetFrame {
    public OffsetX: number;
    public Width: number;
    public Height: number;
    public OffsetY: number;
    public HurtSonicMap: number[][];
    public CollisionMap: number[][];
    public ColorMap: number[][];
    public Palette: string[];
    public Name: string;
    private Image: { [key: number]: CanvasInformation};
    public TransparentColor: string;
    constructor(name: string) {
        this.Image = {};
        this.Name = name;
        this.CollisionMap = new Array(100);
        this.HurtSonicMap = new Array(100);
        for (let i = 0; i < 100; i++) {
            this.CollisionMap[i] = new Array(100);
            this.HurtSonicMap[i] = new Array(100);
        }
    }
    public SetWidth(w: number): void {
        this.Width = w;
        this.CollisionMap = this.CollisionMap.slice(0, w);
        this.ClearCache();
    }
    public SetHeight(h: number): void {
        this.Height = h;
        for (let j = 0; j < this.Width; j++) {
            this.CollisionMap[j] = this.CollisionMap[j].slice(0, h);
        }
        this.ClearCache();
    }
    public SetOffset(ex: number, ey: number): void {
        this.OffsetX = ex;
        this.OffsetY = ey;
        this.ClearCache();
    }
    public DrawSimple(mainCanvas: CanvasRenderingContext2D, pos: Point, width: number, height: number, xflip: boolean, yflip: boolean): void {
        let c = this.GetCache(false, false, false);
        mainCanvas.save();
        mainCanvas.translate(pos.X, pos.Y);
        mainCanvas.scale((width / this.Width) | 0, (height / this.Height) | 0);
        mainCanvas.drawImage(c.Canvas, 0, 0);
        mainCanvas.restore();
    }
    public GetCache(showOutline: boolean, showCollideMap: boolean, showHurtMap: boolean): CanvasInformation {
        let m = this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)];
        if (m == null) {
            let mj = CanvasInformation.Create(this.Width, this.Height, false);
            let canvas = mj.Context;
            canvas.save();
            canvas.strokeStyle = "#000000";
            canvas.lineWidth = 1;
            for (let x = 0; x < this.Width; x++) {
                for (let y = 0; y < this.Height; y++) {
                    let ex = x;
                    let ey = y;
                    let d = this.ColorMap[ex][ey];
                    let color = this.Palette[d];
                    if (color == this.TransparentColor) {
                        canvas.fillStyle = "rgba(0,0,0,0)";
                    }
                    else {
                        canvas.fillStyle = "#" + color;
                    }
                    canvas.fillRect(ex, ey, 1, 1);
                    if (showCollideMap) {
                        if (this.CollisionMap[ex][ey] > 0) {
                            canvas.fillStyle = "rgba(30,34,255,0.6)";
                            canvas.fillRect(ex, ey, 1, 1);
                        }
                    }
                    if (showHurtMap) {
                        if (this.HurtSonicMap[ex][ey] > 0) {
                            canvas.fillStyle = "rgba(211,12,55,0.6)";
                            canvas.fillRect(ex, ey, 1, 1);
                        }
                    }
                }
            }
            canvas.restore();
            m = mj;
            this.SetCache(mj, showOutline, showCollideMap, showHurtMap);
        }
        return m;
    }
    public ClearCache(): void {
        this.Image = {};
    }
    public SetCache(image: CanvasInformation, showOutline: boolean, showCollideMap: boolean, showHurtMap: boolean): void {
        this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)] = image;
    }
    public DrawUI(_canvas: CanvasRenderingContext2D,
        pos: Point,
        showOutline: boolean,
        showCollideMap: boolean,
        showHurtMap: boolean,
        showOffset: boolean,
        xflip: boolean,
        yflip: boolean): void {
        let fd = this.GetCache(showOutline, showCollideMap, showHurtMap);
        _canvas.save();
        _canvas.translate(pos.X, pos.Y);
        if (xflip) {
            if (yflip) {
                _canvas.translate(fd.Canvas.width / 2, fd.Canvas.height / 2);
                _canvas.rotate(-90 * Math.PI / 180);
                _canvas.translate(-fd.Canvas.width / 2, -fd.Canvas.height / 2);
                _canvas.translate(0, this.Height);
                _canvas.scale(1, -1);
            }
            else {
                _canvas.translate(fd.Canvas.width / 2, fd.Canvas.height / 2);
                _canvas.rotate(-90 * Math.PI / 180);
                _canvas.translate(-fd.Canvas.width / 2, -fd.Canvas.height / 2);
            }
        }
        else {
            if (yflip) {
                _canvas.translate(0, this.Height);
                _canvas.scale(1, -1);
            }
            else {

            }
        }
        _canvas.drawImage(fd.Canvas, 0, 0);
        if (showOffset) {
            _canvas.beginPath();
            _canvas.moveTo(this.OffsetX, 0);
            _canvas.lineTo(this.OffsetX, this.Height);
            _canvas.lineWidth = 1;
            _canvas.strokeStyle = "#000000";
            _canvas.stroke();
            _canvas.beginPath();
            _canvas.moveTo(0, this.OffsetY);
            _canvas.lineTo(this.Width, this.OffsetY);
            _canvas.lineWidth = 1;
            _canvas.strokeStyle = "#000000";
            _canvas.stroke();
        }
        _canvas.restore();
    }
}