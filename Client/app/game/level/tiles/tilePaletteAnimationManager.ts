import {PaletteItem} from '../../sonicLevel';
import {SonicManager} from '../../sonicManager';

export class TilePaletteAnimationManager {
  SonicManager: SonicManager;
  Animations: {[key: number]: TilePaletteAnimation};

  constructor(sonicManager: SonicManager) {
    this.SonicManager = sonicManager;
    this.Init();
  }

  private Init(): void {
    this.Animations = {};
    for (
      let animatedPaletteIndex: number = 0;
      animatedPaletteIndex < this.SonicManager.sonicLevel.animatedPalettes.length;
      animatedPaletteIndex++
    ) {
      this.Animations[animatedPaletteIndex] = new TilePaletteAnimation(
        this,
        this.SonicManager.sonicLevel.animatedPalettes[animatedPaletteIndex]
      );
      this.Animations[animatedPaletteIndex].Init();
    }
  }

  ClearCache(): void {
    this.Animations = null;
  }

  tickAnimatedPalettes(): void {
    if (this.Animations == null) {
      this.Init();
    }
    for (const animation in this.Animations) {
      const tilePaletteAnimation: TilePaletteAnimation = this.Animations[animation];
      tilePaletteAnimation.Tick();
      const tilePaletteAnimationFrame = tilePaletteAnimation.GetCurrentFrame();
      if (tilePaletteAnimationFrame) {
        tilePaletteAnimationFrame.SetPalette();
      }
    }
  }

  getCurrentFrame(paletteAnimationIndex: number): TilePaletteAnimationFrame {
    return this.Animations[paletteAnimationIndex].GetCurrentFrame();
  }

  GetPaletteAnimation(paletteAnimationIndex: number): TilePaletteAnimation {
    return this.Animations[paletteAnimationIndex];
  }
}

export class TilePaletteAnimation {
  Manager: TilePaletteAnimationManager;
  AnimatedPaletteData: PaletteItem;
  CurrentFrame: number = 0;
  Frames: TilePaletteAnimationFrame[];

  constructor(manager: TilePaletteAnimationManager, animatedPaletteData: PaletteItem) {
    this.Manager = manager;
    this.AnimatedPaletteData = animatedPaletteData;
    this.Frames = [];
  }

  GetCurrentFrame(): TilePaletteAnimationFrame {
    return this.Frames[this.CurrentFrame];
  }

  Tick(): void {
    const pal = this.AnimatedPaletteData;
    if (pal.skipIndex == 0) {
      return;
    }
    if (pal.totalLength == 0) {
      return;
    }
    for (let j: number = 0; j <= pal.totalLength; j += pal.skipIndex) {
      if (this.Manager.SonicManager.drawTickCount % (pal.totalLength + pal.skipIndex) == j) {
        this.CurrentFrame = j / pal.skipIndex;
      }
    }
  }

  Init(): void {
    const pal = this.AnimatedPaletteData;
    if (pal.skipIndex == 0) {
      return;
    }
    if (pal.totalLength == 0) {
      return;
    }
    for (let j: number = 0; j <= pal.totalLength; j += pal.skipIndex) {
      const frameIndex: number = j / pal.skipIndex;
      if (this.Frames[frameIndex] == null) {
        this.Frames[frameIndex] = new TilePaletteAnimationFrame(frameIndex, this);
      }
    }
  }
}

export class TilePaletteAnimationFrame {
  Animation: TilePaletteAnimation;
  FrameIndex: number = 0;

  constructor(frameIndex: number, animation: TilePaletteAnimation) {
    this.Animation = animation;
    this.FrameIndex = frameIndex;
  }

  SetPalette(): void {
    const levelPalette = this.Animation.Manager.SonicManager.sonicLevel.palette;
    const pal = this.Animation.AnimatedPaletteData;
    for (let index: number = 0; index < pal.pieces.length; index++) {
      const palettePiece = pal.pieces[index];
      const colorIndex: number = this.FrameIndex + pal.pieces.length * index;
      const replaceIndex: number = (palettePiece.paletteOffset / 2) | 0;
      const color = pal.palette[colorIndex];
      if (color != null) {
        levelPalette[palettePiece.paletteIndex][replaceIndex] = color;
      } else {
        levelPalette[palettePiece.paletteIndex][replaceIndex] = 0;
      }
    }
  }
}
