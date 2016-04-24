import {CanvasInformation } from "../../../common/CanvasInformation";
import {Point } from "../../../common/Utils";

export class LevelObjectAssetFrame {
    public offsetX: number;
    public width: number;
    public height: number;
    public offsetY: number;
    public hurtSonicMap: number[][];
    public collisionMap: number[][];
    public colorMap: number[][];
    public palette: string[];
    public name: string;
    private Image: { [key: number]: CanvasInformation};
    public transparentColor: string;
    constructor(name: string) {
        this.Image = {};
        this.name = name;
        this.collisionMap = new Array(100);
        this.hurtSonicMap = new Array(100);
        for (let i = 0; i < 100; i++) {
            this.collisionMap[i] = new Array(100);
            this.hurtSonicMap[i] = new Array(100);
        }
    }
    public SetWidth(w: number): void {
        this.width = w;
        this.collisionMap = this.collisionMap.slice(0, w);
        this.ClearCache();
    }
    public SetHeight(h: number): void {
        this.height = h;
        for (let j = 0; j < this.width; j++) {
            this.collisionMap[j] = this.collisionMap[j].slice(0, h);
        }
        this.ClearCache();
    }
    public SetOffset(ex: number, ey: number): void {
        this.offsetX = ex;
        this.offsetY = ey;
        this.ClearCache();
    }
    public DrawSimple(mainCanvas: CanvasRenderingContext2D, pos: Point, width: number, height: number, xflip: boolean, yflip: boolean): void {
        let c = this.GetCache(false, false, false);
        mainCanvas.save();
        mainCanvas.translate(pos.x, pos.y);
        mainCanvas.scale((width / this.width) | 0, (height / this.height) | 0);
        mainCanvas.drawImage(c.canvas, 0, 0);
        mainCanvas.restore();
    }
    public GetCache(showOutline: boolean, showCollideMap: boolean, showHurtMap: boolean): CanvasInformation {
        let m = this.Image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)];
        if (m == null) {
            let mj = CanvasInformation.create(this.width, this.height, false);
            let canvas = mj.Context;
            canvas.save();
            canvas.strokeStyle = "#000000";
            canvas.lineWidth = 1;
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let ex = x;
                    let ey = y;
                    let d = this.colorMap[ex][ey];
                    let color = this.palette[d];
                    if (color == this.transparentColor) {
                        canvas.fillStyle = "rgba(0,0,0,0)";
                    }
                    else {
                        canvas.fillStyle = "#" + color;
                    }
                    canvas.fillRect(ex, ey, 1, 1);
                    if (showCollideMap) {
                        if (this.collisionMap[ex][ey] > 0) {
                            canvas.fillStyle = "rgba(30,34,255,0.6)";
                            canvas.fillRect(ex, ey, 1, 1);
                        }
                    }
                    if (showHurtMap) {
                        if (this.hurtSonicMap[ex][ey] > 0) {
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
        _canvas.translate(pos.x, pos.y);
        if (xflip) {
            if (yflip) {
                _canvas.translate(fd.canvas.width / 2, fd.canvas.height / 2);
                _canvas.rotate(-90 * Math.PI / 180);
                _canvas.translate(-fd.canvas.width / 2, -fd.canvas.height / 2);
                _canvas.translate(0, this.height);
                _canvas.scale(1, -1);
            }
            else {
                _canvas.translate(fd.canvas.width / 2, fd.canvas.height / 2);
                _canvas.rotate(-90 * Math.PI / 180);
                _canvas.translate(-fd.canvas.width / 2, -fd.canvas.height / 2);
            }
        }
        else {
            if (yflip) {
                _canvas.translate(0, this.height);
                _canvas.scale(1, -1);
            }
            else {

            }
        }
        _canvas.drawImage(fd.canvas, 0, 0);
        if (showOffset) {
            _canvas.beginPath();
            _canvas.moveTo(this.offsetX, 0);
            _canvas.lineTo(this.offsetX, this.height);
            _canvas.lineWidth = 1;
            _canvas.strokeStyle = "#000000";
            _canvas.stroke();
            _canvas.beginPath();
            _canvas.moveTo(0, this.offsetY);
            _canvas.lineTo(this.width, this.offsetY);
            _canvas.lineWidth = 1;
            _canvas.strokeStyle = "#000000";
            _canvas.stroke();
        }
        _canvas.restore();
    }
}