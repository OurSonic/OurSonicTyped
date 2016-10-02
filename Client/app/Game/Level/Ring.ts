import {Point,IntersectingRectangle, Rectangle } from "../../common/Utils";
import {SonicManager} from "../SonicManager";
import {GameState} from "../../common/Enums";
import {CanvasInformation} from "../../common/CanvasInformation";

export class Ring extends Point {
    public Active: boolean=false;
    protected AnimationIndex: number=0;
    public TickCount: number=0;
    public Ysp: number=0;
    public Xsp: number=0;
    constructor(active: boolean) {
        super(0, 0);
        this.Active = active;
    }
    public Draw(canvas: CanvasRenderingContext2D, pos: Point): void {
        if (this.Active) {
            this.Ysp += 0.09375;
            this.x += <number>this.Xsp;
            this.y += <number>this.Ysp;
            let wl = SonicManager.instance.windowLocation;
            if (this.x < wl.x || this.y < wl.y || this.x > wl.x + wl.width || this.y > wl.y + wl.height) {
                this.TickCount = 0xfffffff;
                return
            }
            if (SonicManager.instance.drawTickCount > SonicManager.instance.sonicToon.sonicLastHitTick + 64 && IntersectingRectangle.IntersectsRect(SonicManager.instance.sonicToon.myRec,
                new Rectangle(this.x - 8, this.y - 8, 8 * 2, 2 * 8))) {
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
        canvas.drawImage(sps.canvas, (pos.x - 8), (pos.y - 8));
    }
}