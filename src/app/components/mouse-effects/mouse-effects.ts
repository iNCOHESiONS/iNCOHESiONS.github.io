import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnDestroy,
    PLATFORM_ID,
    ViewChild,
} from "@angular/core";

class Point {
    constructor(
        public x: number,
        public y: number,
    ) {}

    static fromSingle(scalar: number) {
        return new Point(scalar, scalar);
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    mul(scalar: number) {
        return new Point(this.x * scalar, this.y * scalar);
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }
}

const gravity = new Point(0, 0.1);
const initialLifetime = 100;

class Particle {
    constructor(
        public pos: Point,
        public vel: Point = new Point(0, 0),
        public acc: Point = new Point(
            (Math.random() * 2 - 1) * 1.5,
            (Math.random() * 2 - 1) * 2,
        ),
        private lifetime = initialLifetime,
        private size = Point.fromSingle(Math.random() * 5 + 5),
        private color = [255, Math.random() * 128, Math.random() * 255],
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

        ctx.fillStyle = `rgb(${this.color.join(",")}, ${this.lifetime / initialLifetime})`;
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

@Component({
    selector: "mouse-effects",
    template: `
        <canvas
            class="fixed top-0 bottom-0 h-full pointer-events-none z-10"
            #canvas
        ></canvas>
    `,
})
export class MouseEffects implements AfterViewInit, OnDestroy {
    @ViewChild("canvas", { static: true })
    canvasRef!: ElementRef<HTMLCanvasElement>;

    canvas!: HTMLCanvasElement;

    private particles: Particle[] = [];

    private cleanup = () => {};
    private animationId = 0;
    private frameCount = 0;

    private mousePos = new Point(0, 0);
    private shouldRender = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    async ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.canvas = this.canvasRef.nativeElement;
        this.updateCanvasSize();

        const context = this.canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get canvas rendering context");
        }

        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            if (this.shouldRender && this.frameCount % 2 === 0) {
                this.particles.push(
                    new Particle(new Point(this.mousePos.x, this.mousePos.y)),
                );
            }

            if (this.particles.length === 0) return;

            context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const particle of this.particles.reverse()) {
                particle.update();
                particle.draw(context);

                if (!particle.isAlive()) {
                    this.particles.splice(this.particles.indexOf(particle), 1);
                }
            }

            this.frameCount++;
        };

        animate();

        this.cleanup = () => cancelAnimationFrame(this.animationId);
    }

    ngOnDestroy() {
        this.cleanup();
    }

    @HostListener("window:mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
        this.mousePos = new Point(event.clientX, event.clientY);
    }

    @HostListener("window:mouseover", ["$event"])
    onMouseOver(event: MouseEvent) {
        if (!event.target) return;

        this.shouldRender =
            window.getComputedStyle(event.target as Element).cursor ===
            "pointer";
    }

    @HostListener("window:resize")
    onWindowResize() {
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
