import {RotationMode} from "../Sonic/SensorManager";
import {Point } from "../../Common/Utils";
import {SonicManager} from "../SonicManager";
import {CanvasInformation} from "../../Common/CanvasInformation";
import {Help} from "../../Common/Help";

export class HeightMap {
    public static colors: string[] = new Array("", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)");
    protected width: number;
    protected height: number;
    public items: number[];
    protected index: number;
    public full: boolean;
    constructor(heightMap: number[], i: number) {
        this.items = heightMap;
        this.width = 16;
        this.height = 16;
        this.index = i;
    }
    /* constructor(full: boolean) {
         full = full;
     }*/
    public setItem(x: number, y: number, rotationMode: RotationMode): void {
        var jx = 0;
        var jy = 0;
        switch (rotationMode) {
            case RotationMode.Floor:
                jx = x;
                jy = y;
                break;
            case RotationMode.LeftWall:
                jx = y;
                jy = 15 - x;
                break;
            case RotationMode.Ceiling:
                jx = x;
                jy = 15 - y;
                break;
            case RotationMode.RightWall:
                jx = y;
                jy = x;
                break;
        }
        this.items[jx] = 16 - jy;
    }
    public draw(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, solid: number, angle: number): void {
        if (this.items == null)
            return
        canvas.save();
        var oPos = Point.create(pos);
        if (xflip) {
            pos.x = -pos.x - 16;
            canvas.scale(-1, 1);
        }
        if (yflip) {
            pos.y = -pos.y - 16;
            canvas.scale(1, -1);
        }
        var fd = SonicManager.instance.spriteCache.heightMaps[this.index + (solid << 20)];
        if (this.index != -1 && fd)
            canvas.drawImage(fd.canvas, pos.x, pos.y);
        else {
            var ntcanvas = CanvasInformation.create(16, 16, false);
            var ncanvas = ntcanvas.context;
            if (solid > 0) {
                for (var x: number = 0; x < 16; x++) {
                    for (var y: number = 0; y < 16; y++) {
                        var jx = 0;
                        var jy = 0;
                        if (HeightMap.itemsGood(this.items, x, y)) {
                            jx = x;
                            jy = y;
                            var _x = jx;
                            var _y = jy;
                            ncanvas.lineWidth = 1;
                            ncanvas.fillStyle = HeightMap.colors[solid];
                            ncanvas.fillRect(_x, _y, 1, 1);
                            if (angle != 255) {
                                ncanvas.beginPath();
                                ncanvas.lineWidth = 1;
                                ncanvas.strokeStyle = "rgba(163,241,255,0.8)";
                                ncanvas.moveTo(16 / 2, 16 / 2);
                                ncanvas.lineTo(16 / 2 - Help.sin(angle) * 8, 16 / 2 - Help.cos(angle) * 8);
                                ncanvas.stroke();
                            }
                        }
                    }
                }
            }
            SonicManager.instance.spriteCache.heightMaps[this.index + (solid << 20)] = ntcanvas;
            canvas.drawImage(ntcanvas.canvas, pos.x, pos.y);
        }
        canvas.restore();
        pos.x = oPos.x;
        pos.y = oPos.y;
    }
    public static itemsGood(items: number[], x: number, y: number): boolean {
        if (items[x] < 0)
            return Math.abs(items[x]) >= y;
        return items[x] >= 16 - y;
    }
}