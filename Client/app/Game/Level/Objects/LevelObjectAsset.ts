
import {LevelObjectAssetFrame} from "LevelObjectAssetFrame";

export class LevelObjectAsset {
    public Frames: LevelObjectAssetFrame[];
    public Name: string;
    constructor(name: string) {
        this.Frames = new Array<LevelObjectAssetFrame>();
        this.Name = name;
    }
}