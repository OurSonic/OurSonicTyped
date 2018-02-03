import {SonicManager} from "../../SonicManager";
import {PaletteItem} from "../../SonicLevel";

export class TilePaletteAnimationManager {
    public SonicManager: SonicManager;
    public Animations: { [key: number]: TilePaletteAnimation };

    constructor(sonicManager: SonicManager) {
        this.SonicManager = sonicManager;
        this.Init();
    }

    private Init(): void {
        this.Animations = {};
        for (let animatedPaletteIndex: number = 0; animatedPaletteIndex < this.SonicManager.sonicLevel.animatedPalettes.length; animatedPaletteIndex++) {
            this.Animations[animatedPaletteIndex] = new TilePaletteAnimation(this, this.SonicManager.sonicLevel.animatedPalettes[animatedPaletteIndex]);
            this.Animations[animatedPaletteIndex].Init();
        }
    }

    public ClearCache(): void {
        this.Animations = null;
    }

    public tickAnimatedPalettes(): void {
        if (this.Animations == null)
            this.Init();
        for (let animation in this.Animations) {
            let tilePaletteAnimation: TilePaletteAnimation = this.Animations[animation];
            tilePaletteAnimation.Tick();
            let tilePaletteAnimationFrame = tilePaletteAnimation.GetCurrentFrame();
            if (tilePaletteAnimationFrame)
                tilePaletteAnimationFrame.SetPalette();
        }
    }

    public getCurrentFrame(paletteAnimationIndex: number): TilePaletteAnimationFrame {
        return this.Animations[paletteAnimationIndex].GetCurrentFrame();
    }

    public GetPaletteAnimation(paletteAnimationIndex: number): TilePaletteAnimation {
        return this.Animations[paletteAnimationIndex];
    }
}

export class TilePaletteAnimation {
    public Manager: TilePaletteAnimationManager;
    public AnimatedPaletteData: PaletteItem;
    public CurrentFrame: number = 0;
    public Frames: TilePaletteAnimationFrame[];

    constructor(manager: TilePaletteAnimationManager, animatedPaletteData: PaletteItem) {
        this.Manager = manager;
        this.AnimatedPaletteData = animatedPaletteData;
        this.Frames = [];
    }

    public GetCurrentFrame(): TilePaletteAnimationFrame {
        return this.Frames[this.CurrentFrame];
    }

    public Tick(): void {
        let pal = this.AnimatedPaletteData;
        if (pal.skipIndex == 0)
            return
        if (pal.totalLength == 0)
            return
        for (let j: number = 0; j <= pal.totalLength; j += pal.skipIndex) {
            if (this.Manager.SonicManager.drawTickCount % (pal.totalLength + pal.skipIndex) == j) {
                this.CurrentFrame = j / pal.skipIndex;
            }
        }
    }

    public Init(): void {
        let pal = this.AnimatedPaletteData;
        if (pal.skipIndex == 0)
            return
        if (pal.totalLength == 0)
            return
        for (let j: number = 0; j <= pal.totalLength; j += pal.skipIndex) {
            let frameIndex: number = j / pal.skipIndex;
            if (this.Frames[frameIndex] == null) {
                this.Frames[frameIndex] = new TilePaletteAnimationFrame(frameIndex, this);
            }
        }
    }
}

export class TilePaletteAnimationFrame {
    public Animation: TilePaletteAnimation;
    public FrameIndex: number = 0;

    constructor(frameIndex: number, animation: TilePaletteAnimation) {
        this.Animation = animation;
        this.FrameIndex = frameIndex;
    }

    public SetPalette(): void {
        let levelPalette = this.Animation.Manager.SonicManager.sonicLevel.palette;
        let pal = this.Animation.AnimatedPaletteData;
        for (let index: number = 0; index < pal.pieces.length; index++) {
            let palettePiece = pal.pieces[index];
            let colorIndex: number = this.FrameIndex + (pal.pieces.length * index);
            let replaceIndex: number = (palettePiece.paletteOffset) / 2 | 0;
            let color = pal.palette[colorIndex];
            if (color != null)
                levelPalette[palettePiece.paletteIndex][replaceIndex] = color;
            else levelPalette[palettePiece.paletteIndex][replaceIndex] = 0;
        }
    }

}