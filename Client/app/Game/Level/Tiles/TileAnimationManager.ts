import {SonicManager} from "../../SonicManager";
import {TileAnimationData,  TileAnimationDataFrame } from "../Animations/TileAnimationData";

export class TileAnimationManager {
    public SonicManager: SonicManager;
    public Animations: { [key: number]: TileAnimation };
    constructor(sonicManager: SonicManager) {
        this.SonicManager = sonicManager;
        this.Init();
    }
    private Init(): void {
        this.Animations = {};
        for (var animatedTileIndex: number = 0; animatedTileIndex < this.SonicManager.SonicLevel.TileAnimations.length; animatedTileIndex++) {
            this.Animations[animatedTileIndex] = new TileAnimation(this, this.SonicManager.SonicLevel.TileAnimations[animatedTileIndex]);
            this.Animations[animatedTileIndex].Init();
        }
    }
    public TickAnimatedTiles(): void {
        if (this.Animations == null)
            this.Init();
        for (var animation in this.Animations) {
            if (this.Animations.hasOwnProperty(animation)) {
                var tilePaletteAnimation = this.Animations[animation];
                tilePaletteAnimation.Tick();
            }
        }
    }
    public ClearCache(): void {
        this.Animations = null;
    }
    public GetCurrentFrame(tileAnimationIndex: number): TileAnimationFrame {
        return this.Animations[tileAnimationIndex].GetCurrentFrame();
    }
}
export class TileAnimation {
    /*[IntrinsicProperty]*/
    public Manager: TileAnimationManager;
    /*[IntrinsicProperty]*/
    public AnimatedTileData: TileAnimationData;
    /*[IntrinsicProperty]*/
    public CurrentFrame: number;
    /*[IntrinsicProperty]*/
    public Frames: TileAnimationFrame[];
    constructor(manager: TileAnimationManager, animatedTileData: TileAnimationData) {
        this.Manager = manager;
        this.AnimatedTileData = animatedTileData;
        this.Frames = new Array<TileAnimationFrame>();
        this.CurrentFrame = 0;
    }
    public GetCurrentFrame(): TileAnimationFrame {
        return this.Frames[this.CurrentFrame];
    }
    public Tick(): void {
        var anni = this.AnimatedTileData;
        if (anni.LastAnimatedFrame == null) {
            anni.LastAnimatedFrame = 0;
            anni.LastAnimatedIndex = 0;
        }
        if (anni.DataFrames[anni.LastAnimatedIndex].Ticks == 0 || (SonicManager.Instance.DrawTickCount - anni.LastAnimatedFrame) >= ((anni.AutomatedTiming > 0) ? anni.AutomatedTiming : anni.DataFrames[anni.LastAnimatedIndex].Ticks)) {
            anni.LastAnimatedFrame = SonicManager.Instance.DrawTickCount;
            anni.LastAnimatedIndex = (anni.LastAnimatedIndex + 1) % anni.DataFrames.length;
            this.CurrentFrame = anni.LastAnimatedIndex;
        }
    }
    public Init(): void {
        for (var index: number = 0; index < this.AnimatedTileData.DataFrames.length; index++) {
            this.Frames[index] = new TileAnimationFrame(index, this);
        }
    }
}
export class TileAnimationFrame {
    public Animation: TileAnimation;
    /*[IntrinsicProperty]*/
    public FrameIndex: number;
    constructor(frameIndex: number, animation: TileAnimation) {
        this.Animation = animation;
        this.FrameIndex = frameIndex;
    }
    public FrameData(): TileAnimationDataFrame {
        return this.Animation.AnimatedTileData.DataFrames[this.FrameIndex];
    }
}