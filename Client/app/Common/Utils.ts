export class Point {
    public x: number;
    public y: number;
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
        return new Point(x - x, y - y);
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
 
    constructor(x: number=0, y: number=0, width: number=0, height: number=0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}