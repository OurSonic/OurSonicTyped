import {CanvasInformation} from '../../common/canvasInformation';
import {GameState} from '../../common/enums';
import {IntersectingRectangle, Point, Rectangle} from '../../common/utils';
import {SonicEngine} from '../sonicEngine';
import {SonicManager} from '../sonicManager';

export class Ring extends Point {
  Active: boolean = false;
  protected AnimationIndex: number = 0;
  TickCount: number = 0;
  Ysp: number = 0;
  Xsp: number = 0;
  constructor(active: boolean) {
    super(0, 0);
    this.Active = active;
  }
  Draw(canvas: CanvasRenderingContext2D, x: number, y: number): void {
    if (this.Active) {
      this.Ysp += 0.09375;
      this.x += this.Xsp as number;
      this.y += this.Ysp as number;
      const wl = SonicManager.instance.windowLocation;
      if (this.x < wl.x || this.y < wl.y || this.x > wl.x + wl.width || this.y > wl.y + wl.height) {
        this.TickCount = 0xfffffff;
        return;
      }
      if (
        SonicManager.instance.drawTickCount > SonicManager.instance.sonicToon.sonicLastHitTick + 64 &&
        IntersectingRectangle.intersectsRect(
          SonicManager.instance.sonicToon.myRec,
          new Rectangle(this.x - 8, this.y - 8, 8 * 2, 2 * 8)
        )
      ) {
        this.TickCount = 0xfffffff;
        SonicManager.instance.sonicToon.rings++;
        return;
      }
      this.TickCount++;
    }
    if (SonicManager.instance.currentGameState == GameState.Playing) {
      this.AnimationIndex =
        ((SonicManager.instance.drawTickCount % ((this.Active ? 4 : 8) * 4)) / (this.Active ? 4 : 8)) | 0;
    } else {
      this.AnimationIndex = 0;
    }
    let sprites: CanvasInformation[] = null;
    if (SonicEngine.instance.spriteCache.Rings) {
      sprites = SonicEngine.instance.spriteCache.Rings;
    } else {
      throw new Error('bad ring animation');
    }
    const sps = sprites[this.AnimationIndex];
    canvas.drawImage(sps.canvas, x - 8, y - 8);
  }
}
