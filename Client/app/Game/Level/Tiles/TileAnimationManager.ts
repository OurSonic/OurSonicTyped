import {SonicManager} from "../../SonicManager";
import {TileAnimationData, TileAnimationDataFrame} from "../animations/TileAnimationData";

export class TileAnimationManager {
    public animations: { [key: number]: TileAnimation };

    constructor(private sonicManager: SonicManager) {
        this.init();
    }

    private init(): void {
        this.animations = {};
        for (let animatedTileIndex: number = 0; animatedTileIndex < this.sonicManager.sonicLevel.tileAnimations.length; animatedTileIndex++) {
            this.animations[animatedTileIndex] = new TileAnimation(this, this.sonicManager.sonicLevel.tileAnimations[animatedTileIndex]);
            this.animations[animatedTileIndex].init();
        }
    }

    public tickAnimatedTiles(): void {
        if (this.animations == null)
            this.init();
        for (let animation in this.animations) {
            if (this.animations.hasOwnProperty(animation)) {
                let tilePaletteAnimation = this.animations[animation];
                tilePaletteAnimation.tick();
            }
        }
    }

    public clearCache(): void {
        this.animations = null;
    }

    public getCurrentFrame(tileAnimationIndex: number): TileAnimationFrame {
        return this.animations && this.animations[tileAnimationIndex] && this.animations[tileAnimationIndex].getCurrentFrame();
    }
}

export class TileAnimation {
    public manager: TileAnimationManager;
    public animatedTileData: TileAnimationData;
    public currentFrame: number = 0;
    public frames: TileAnimationFrame[];

    constructor(manager: TileAnimationManager, animatedTileData: TileAnimationData) {
        this.manager = manager;
        this.animatedTileData = animatedTileData;
        this.frames = [];
        this.currentFrame = 0;
    }

    public getCurrentFrame(): TileAnimationFrame {
        return this.frames[this.currentFrame];
    }

    public tick(): void {
        let anni = this.animatedTileData;
        if (anni.lastAnimatedFrame == null) {
            anni.lastAnimatedFrame = 0;
            anni.lastAnimatedIndex = 0;
        }
        if (anni.dataFrames[anni.lastAnimatedIndex].ticks == 0 || (SonicManager.instance.drawTickCount - anni.lastAnimatedFrame) >= anni.dataFrames[anni.lastAnimatedIndex].ticks) {
            anni.lastAnimatedFrame = SonicManager.instance.drawTickCount;
            anni.lastAnimatedIndex = (anni.lastAnimatedIndex + 1) % anni.dataFrames.length;
            this.currentFrame = anni.lastAnimatedIndex;
        }
    }

    public init(): void {
        for (let index: number = 0; index < this.animatedTileData.dataFrames.length; index++) {
            this.frames[index] = new TileAnimationFrame(index, this);
        }
    }
}

export class TileAnimationFrame {
    public animation: TileAnimation;
    public frameIndex: number = 0;

    constructor(frameIndex: number, animation: TileAnimation) {
        this.animation = animation;
        this.frameIndex = frameIndex;
    }

    public frameData(): TileAnimationDataFrame {
        return this.animation.animatedTileData.dataFrames[this.frameIndex];
    }
}