export class Point {
    constructor(
        public readonly x: number = 0,
        public readonly y: number = 0,
    ) {}

    static get zero() {
        return Point.splat(0);
    }

    static get one() {
        return Point.splat(1);
    }

    static get up() {
        return new Point(0, -1);
    }

    static get down() {
        return new Point(0, 1);
    }

    static get left() {
        return new Point(-1, 0);
    }

    static get right() {
        return new Point(1, 0);
    }

    static splat(scalar: number) {
        return new Point(scalar, scalar);
    }

    static random() {
        return new Point(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    sub(other: Point) {
        return this.add(other.neg());
    }

    mul(scalar: number) {
        return new Point(this.x * scalar, this.y * scalar);
    }

    div(scalar: number) {
        return new Point(this.x / scalar, this.y / scalar);
    }

    scale(other: Point) {
        return new Point(this.x * other.x, this.y * other.y);
    }

    dot(other: Point) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other: Point) {
        return this.x * other.y - this.y * other.x;
    }

    neg() {
        return new Point(-this.x, -this.y);
    }

    dir(other: Point) {
        return other.sub(this).norm();
    }

    dist(other: Point) {
        return this.sub(other).mag();
    }

    sqDist(other: Point) {
        return this.sub(other).sqMag();
    }

    mag() {
        return Math.sqrt(this.sqMag());
    }

    withMag(mag: number) {
        return this.norm().mul(mag);
    }

    sqMag() {
        return this.x * this.x + this.y * this.y;
    }

    length = this.mag; // alias
    sqLength = this.sqMag; // alias

    norm() {
        return this.div(this.mag());
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    angle = this.heading; // alias

    lerp(other: Point, t: number) {
        return new Point(lerp(this.x, other.x, t), lerp(this.y, other.y, t));
    }

    copy() {
        return new Point(this.x, this.y);
    }
}

export function lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t;
}

export function isMobile() {
    return /Android|webOS|iPhone|iP[ao]d|BlackBerry|IEMobile|Opera Mini|Mobile|CriOS/i.test(
        navigator.userAgent,
    );
}

export function choice<T>(choices: T[]) {
    return choices[Math.floor(Math.random() * choices.length)];
}
