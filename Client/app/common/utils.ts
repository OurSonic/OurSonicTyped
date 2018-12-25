export class Point {
  private _x: number;
  private _y: number;
  get x(): number {
    return this._x | 0;
  }
  set x(val: number) {
    this._x = val | 0;
  }

  get y(): number {
    return this._y | 0;
  }
  set y(val: number) {
    this._y = val | 0;
  }
  static create(pos: Point): Point {
    return new Point(pos.x, pos.y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  offset(windowLocation: Point): Point {
    return new Point(this.x + windowLocation.x, this.y + windowLocation.y);
  }
  negatePoint(windowLocation: Point): Point {
    return new Point(this.x - windowLocation.x, this.y - windowLocation.y);
  }
  negate(x: number, y: number): Point {
    return new Point(this.x - (x | 0), this.y - (y | 0));
  }
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class IntersectingRectangle extends Point {
  width: number;
  height: number;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
  intersects(x: number, y: number): boolean {
    return this.x < x && this.x + this.width > x && this.y < y && this.y + this.height > y;
  }
  static intersectsRect(r: Rectangle, p: Point): boolean {
    return r.x < p.x && r.x + r.width > p.x && r.y < p.y && r.y + r.height > p.y;
  }
  static intersectRect(r1: Rectangle, r2: Rectangle): boolean {
    return !(r2.x > r1.x + r1.width || r2.x + 0 < r1.x || r2.y > r1.y + r1.height || r2.y + 0 < r1.y);
  }
}

export class Rectangle extends Point {
  width: number;
  height: number;
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
