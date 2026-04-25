import { Color, drawCircle, lerp, Point, randint, random } from "../../utils";

const supernovaLayerCount = 4;
const supernovaMaxRadius = 12;
const supernovaSpeed = 4.5;

export class Star {
    private lifetime = randint(10000, 300000);

    private get supernova() {
        return this.lifetime < 1000;
    }

    constructor(
        public pos = new Point(
            random(window.innerWidth),
            random(window.innerHeight),
        ),
        public color = Color.random(true),
    ) {}

    update() {
        this.lifetime--;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color.toCSSColor();

        if (this.supernova) {
            const novaT = (1 - this.lifetime / 1000) * supernovaSpeed;

            const phase =
                novaT < 0.4
                    ? lerp(0, 1, novaT / 0.4)
                    : novaT < 0.7
                      ? 1
                      : lerp(1, 0, (novaT - 0.7) / 0.3);

            const radius = phase * supernovaMaxRadius;

            for (let i = 0; i < supernovaLayerCount; i++) {
                const t = i / supernovaLayerCount;
                drawCircle(
                    ctx,
                    this.pos,
                    Math.max(0, lerp(0, radius, t)),
                    this.color.lighten(t).toCSSColor(),
                );
            }
        } else {
            ctx.fillRect(this.pos.x - 1, this.pos.y - 1, 2, 2);
        }
    }

    isAlive() {
        return this.lifetime > 0;
    }
}
