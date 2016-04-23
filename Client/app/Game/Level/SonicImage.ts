export class SonicImage {
    public Bytes: number[];
    public Palette: number[][];
    public Width: number;
    public Height: number;
    constructor(bytes: number[], palette: number[][], width: number, height: number) {
        this.Bytes = bytes;
        this.Palette = palette;
        this.Width = width;
        this.Height = height;
    }
}