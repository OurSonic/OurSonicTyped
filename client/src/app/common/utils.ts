import {Readable} from 'stream';

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

export class Utils {
  static *batchArray<T>(items: T[], count: number) {
    const inner: T[] = [];
    for (const item of items) {
      inner.push(item);
      if (inner.length === count) {
        yield inner;
        inner.length = 0;
      }
    }
    if (inner.length > 0) {
      yield inner;
    }
  }
  static groupBy<T, TKey>(items: T[], predicate: (pred: T) => TKey): {key: TKey; items: T[]}[] {
    const groups: {key: TKey; items: T[]}[] = [];
    for (const item of items) {
      const key = predicate(item);
      let group = groups.find((a) => a.key === key);
      if (!group) {
        groups.push((group = {key, items: []}));
      }
      group.items.push(item);
    }
    return groups;
  }
  static range(length: number) {
    const items = [];
    for (let i = 0; i < length; i++) {
      items.push(i);
    }
    return items;
  }

  static toDictionary<T, TKey extends string | number, TValue>(
    items: T[],
    predicate: (pred: T, index: number) => TKey,
    value: (pred: T) => TValue,
    overwrite = true
  ): {[key in TKey]: TValue} {
    const dict: {[key in TKey]: TValue} = {} as any;
    let index = 0;
    for (const item of items) {
      const key = predicate(item, index++);
      if (!overwrite) {
        if (dict[key]) continue;
      }
      dict[key] = value(item);
    }
    return dict;
  }

  static toDictionaryArray<T, TKey extends string>(items: T[], predicate: (pred: T) => TKey): {[key in TKey]?: T[]} {
    const dict: {[key in TKey]?: T[]} = {};
    for (const item of items) {
      const key = predicate(item);
      if (!dict[key]) {
        dict[key] = [];
      }
      dict[key].push(item);
    }
    return dict;
  }

  static fromDictionary<T, TKey extends string>(dict: {[key in TKey]?: T}): T[] {
    const items: T[] = [];

    for (const key in dict) {
      if (dict.hasOwnProperty(key)) {
        items.push(dict[key]!);
      }
    }
    return items;
  }

  static timeoutPromise<T>(
    promise: Promise<T>,
    timeout: number,
    defaultValue: T,
    failCallback: () => Promise<any>
  ): Promise<T> {
    return new Promise<T>((res) => {
      let resolved = false;
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          failCallback().then(() => res(defaultValue));
        }
      }, timeout);

      promise.then((items) => {
        if (!resolved) {
          resolved = true;
          res(items);
        }
      });
    });
  }

  static isValidDate(d: any) {
    return d instanceof Date && !isNaN(d as any);
  }

  static sum<T>(items: T[], callback: (t: T) => number): number {
    let total = 0;
    for (const item of items) {
      total += callback(item);
    }
    return total;
  }
  static average<T>(items: T[], callback: (t: T) => number): number {
    let total = 0;
    for (const item of items) {
      total += callback(item);
    }
    return items.length === 0 ? 0 : total / items.length;
  }

  static timeout(timeout: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, timeout);
    });
  }

  static randomItem<T>(item: T[]): T {
    return item[Math.floor(Math.random() * item.length)];
  }

  static randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static unique<T>(strings: T[]): T[] {
    return strings.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
  static uniqueLookup<T>(items: T[], lookup: (v: T, t: T) => boolean): T[] {
    return items.filter((value, index, self) => {
      return self.findIndex((v) => lookup(v, value)) === index;
    });
  }
  static flatten<T>(map: T[][]): T[] {
    const result: T[] = [];
    for (const mapElement of map) {
      result.push(...mapElement);
    }
    return result;
  }

  static safeKeys<T>(model: T): (keyof T)[] {
    return Object.keys(model) as (keyof T)[];
  }
}
