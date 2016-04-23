import {Point } from "../../Common/Utils";
import {SonicManager} from "../SonicManager";
import {CanvasInformation} from "../../Common/CanvasInformation";
import {Help} from "../../Common/Help";
import {RotationMode  } from "../../Common/Enums";

export class HeightMap {
    public static colors: string[] = new Array("", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)");
    protected Width: number;
    protected Height: number;
    public Items: number[];
    protected Index: number;
    public Full: boolean=undefined;
    constructor(heightMap: number[], i: number) {
        this.Items = heightMap;
        this.Width = 16;
        this.Height = 16;
        this.Index = i;
        this.Full = undefined;
    }
    static FullHeight(full: boolean): HeightMap {
        let h = new HeightMap(null, 0);
        h.Full = full;
        return h;
    }
    public SetItem(x: number, y: number, rotationMode: RotationMode): void {
        let jx = 0;
        let jy = 0;
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
        this.Items[jx] = 16 - jy;
    }
    public Draw(canvas: CanvasRenderingContext2D, pos: Point, xflip: boolean, yflip: boolean, solid: number, angle: number): void {
        if (this.Items == null)
            return
        canvas.save();
        let oPos = Point.Create(pos);
        if (xflip) {
            pos.X = -pos.X - 16;
            canvas.scale(-1, 1);
        }
        if (yflip) {
            pos.Y = -pos.Y - 16;
            canvas.scale(1, -1);
        }
        let fd = SonicManager.Instance.SpriteCache.HeightMaps[this.Index + (solid << 20)];
        if (this.Index != -1 && fd)
            canvas.drawImage(fd.Canvas, pos.X, pos.Y);
        else {
            let ntcanvas = CanvasInformation.Create(16, 16, false);
            let ncanvas = ntcanvas.Context;
            if (solid > 0) {
                for (let x: number = 0; x < 16; x++) {
                    for (let y: number = 0; y < 16; y++) {
                        let jx = 0;
                        let jy = 0;
                        if (HeightMap.ItemsGood(this.Items, x, y)) {
                            jx = x;
                            jy = y;
                            let _x = jx;
                            let _y = jy;
                            ncanvas.lineWidth = 1;
                            ncanvas.fillStyle = HeightMap.colors[solid];
                            ncanvas.fillRect(_x, _y, 1, 1);
                            if (angle != 255) {
                                ncanvas.beginPath();
                                ncanvas.lineWidth = 1;
                                ncanvas.strokeStyle = "rgba(163,241,255,0.8)";
                                ncanvas.moveTo(16 / 2, 16 / 2);
                                ncanvas.lineTo(16 / 2 - Help.Sin(angle) * 8, 16 / 2 - Help.Cos(angle) * 8);
                                ncanvas.stroke();
                            }
                        }
                    }
                }
            }
            SonicManager.Instance.SpriteCache.HeightMaps[this.Index + (solid << 20)] = ntcanvas;
            canvas.drawImage(ntcanvas.Canvas, pos.X, pos.Y);
        }
        canvas.restore();
        pos.X = oPos.X;
        pos.Y = oPos.Y;
    }
    public static ItemsGood(items: number[], x: number, y: number): boolean {
        if (items[x] < 0)
            return Math.abs(items[x]) >= y;
        return items[x] >= 16 - y;
    }
}