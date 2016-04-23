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
            var wl = SonicManager.Instance.WindowLocation;
            if (this.X < wl.X || this.Y < wl.Y || this.X > wl.X + wl.Width || this.Y > wl.Y + wl.Height) {
                this.TickCount = 0xfffffff;
                return
            }
            if (SonicManager.Instance.DrawTickCount > SonicManager.Instance.SonicToon.sonicLastHitTick + 64 && IntersectingRectangle.IntersectsRect(SonicManager.Instance.SonicToon.myRec,
                new Rectangle(this.X - 8, this.Y - 8, 8 * 2, 2 * 8))) {
                this.TickCount = 0xfffffff;
                SonicManager.Instance.SonicToon.Rings++;
                return
            }
            this.TickCount++;
        }
        if (SonicManager.Instance.CurrentGameState == GameState.Playing)
            this.AnimationIndex = (SonicManager.Instance.DrawTickCount % ((this.Active ? 4 : 8) * 4)) / (this.Active ? 4 : 8);
        else this.AnimationIndex = 0;
        var sprites: CanvasInformation[] = null;
        if (SonicManager.Instance.SpriteCache.Rings)
            sprites = SonicManager.Instance.SpriteCache.Rings;
        else throw ("bad ring animation");
        var sps = sprites[this.AnimationIndex];
        canvas.drawImage(sps.Canvas, (pos.X - 8), (pos.Y - 8));
    }
}