export class SonicImage {
  Bytes: number[];
  Palette: number[][];
  Width: number;
  Height: number;
  constructor(bytes: number[], palette: number[][], width: number, height: number) {
    this.Bytes = bytes;
    this.Palette = palette;
    this.Width = width;
    this.Height = height;
  }
}
