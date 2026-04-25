import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    PLATFORM_ID,
    ViewChild,
} from "@angular/core";
import { Point } from "../../utils";
import { Particle } from "./particle";

@Component({
    selector: "mouse-effects",
    template: `
        <canvas
            class="fixed top-0 bottom-0 h-full pointer-events-none z-10"
            #canvas
        ></canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MouseEffects implements AfterViewInit, OnDestroy {
    @ViewChild("canvas", { static: true })
    protected canvasRef!: ElementRef<HTMLCanvasElement>;

    protected canvas!: HTMLCanvasElement;

    private platformId = inject(PLATFORM_ID);

    private particles: Particle[] = [];

    private mousePos = Point.zero;
    private shouldRender = false;
    private frameCount = 0;

    private cleanup = () => {};
    private animationId = 0;

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

    @HostListener("window:mouseover", ["$event.target"])
    onMouseOver(target: EventTarget | null) {
        if (!target) return;

        this.shouldRender =
            window.getComputedStyle(target as Element).cursor === "pointer";
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
