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
        return new Point(random(-1, 1), random(-1, 1));
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    sub(other: Point) {
        return new Point(this.x - other.x, this.y - other.y);
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

    withX(x: number) {
        return new Point(x, this.y);
    }

    withY(y: number) {
        return new Point(this.x, y);
    }
}

export class Color {
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
        public readonly a: number = 1,
    ) {}

    static get white() {
        return new Color(255, 255, 255);
    }

    static get black() {
        return new Color(0, 0, 0);
    }

    static get transparent() {
        return new Color(0, 0, 0, 0);
    }

    static random(withAlpha: boolean = false) {
        return new Color(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255,
            withAlpha ? Math.random() : 1,
        );
    }

    static fromHex(hex: string) {
        const [r, g, b, a] = hex
            .replace("#", "")
            .match(/.{2}/g)
            ?.map((x) => parseInt(x, 16)) ?? [255, 255, 255, 1];

        return new Color(r, g, b, a);
    }

    lighten(amount: number) {
        return this.adjustLightness(amount);
    }

    darken(amount: number) {
        return this.adjustLightness(-amount);
    }

    saturate(amount: number): Color {
        return this.adjustChroma(amount);
    }

    desaturate(amount: number): Color {
        return this.adjustChroma(-amount);
    }

    adjustLightness(delta: number) {
        const [l, a, b] = this.toOKLab();
        return this.fromOKLab(clamp01(l + delta), a, b, this.a);
    }

    adjustChroma(delta: number) {
        let [L, C, h] = this.toOKLCH();
        return this.fromOKLCH(L, Math.max(0, C + delta), h, this.a);
    }

    withR(r: number) {
        return new Color(r, this.g, this.b, this.a);
    }

    withG(g: number) {
        return new Color(this.r, g, this.b, this.a);
    }

    withB(b: number) {
        return new Color(this.r, this.g, b, this.a);
    }

    withA(a: number) {
        return new Color(this.r, this.g, this.b, a);
    }

    toCSSColor() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    /* Based on https://gist.github.com/earthbound19/e7fe15fdf8ca3ef814750a61bc75b5ce and https://github.com/alltom/oklab/blob/main/oklab.go */
    private toOKLab() {
        const r = this.gammaToLinear(this.r / 255);
        const g = this.gammaToLinear(this.g / 255);
        const b = this.gammaToLinear(this.b / 255);

        const l = Math.cbrt(
            0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
        );
        const m = Math.cbrt(
            0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
        );
        const s = Math.cbrt(
            0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
        );

        return [
            0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
        ];
    }

    private toOKLCH() {
        const [L, a, b] = this.toOKLab();
        const C = Math.sqrt(a * a + b * b);
        const h = Math.atan2(b, a);
        return [L, C, h];
    }

    /* Based on https://gist.github.com/earthbound19/e7fe15fdf8ca3ef814750a61bc75b5ce */
    private fromOKLab(L: number, a: number, b: number, alpha = 1) {
        const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
        const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
        const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

        const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const bVal = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

        return new Color(
            Math.round(this.linearToGamma(r) * 255),
            Math.round(this.linearToGamma(g) * 255),
            Math.round(this.linearToGamma(bVal) * 255),
            alpha,
        );
    }

    fromOKLCH(L: number, C: number, h: number, alpha = 1): Color {
        const a = C * Math.cos(h);
        const b = C * Math.sin(h);
        return this.fromOKLab(L, a, b, alpha);
    }

    private gammaToLinear(c: number) {
        return c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
    }

    private linearToGamma(c: number) {
        return c >= 0.0031308
            ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055
            : 12.92 * c;
    }
}

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    pos: Point,
    size: number,
    color: string,
) {
    ctx.beginPath();

    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();

    ctx.closePath();
}

export function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
}

export function clamp01(v: number) {
    return clamp(v, 0, 1);
}

export const saturate = clamp01;

export function lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t;
}

export function random(min: number, max: number | undefined = undefined) {
    if (max === undefined) {
        max = min;
        min = 0;
    }

    return Math.random() * (max - min) + min;
}

export function randint(min: number, max: number | undefined = undefined) {
    return Math.round(random(min, max));
}

export function isMobile() {
    return /Android|webOS|iPhone|iP[ao]d|BlackBerry|IEMobile|Opera Mini|Mobile|CriOS/i.test(
        navigator.userAgent,
    );
}

export function choice<T>(choices: T[]) {
    return choices[Math.floor(Math.random() * choices.length)];
}
