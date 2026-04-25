import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AnimatedBackgroundComponent } from "./components/animated-background/animated-background";
import { MouseEffects } from "./components/mouse-effects/mouse-effects";
import { Friends } from "./components/profile/friends/friends";
import { Languages } from "./components/profile/languages/languages";
import { Links } from "./components/profile/links/links";
import { ProfilePicture } from "./components/profile/profile-picture/profile-picture";
import { Projects } from "./components/profile/projects/projects";
import { SpinningFish } from "./components/spinning-fish/spinning-fish";
import { choice, isMobile } from "./utils";

@Component({
    selector: "app",
    templateUrl: "./app.html",
    imports: [
        RouterOutlet,
        MouseEffects,
        SpinningFish,
        Projects,
        Links,
        Friends,
        Languages,
        ProfilePicture,
        AnimatedBackgroundComponent,
    ],
})
export class App {
    platformId = inject(PLATFORM_ID);
    http = inject(HttpClient);

    splash = signal("");

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.http
            .get("./text/splashes.txt", { responseType: "text" })
            .subscribe((data) =>
                this.splash.update(() => choice(data.split("\n"))),
            );
    }

    isMobile() {
        return !isPlatformBrowser(this.platformId) || isMobile();
    }
}
