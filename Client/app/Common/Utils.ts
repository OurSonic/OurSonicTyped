export class Point {
    private _x: number;
    private _y: number;
    public get x(): number {
        return this._x | 0;
    }
    public set x(val: number) {
        this._x = val | 0;
    }

    public get y(): number {
        return this._y | 0;
    }
    public set y(val: number) {
        this._y = val | 0;
    }
    public static create(pos: Point): Point {
        return new Point(pos.x, pos.y);
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public offset(windowLocation: Point): Point {
        return new Point(this.x + windowLocation.x, this.y + windowLocation.y);
    }
    public negatePoint(windowLocation: Point): Point {
        return new Point(this.x - windowLocation.x, this.y - windowLocation.y);
    }
    public negate(x: number, y: number): Point {
        return new Point(this.x - (x | 0), this.y - (y | 0));
    }
    public set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}

export class DoublePoint {
    public x: number;
    public y: number;
    public static create(pos: DoublePoint): DoublePoint {
        return new DoublePoint(pos.x, pos.y);
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public offset(windowLocation: DoublePoint): DoublePoint {
        return new DoublePoint(this.x + windowLocation.x, this.y + windowLocation.y);
    }
    public negatePoint(windowLocation: DoublePoint): DoublePoint {
        return new DoublePoint(this.x - windowLocation.x, this.y - windowLocation.y);
    }
    public negate(x: number, y: number): DoublePoint {
        return new DoublePoint(this.x - (x | 0), this.y - (y | 0));
    }
    public set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}


export class IntersectingRectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    public intersects(p: Point): boolean {
        return this.x < p.x && this.x + this.width > p.x && this.y < p.y && this.y + this.height > p.y;
    }
    public static intersectsRect(r: Rectangle, p: Point): boolean {
        return r.x < p.x && r.x + r.width > p.x && r.y < p.y && r.y + r.height > p.y;
    }
    public static intersectRect(r1: Rectangle, r2: Rectangle): boolean {
        return !(r2.x > r1.x + r1.width || r2.x + 0 < r1.x || r2.y > r1.y + r1.height || r2.y + 0 < r1.y);
    }
}

export class Rectangle extends Point {
    public width: number;
    public height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}