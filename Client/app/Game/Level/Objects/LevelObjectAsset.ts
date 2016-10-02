
import {LevelObjectAssetFrame} from "./LevelObjectAssetFrame";

export class LevelObjectAsset {
    public frames: LevelObjectAssetFrame[];
    public name: string;
    constructor(name: string) {
        this.frames = new Array<LevelObjectAssetFrame>();
        this.name = name;
    }
}