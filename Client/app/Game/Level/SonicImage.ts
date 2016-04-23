export class SonicImage {
    public bytes: number[];
    public palette: number[][];
    public width: number;
    public height: number;
    constructor(bytes: number[], palette: number[][], width: number, height: number) {
        this.bytes = bytes;
        this.palette = palette;
        this.width = width;
        this.height = height;
    }
}