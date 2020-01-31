export class LevelObjectProjectile {
  x: number;
  y: number;
  xsp: number;
  ysp: number;
  xflip: boolean;
  yflip: boolean;
  assetIndex: number;
  frameIndex: number;
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
