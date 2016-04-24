﻿import {SonicManager} from "../../SonicManager";
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
        for (let animatedTileIndex: number = 0; animatedTileIndex < this.SonicManager.sonicLevel.TileAnimations.length; animatedTileIndex++) {
            this.Animations[animatedTileIndex] = new TileAnimation(this, this.SonicManager.sonicLevel.TileAnimations[animatedTileIndex]);
            this.Animations[animatedTileIndex].init();
        }
    }
    public TickAnimatedTiles(): void {
        if (this.Animations == null)
            this.Init();
        for (let animation in this.Animations) {
            if (this.Animations.hasOwnProperty(animation)) {
                let tilePaletteAnimation = this.Animations[animation];
                tilePaletteAnimation.tick();
            }
        }
    }
    public ClearCache(): void {
        this.Animations = null;
    }
    public getCurrentFrame(tileAnimationIndex: number): TileAnimationFrame {
        return this.Animations[tileAnimationIndex].getCurrentFrame();
    }
}
export class TileAnimation {
    public manager: TileAnimationManager;
    public animatedTileData: TileAnimationData;
    public currentFrame: number=0;
    public frames: TileAnimationFrame[];
    constructor(manager: TileAnimationManager, animatedTileData: TileAnimationData) {
        this.manager = manager;
        this.animatedTileData = animatedTileData;
        this.frames = new Array<TileAnimationFrame>();
        this.currentFrame = 0;
    }
    public getCurrentFrame(): TileAnimationFrame {
        return this.frames[this.currentFrame];
    }
    public tick(): void {
        let anni = this.animatedTileData;
        if (anni.LastAnimatedFrame == null) {
            anni.LastAnimatedFrame = 0;
            anni.LastAnimatedIndex = 0;
        }
        if (anni.DataFrames[anni.LastAnimatedIndex].Ticks == 0 || (SonicManager.instance.drawTickCount - anni.LastAnimatedFrame) >= ((anni.AutomatedTiming > 0) ? anni.AutomatedTiming : anni.DataFrames[anni.LastAnimatedIndex].Ticks)) {
            anni.LastAnimatedFrame = SonicManager.instance.drawTickCount;
            anni.LastAnimatedIndex = (anni.LastAnimatedIndex + 1) % anni.DataFrames.length;
            this.currentFrame = anni.LastAnimatedIndex;
        }
    }
    public init(): void {
        for (let index: number = 0; index < this.animatedTileData.DataFrames.length; index++) {
            this.frames[index] = new TileAnimationFrame(index, this);
        }
    }
}
export class TileAnimationFrame {
    public animation: TileAnimation;
    public frameIndex: number=0;
    constructor(frameIndex: number, animation: TileAnimation) {
        this.animation = animation;
        this.frameIndex = frameIndex;
    }
    public frameData(): TileAnimationDataFrame {
        return this.animation.animatedTileData.DataFrames[this.frameIndex];
    }
}