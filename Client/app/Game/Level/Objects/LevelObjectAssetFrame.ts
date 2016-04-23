import {CanvasInformation } from "../../../Common/CanvasInformation";
import {Point } from "../../../Common/Utils";

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
    private image: { [key: number]: CanvasInformation };
    public transparentColor: string;
    constructor(name: string) {
        this.image = {};
        this.name = name;
        this.collisionMap = new Array(100);
        this.hurtSonicMap = new Array(100);
        for (var i = 0; i < 100; i++) {
            this.collisionMap[i] = new Array(100);
            this.hurtSonicMap[i] = new Array(100);
        }
    }
    public setWidth(w: number): void {
        this.width = w;
        this.collisionMap = this.collisionMap.slice(0, w);
        this.clearCache();
    }
    public setHeight(h: number): void {
        this.height = h;
        for (var j = 0; j < this.width; j++) {
            this.collisionMap[j] = this.collisionMap[j].slice(0, h);
        }
        this.clearCache();
    }
    public setOffset(ex: number, ey: number): void {
        this.offsetX = ex;
        this.offsetY = ey;
        this.clearCache();
    }
    public drawSimple(mainCanvas: CanvasRenderingContext2D, pos: Point, width: number, height: number, xflip: boolean, yflip: boolean): void {
        var c = this.getCache(false, false, false);
        mainCanvas.save();
        mainCanvas.translate(pos.x, pos.y);
        mainCanvas.scale((<number>width / width), (<number>height / height));
        mainCanvas.drawImage(c.canvas, 0, 0);
        mainCanvas.restore();
    }
    public getCache(showOutline: boolean, showCollideMap: boolean, showHurtMap: boolean): CanvasInformation {
        var m = this.image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)];
        if (m == null) {
            var mj = CanvasInformation.create(this.width, this.height, false);
            var canvas = mj.context;
            canvas.save();
            canvas.strokeStyle = "#000000";
            canvas.lineWidth = 1;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var ex = x;
                    var ey = y;
                    var d = this.colorMap[ex][ey];
                    var color = this.palette[d];
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
            this.setCache(mj, showOutline, showCollideMap, showHurtMap);
        }
        return m;
    }
    public clearCache(): void {
        this.image = {};
    }
    public setCache(image: CanvasInformation, showOutline: boolean, showCollideMap: boolean, showHurtMap: boolean): void {
        this.image[(((showOutline ? 1 : 0) + 2) * 7) ^ (((showCollideMap ? 1 : 0) + 2) * 89) ^ (((showHurtMap ? 1 : 0) + 2) * 79)] = image;
    }
    public drawUI(_canvas: CanvasRenderingContext2D,
        pos: Point,
        showOutline: boolean,
        showCollideMap: boolean,
        showHurtMap: boolean,
        showOffset: boolean,
        xflip: boolean,
        yflip: boolean): void {
        var fd = this.getCache(showOutline, showCollideMap, showHurtMap);
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