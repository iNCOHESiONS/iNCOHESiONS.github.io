import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    PLATFORM_ID,
    ViewChild,
} from "@angular/core";
import { Point } from "../../utils";
import { Meteor } from "./meteor";
import { Star } from "./star";

@Component({
    selector: "animated-background",
    template: `
        <canvas
            class="fixed top-0 left-0 w-screen h-screen -z-10 brightness-150"
            style="filter: blur(2px)"
            #canvas
        ></canvas>
    `,
})
export class AnimatedBackgroundComponent implements AfterViewInit, OnDestroy {
    @ViewChild("canvas", { static: true })
    protected canvasRef!: ElementRef<HTMLCanvasElement>;

    private canvas!: HTMLCanvasElement;

    private readonly platformId = inject(PLATFORM_ID);

    private mousePos?: Point = undefined;
    private mousePressed = false;

    private animationId = 0;
    private cleanup = () => {};

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.canvas = this.canvasRef.nativeElement;
        this.updateCanvasSize();

        const context = this.canvas.getContext("2d", { alpha: true });

        if (!context) {
            throw new Error("Unable to get canvas rendering context");
        }

        const background = context.createLinearGradient(
            0,
            0,
            0,
            this.canvas.height,
        );

        background.addColorStop(0, "#00000f");
        background.addColorStop(1, "#0f0a1a");

        const stars = Array.from({ length: 500 }).map(() => new Star());

        const meteors: Meteor[] = [];

        let frameCount = 0;

        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            context.fillStyle = background;
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (frameCount % 300 === 0) {
                meteors.push(new Meteor());
            }

            for (const meteor of meteors.reverse()) {
                meteor.update();
                meteor.draw(context);

                if (this.mousePressed) {
                    meteor.acc = meteor.pos.dir(this.mousePos!).mul(0.05);
                } else {
                    meteor.vel = Point.down.add(Point.right).norm();
                }

                if (!meteor.isAlive()) {
                    meteors.splice(meteors.indexOf(meteor), 1);
                }
            }

            for (const star of stars.reverse()) {
                star.update();
                star.draw(context);

                if (!star.isAlive()) {
                    stars.splice(stars.indexOf(star), 1);
                }
            }

            frameCount++;
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

    @HostListener("window:mousedown")
    onMouseDown() {
        this.mousePressed = true;
    }

    @HostListener("window:mouseup")
    onMouseUp() {
        this.mousePressed = false;
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
