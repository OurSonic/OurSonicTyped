/*[Serializable]*/
export class Color {
  R: number;
  G: number;
  B: number;
  A: number;
  constructor(r: number, g: number, b: number, a: number = 1) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;
  }
}
