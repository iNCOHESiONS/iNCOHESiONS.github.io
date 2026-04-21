import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { choice, isMobile } from "../../utils";
import { Friends } from "../friends/friends";
import { Languages } from "../languages/languages";
import { Links } from "../links/links";
import { Projects } from "../projects/projects";
import { SpinningFish } from "../spinning-fish/spinning-fish";

@Component({
    selector: "profile",
    templateUrl: "./profile.html",
    styleUrl: "./profile.css",
    imports: [SpinningFish, Projects, Links, Friends, Languages],
})
export class Profile implements OnInit {
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
