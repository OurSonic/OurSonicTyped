export class Point {
    private _x: number;
    private _y: number;
    public get X(): number {
        return this._x | 0;
    }
    public set X(val: number) {
        this._x = val | 0;
    }

    public get Y(): number {
        return this._y | 0;
    }
    public set Y(val: number) {
        this._y = val | 0;
    }
    public static Create(pos: Point): Point {
        return new Point(pos.X, pos.Y);
    }

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
    public Offset(windowLocation: Point): Point {
        return new Point(this.X + windowLocation.X, this.Y + windowLocation.Y);
    }
    public NegatePoint(windowLocation: Point): Point {
        return new Point(this.X - windowLocation.X, this.Y - windowLocation.Y);
    }
    public Negate(x: number, y: number): Point {
        return new Point(this.X - (x | 0), this.Y - (y | 0));
    }
    public Set(x: number, y: number): void {
        this.X = x;
        this.Y = y;
    }
}

export class DoublePoint {
    public X: number;
    public Y: number;
    public static create(pos: DoublePoint): DoublePoint {
        return new DoublePoint(pos.X, pos.Y);
    }

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
    public Offset(windowLocation: DoublePoint): DoublePoint {
        return new DoublePoint(this.X + windowLocation.X, this.Y + windowLocation.Y);
    }
    public NegatePoint(windowLocation: DoublePoint): DoublePoint {
        return new DoublePoint(this.X - windowLocation.X, this.Y - windowLocation.Y);
    }
    public Negate(x: number, y: number): DoublePoint {
        return new DoublePoint(this.X - (x | 0), this.Y - (y | 0));
    }
    public et(x: number, y: number): void {
        this.X = x;
        this.Y = y;
    }
}


export class IntersectingRectangle {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }
    public Intersects(p: Point): boolean {
        return this.X < p.X && this.X + this.Width > p.X && this.Y < p.Y && this.Y + this.Height > p.Y;
    }
    public static IntersectsRect(r: Rectangle, p: Point): boolean {
        return r.X < p.X && r.X + r.Width > p.X && r.Y < p.Y && r.Y + r.Height > p.Y;
    }
    public static IntersectRect(r1: Rectangle, r2: Rectangle): boolean {
        return !(r2.X > r1.X + r1.Width || r2.X + 0 < r1.X || r2.Y > r1.Y + r1.Height || r2.Y + 0 < r1.Y);
    }
}

export class Rectangle extends Point {
    public Width: number;
    public Height: number;
    constructor(x: number=0, y: number=0, width: number=0, height: number=0) {
        super(x, y);
        this.Width = width;
        this.Height = height;
    }
}