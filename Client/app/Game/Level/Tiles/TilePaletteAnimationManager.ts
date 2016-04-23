import {SonicManager } from "../../SonicManager";
import {PaletteItem } from "../../SonicLevel";

export class TilePaletteAnimationManager {
    public SonicManager: SonicManager;
    public Animations: { [key: number]: TilePaletteAnimation };
    constructor(sonicManager: SonicManager) {
        this.SonicManager = sonicManager;
        this.Init();
    }
    private Init(): void {
        this.Animations = {};
        for (let animatedPaletteIndex: number = 0; animatedPaletteIndex < this.SonicManager.sonicLevel.AnimatedPalettes.length; animatedPaletteIndex++) {
            this.Animations[animatedPaletteIndex] = new TilePaletteAnimation(this, this.SonicManager.sonicLevel.AnimatedPalettes[animatedPaletteIndex]);
            this.Animations[animatedPaletteIndex].Init();
        }
    }
    public ClearCache(): void {
        this.Animations = null;
    }
    public TickAnimatedPalettes(): void {
        if (this.Animations == null)
            this.Init();
        for (let animation in this.Animations) {
            let tilePaletteAnimation: TilePaletteAnimation = this.Animations[animation];
            tilePaletteAnimation.Tick();
        }
    }
    public GetCurrentFrame(paletteAnimationIndex: number): TilePaletteAnimationFrame {
        return this.Animations[paletteAnimationIndex].GetCurrentFrame();
    }
    public GetPaletteAnimation(paletteAnimationIndex: number): TilePaletteAnimation {
        return this.Animations[paletteAnimationIndex];
    }
}
export class TilePaletteAnimation {
    public Manager: TilePaletteAnimationManager;
    public AnimatedPaletteData: PaletteItem;
    public CurrentFrame: number;
    public Frames: TilePaletteAnimationFrame[];
    constructor(manager: TilePaletteAnimationManager, animatedPaletteData: PaletteItem) {
        this.Manager = manager;
        this.AnimatedPaletteData = animatedPaletteData;
        this.Frames = new Array<TilePaletteAnimationFrame>();
    }
    public GetCurrentFrame(): TilePaletteAnimationFrame {
        return this.Frames[this.CurrentFrame];
    }
    public Tick(): void {
        let pal = this.AnimatedPaletteData;
        if (pal.SkipIndex == 0)
            return
        if (pal.TotalLength == 0)
            return
        for (let j: number = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
            if (this.Manager.SonicManager.drawTickCount % (pal.TotalLength + pal.SkipIndex) == j) {
                this.CurrentFrame = j / pal.SkipIndex;
            }
        }
    }
    public Init(): void {
        let pal = this.AnimatedPaletteData;
        if (pal.SkipIndex == 0)
            return
        if (pal.TotalLength == 0)
            return
        for (let j: number = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
            let frameIndex: number = j / pal.SkipIndex;
            if (this.Frames[frameIndex] == null) {
                this.Frames[frameIndex] = new TilePaletteAnimationFrame(frameIndex, this);
            }
        }
    }
}
export class TilePaletteAnimationFrame {
    public Animation: TilePaletteAnimation;
    /*[IntrinsicProperty]*/
    public FrameIndex: number;
    constructor(frameIndex: number, animation: TilePaletteAnimation) {
        this.Animation = animation;
        this.FrameIndex = frameIndex;
    }
    private tempPalette: string[][];
    public SetPalette(): void {
        let levelPalette = this.Animation.Manager.SonicManager.sonicLevel.Palette;
        this.clonePalette(levelPalette);
        let pal = this.Animation.AnimatedPaletteData;
        for (let index: number = 0; index < pal.Pieces.length; index++) {
            let palettePiece = pal.Pieces[index];
            let colorIndex: number = this.FrameIndex + (pal.Pieces.length * index);
            let replaceIndex: number = (palettePiece.PaletteOffset) / 2|0;
            let color = pal.Palette[colorIndex];
            if (color != null)
                levelPalette[palettePiece.PaletteIndex][replaceIndex] = color;
            else levelPalette[palettePiece.PaletteIndex][replaceIndex] = "#000000";
        }
    }
    private clonePalette(levelPalette: string[][]): void {
        this.tempPalette = new Array(levelPalette.length);
        for (let index: number = 0; index < levelPalette.length; index++) {
            let canvasElements = levelPalette[index];
            this.tempPalette[index] = new Array(canvasElements.length);
            for (let index2: number = 0; index2 < canvasElements.length; index2++) {
                this.tempPalette[index][index2] = canvasElements[index2];
            }
        }
    }
    public ClearPalette(): void {
        this.Animation.Manager.SonicManager.sonicLevel.Palette = this.tempPalette;
        this.tempPalette = null;
    }
}