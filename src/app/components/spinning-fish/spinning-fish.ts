import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnDestroy,
    PLATFORM_ID,
    signal,
    ViewChild,
} from "@angular/core";
import type * as THREE from "three";
import { lerp, Point } from "../../utils";

const defaultZoom = 5.25;

@Component({
    selector: "spinning-fish",
    template: `
        <div
            title="Model and texture by umar6419 at https://free3d.com/3d-model/tuna-fish-21843.html"
            [class]="controlling() ? 'cursor-grabbing' : 'cursor-grab'"
            #container
        ></div>
    `,
})
export class SpinningFish implements AfterViewInit, OnDestroy {
    @ViewChild("container", { static: true })
    containerRef!: ElementRef<HTMLDivElement>;

    @Input() width = 400;
    @Input() height = 200;

    private platformId = inject(PLATFORM_ID);

    private cleanup = () => {};
    private animationId = 0;

    private mouseVel = Point.zero;
    protected controlling = signal(false);

    private targetZoom = defaultZoom;

    async ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        const THREE = await import("three");

        const WebGL = (await import("three/addons/capabilities/WebGL.js"))
            .default;

        if (!WebGL.isWebGL2Available()) {
            throw new Error("WebGL 2 not available");
        }

        const { GLTFLoader } =
            await import("three/examples/jsm/loaders/GLTFLoader.js");

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            30,
        );
        camera.position.z = 3;
        camera.zoom = this.targetZoom;
        camera.updateProjectionMatrix();

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            failIfMajorPerformanceCaveat: true,
        });

        if (!renderer.getContext()) {
            throw new Error("Unable to get canvas rendering context");
        }

        const canvas = renderer.domElement;

        canvas.onmousedown = () => this.controlling.update(() => true);

        this.containerRef.nativeElement.appendChild(canvas);

        renderer.setClearColor(0, 0);
        renderer.setSize(this.width, this.height, true);

        const fish = await new Promise<THREE.Group>((resolve, reject) =>
            new GLTFLoader().load(
                "./3d/fish.glb",
                (object: any) => resolve(object.scene.children[0]),
                undefined,
                reject,
            ),
        );

        scene.add(fish);

        const sun = new THREE.DirectionalLight(0xffffff);
        sun.position.z = 3;
        scene.add(sun);

        const extraLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        scene.add(extraLight);

        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            if (this.controlling()) {
                fish.rotation.x += this.mouseVel.y / 200;
                fish.rotation.z -= this.mouseVel.x / 200;
                this.targetZoom = 3;
            } else {
                fish.rotation.z += 0.01;
                this.targetZoom = defaultZoom;
            }

            this.mouseVel = this.mouseVel.mul(0);
            renderer.render(scene, camera);

            const nextZoom = lerp(camera.zoom, this.targetZoom, 0.1);

            if (camera.zoom !== nextZoom) {
                camera.zoom = nextZoom;
                camera.updateProjectionMatrix();
            }
        };

        animate();

        this.cleanup = () => {
            cancelAnimationFrame(this.animationId);

            this.unload(fish);

            extraLight.dispose();
            sun.dispose();
            renderer.dispose();
        };
    }

    ngOnDestroy() {
        this.cleanup();
    }

    @HostListener("window:mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
        this.mouseVel = new Point(event.movementX, event.movementY);
    }

    @HostListener("window:mouseup")
    onMouseUp() {
        this.controlling.update(() => false);
    }

    /* from: https://discourse.threejs.org/t/disposing-loaded-model/53735 */
    unload(target: THREE.Object3D) {
        target.removeFromParent();
        target.traverse((child: any) => {
            if (child.material && !child.material._isDisposed) {
                for (const [key, value] of Object.entries(
                    child.material,
                ) as any[]) {
                    if (!value) continue;
                    if (
                        typeof value.dispose === "function" &&
                        !value._isDisposed
                    ) {
                        value.dispose();
                        value._isDisposed = true;
                        child[key] = null;
                    }
                }
                child.material.dispose();
                child.material._isDisposed = true;
                child.material = null;
            }

            if (child.geometry?.dispose && !child.geometry._isDisposed) {
                child.geometry.dispose();
                child.geometry._isDisposed = true;
                child.geometry = null;
            }

            requestAnimationFrame(() => (child.children = null));
        });
    }
}
