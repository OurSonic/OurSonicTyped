
import {LevelObjectAssetFrame} from "LevelObjectAssetFrame";

export class LevelObjectAsset {
    public frames: LevelObjectAssetFrame[];
    public name: string;
    constructor(name: string) {
        this.frames = [];
        this.name = name;
    }
}