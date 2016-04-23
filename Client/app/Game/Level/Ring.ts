import {Point,IntersectingRectangle, Rectangle } from "../../Common/Utils";
import {SonicManager} from "../SonicManager";
import {GameState} from "../../Common/Enums";
import {CanvasInformation} from "../../Common/CanvasInformation";

export class Ring extends Point {
    public Active: boolean;
    protected AnimationIndex: number;
    public TickCount: number;
    public Ysp: number;
    public Xsp: number;
    constructor(active: boolean) {
        super(0, 0);
        this.Active = active;
    }
    public Draw(canvas: CanvasRenderingContext2D, pos: Point): void {
        if (this.Active) {
            this.Ysp += 0.09375;
            this.X += <number>this.Xsp;
            this.Y += <number>this.Ysp;
            let wl = SonicManager.instance.windowLocation;
            if (this.X < wl.X || this.Y < wl.Y || this.X > wl.X + wl.Width || this.Y > wl.Y + wl.Height) {
                this.TickCount = 0xfffffff;
                return
            }
            if (SonicManager.instance.drawTickCount > SonicManager.instance.sonicToon.sonicLastHitTick + 64 && IntersectingRectangle.IntersectsRect(SonicManager.instance.sonicToon.myRec,
                new Rectangle(this.X - 8, this.Y - 8, 8 * 2, 2 * 8))) {
                this.TickCount = 0xfffffff;
                SonicManager.instance.sonicToon.rings++;
                return
            }
            this.TickCount++;
        }
        if (SonicManager.instance.currentGameState == GameState.Playing)
            this.AnimationIndex = ((SonicManager.instance.drawTickCount % ((this.Active ? 4 : 8) * 4)) / (this.Active ? 4 : 8))|0;
        else this.AnimationIndex = 0;
        let sprites: CanvasInformation[] = null;
        if (SonicManager.instance.spriteCache.Rings)
            sprites = SonicManager.instance.spriteCache.Rings;
        else throw ("bad ring animation");
        let sps = sprites[this.AnimationIndex];
        canvas.drawImage(sps.Canvas, (pos.X - 8), (pos.Y - 8));
    }
}