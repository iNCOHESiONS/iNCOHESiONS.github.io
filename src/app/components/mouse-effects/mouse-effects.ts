import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    PLATFORM_ID,
    viewChild,
} from "@angular/core";
import { Color, Point, random } from "../../utils";
import { Particle } from "./particle";

@Component({
    selector: "mouse-effects",
    templateUrl: "./mouse-effects.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "(window:mousemove)": "onMouseMove($event)",
        "(window:mouseover)": "onMouseOver($event.target)",
        "(window:resize)": "onWindowResize()",
    },
})
export class MouseEffects implements AfterViewInit, OnDestroy {
    protected readonly canvasRef =
        viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");
    protected canvas!: HTMLCanvasElement;

    private readonly platformId = inject(PLATFORM_ID);

    private particles: Particle[] = [];

    private mousePos = Point.zero;
    private particleColor?: Color = undefined;
    private frameCount = 0;

    private cleanup = () => {};
    private animationId = 0;

    async ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.canvas = this.canvasRef().nativeElement;
        this.updateCanvasSize();

        const context = this.canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get canvas rendering context");
        }

        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            if (this.particleColor && this.frameCount % 2 === 0) {
                const particle = new Particle(
                    new Point(this.mousePos.x, this.mousePos.y),
                );
                particle.color = this.particleColor
                    .adjustLightness(random(-0.1, 0.1))
                    .adjustChroma(random(-0.1, 0.1));
                this.particles.push(particle);
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

    onMouseMove(event: MouseEvent) {
        this.mousePos = new Point(event.clientX, event.clientY);
    }

    onMouseOver(target: EventTarget | null) {
        if (!target) return;

        const color =
            (target as Element).attributes.getNamedItem("mouse-effect-color")
                ?.value ??
            (window.getComputedStyle(target as Element).cursor === "pointer"
                ? getComputedStyle(document.documentElement)
                      .getPropertyValue("--text-color")
                      .trim()
                : undefined);

        this.particleColor = color ? Color.fromHex(color) : undefined;
    }

    onWindowResize() {
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
