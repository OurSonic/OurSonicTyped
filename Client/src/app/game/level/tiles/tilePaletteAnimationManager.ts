import {PaletteItem} from '../../sonicLevel';
import {SonicManager} from '../../sonicManager';

export class TilePaletteAnimationManager {
  sonicManager: SonicManager;
  animations: {[key: number]: TilePaletteAnimation};

  constructor(sonicManager: SonicManager) {
    this.sonicManager = sonicManager;
    this.init();
  }

  private init(): void {
    this.animations = {};
    for (
      let animatedPaletteIndex = 0;
      animatedPaletteIndex < this.sonicManager.sonicLevel.animatedPalettes.length;
      animatedPaletteIndex++
    ) {
      this.animations[animatedPaletteIndex] = new TilePaletteAnimation(
        this,
        this.sonicManager.sonicLevel.animatedPalettes[animatedPaletteIndex]
      );
      this.animations[animatedPaletteIndex].init();
    }
  }

  clearCache(): void {
    this.animations = null;
  }

  tickAnimatedPalettes(): void {
    if (this.animations == null) {
      this.init();
    }
    for (const animation in this.animations) {
      const tilePaletteAnimation: TilePaletteAnimation = this.animations[animation];
      tilePaletteAnimation.tick();
      const tilePaletteAnimationFrame = tilePaletteAnimation.getCurrentFrame();
      if (tilePaletteAnimationFrame) {
        tilePaletteAnimationFrame.setPalette();
      }
    }
  }

  getCurrentFrame(paletteAnimationIndex: number): TilePaletteAnimationFrame {
    return this.animations[paletteAnimationIndex].getCurrentFrame();
  }

  getPaletteAnimation(paletteAnimationIndex: number): TilePaletteAnimation {
    return this.animations[paletteAnimationIndex];
  }
}

export class TilePaletteAnimation {
  manager: TilePaletteAnimationManager;
  animatedPaletteData: PaletteItem;
  currentFrame: number = 0;
  frames: TilePaletteAnimationFrame[];

  constructor(manager: TilePaletteAnimationManager, animatedPaletteData: PaletteItem) {
    this.manager = manager;
    this.animatedPaletteData = animatedPaletteData;
    this.frames = [];
  }

  getCurrentFrame(): TilePaletteAnimationFrame {
    return this.frames[this.currentFrame];
  }

  tick(): void {
    const pal = this.animatedPaletteData;
    if (pal.skipIndex === 0) {
      return;
    }
    if (pal.totalLength === 0) {
      return;
    }
    for (let j = 0; j <= pal.totalLength; j += pal.skipIndex) {
      if (this.manager.sonicManager.drawTickCount % (pal.totalLength + pal.skipIndex) === j) {
        this.currentFrame = j / pal.skipIndex;
      }
    }
  }

  init(): void {
    const pal = this.animatedPaletteData;
    if (pal.skipIndex === 0) {
      return;
    }
    if (pal.totalLength === 0) {
      return;
    }
    for (let j = 0; j <= pal.totalLength; j += pal.skipIndex) {
      const frameIndex = j / pal.skipIndex;
      if (this.frames[frameIndex] == null) {
        this.frames[frameIndex] = new TilePaletteAnimationFrame(frameIndex, this);
      }
    }
  }
}

export class TilePaletteAnimationFrame {
  animation: TilePaletteAnimation;
  frameIndex: number = 0;

  constructor(frameIndex: number, animation: TilePaletteAnimation) {
    this.animation = animation;
    this.frameIndex = frameIndex;
  }

  setPalette(): void {
    const levelPalette = this.animation.manager.sonicManager.sonicLevel.palette;
    const pal = this.animation.animatedPaletteData;
    for (let index = 0; index < pal.pieces.length; index++) {
      const palettePiece = pal.pieces[index];
      const colorIndex = this.frameIndex + pal.pieces.length * index;
      const replaceIndex = (palettePiece.paletteOffset / 2) | 0;
      const color = pal.palette[colorIndex];
      if (color != null) {
        levelPalette[palettePiece.paletteIndex][replaceIndex] = color;
      } else {
        levelPalette[palettePiece.paletteIndex][replaceIndex] = 0;
      }
    }
  }
}
