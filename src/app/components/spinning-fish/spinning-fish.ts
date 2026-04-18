import { isPlatformBrowser } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    PLATFORM_ID,
    ViewChild,
} from "@angular/core";
import type * as THREE from "three";

@Component({
    selector: "spinning-fish",
    template: `
        <div
            title="Model and texture by umar6419 at https://free3d.com/3d-model/tuna-fish-21843.html"
            #container
        ></div>
    `,
})
export class SpinningFish implements AfterViewInit, OnDestroy {
    @ViewChild("container", { static: true })
    containerRef!: ElementRef<HTMLDivElement>;

    @Input() width = 400;
    @Input() height = 200;

    private cleanup = () => {};
    private animationId = 0;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
        camera.zoom = 5;
        camera.updateProjectionMatrix();

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.containerRef.nativeElement.appendChild(renderer.domElement);

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
            fish.rotation.z += 0.01; // z up
            renderer.render(scene, camera);
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
