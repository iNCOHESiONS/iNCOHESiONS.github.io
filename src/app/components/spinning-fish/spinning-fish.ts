import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    PLATFORM_ID,
    signal,
    viewChild,
} from "@angular/core";
import type * as THREE from "three";
import { lerp, Point } from "../../utils";

const width = 400;
const height = 200;
const defaultZoom = 5.25;

@Component({
    selector: "spinning-fish",
    templateUrl: "./spinning-fish.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "(window:mousemove)": "onMouseMove($event)",
        "(window:mouseup)": "onMouseUp()",
    },
})
export class SpinningFish implements AfterViewInit, OnDestroy {
    protected readonly containerRef =
        viewChild.required<ElementRef<HTMLDivElement>>("container");

    protected readonly controlling = signal(false);

    private platformId = inject(PLATFORM_ID);

    private mouseVel = Point.zero;
    private targetZoom = defaultZoom;

    private cleanup = () => {};
    private animationId = 0;

    async ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        const WebGL = (await import("three/addons/capabilities/WebGL.js"))
            .default;

        if (!WebGL.isWebGL2Available()) {
            throw new Error("WebGL 2 not available");
        }

        const THREE = await import("three");

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 30);
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

        const soundEffect = new Audio("./sounds/fish.mp3");

        const canvas = renderer.domElement;

        canvas.onmousedown = () => {
            this.controlling.set(true);
            soundEffect.play();
        };

        this.containerRef().nativeElement.appendChild(canvas);

        renderer.setClearColor(0, 0);
        renderer.setSize(width, height, true);

        const { GLTFLoader } =
            await import("three/examples/jsm/loaders/GLTFLoader.js");

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

            const nextZoom =
                Math.abs(camera.zoom - this.targetZoom) > 0.1
                    ? lerp(camera.zoom, this.targetZoom, 0.1)
                    : this.targetZoom;

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

    onMouseMove(event: MouseEvent) {
        this.mouseVel = new Point(event.movementX, event.movementY);
    }

    onMouseUp() {
        this.controlling.set(false);
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
