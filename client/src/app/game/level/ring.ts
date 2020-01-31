import {CanvasInformation} from '../../common/canvasInformation';
import {GameState} from '../../common/enums';
import {IntersectingRectangle, Point, Rectangle} from '../../common/utils';
import {SonicEngine} from '../sonicEngine';
import {SonicManager} from '../sonicManager';

export class Ring extends Point {
  active: boolean = false;
  animationIndex: number = 0;
  tickCount: number = 0;
  ysp: number = 0;
  xsp: number = 0;

  constructor(private sonicManager: SonicManager, active: boolean) {
    super(0, 0);
    this.active = active;
  }

  draw(canvas: CanvasRenderingContext2D, x: number, y: number): void {
    if (this.active) {
      this.ysp += 0.09375;
      this.x += this.xsp as number;
      this.y += this.ysp as number;
      const wl = this.sonicManager.windowLocation;
      if (this.x < wl.x || this.y < wl.y || this.x > wl.x + wl.width || this.y > wl.y + wl.height) {
        this.tickCount = 0xfffffff;
        return;
      }
      if (
        this.sonicManager.drawTickCount > this.sonicManager.sonicToon.sonicLastHitTick + 64 &&
        IntersectingRectangle.intersectsRect(
          this.sonicManager.sonicToon.myRec,
          new Rectangle(this.x - 8, this.y - 8, 8 * 2, 2 * 8)
        )
      ) {
        this.tickCount = 0xfffffff;
        this.sonicManager.sonicToon.rings++;
        return;
      }
      this.tickCount++;
    }
    if (this.sonicManager.currentGameState === GameState.playing) {
      this.animationIndex =
        ((this.sonicManager.drawTickCount % ((this.active ? 4 : 8) * 4)) / (this.active ? 4 : 8)) | 0;
    } else {
      this.animationIndex = 0;
    }
    let sprites: CanvasInformation[] = null;
    if (SonicEngine.instance.spriteCache.rings) {
      sprites = SonicEngine.instance.spriteCache.rings;
    } else {
      throw new Error('bad ring animation');
    }
    const sps = sprites[this.animationIndex];
    canvas.drawImage(sps.canvas, x - 8, y - 8);
  }
}
