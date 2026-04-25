import { Color, drawCircle, lerp, Point, randint, random } from "../../utils";

export class Meteor {
    private trail: Point[] = [];
    private trailLength = randint(15, 30);

    constructor(
        public pos = new Point(random(window.innerWidth), 0),
        public vel = Point.zero,
        public acc = Point.zero,
        public color = Color.fromHex("#0f0a1a")
            .adjustLightness(random(0.05, 0.15))
            .adjustChroma(random(-0.1, 0.1)),
        public size = randint(3, 7),
    ) {}

    update() {
        this.trail.unshift(this.pos);

        if (this.trail.length > this.trailLength) {
            this.trail.pop();
        }

        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
        this.acc = this.acc.mul(0);
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const [i, p] of this.trail.entries()) {
            const t = i / this.trail.length;
            drawCircle(
                ctx,
                p,
                lerp(this.size, this.size * 0.5, t),
                this.color.withA(lerp(1, 0.2, t)).toCSSColor(),
            );
        }

        drawCircle(ctx, this.pos, this.size, this.color.toCSSColor());
    }

    isAlive() {
        return this.trail[this.trail.length - 1].y < window.innerHeight;
    }
}
