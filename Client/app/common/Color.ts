/*[Serializable]*/
export class Color {
    public R: number;
    public G: number;
    public B: number;
    public A: number;
    constructor(r: number, g: number, b: number, a: number=1) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    } 
}