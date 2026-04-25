import { Color, Point } from "../../utils";

const gravity = Point.down.mul(0.1);
const minSize = Point.splat(5);
const initialLifetime = 100;

export class Particle {
    private lifetime = initialLifetime;

    constructor(
        public pos: Point,
        public vel: Point = Point.zero,
        public acc: Point = Point.random().scale(new Point(1.5, -2.5)),
        public color = Color.white,
        public size = minSize.add(Point.random().mul(5)),
    ) {}

    update() {
        this.acc = this.acc.add(gravity);
        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
        this.acc = this.acc.mul(0);
        this.lifetime--;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.translate(
            this.pos.x + this.size.x / 2,
            this.pos.y + this.size.y / 2,
        );

        ctx.rotate(this.vel.heading());

        ctx.fillStyle = this.color
            .withA(this.lifetime / initialLifetime)
            .toCSSColor();

        ctx.fillRect(
            -this.size.x / 2,
            -this.size.y / 2,
            this.size.x,
            this.size.y,
        );

        ctx.restore();
    }

    isAlive() {
        return this.lifetime > 0;
    }
}
