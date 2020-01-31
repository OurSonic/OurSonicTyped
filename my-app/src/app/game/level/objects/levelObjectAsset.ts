import {LevelObjectAssetFrame} from './levelObjectAssetFrame';

export class LevelObjectAsset {
  frames: LevelObjectAssetFrame[];
  name: string;
  constructor(name: string) {
    this.frames = new Array<LevelObjectAssetFrame>();
    this.name = name;
  }
}
