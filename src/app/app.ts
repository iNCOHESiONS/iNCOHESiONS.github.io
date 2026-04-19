import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MouseEffects } from "./components/mouse-effects/mouse-effects";
import { Profile } from "./components/profile/profile";
import { isMobile } from "./utils";

@Component({
    selector: "app",
    templateUrl: "./app.html",
    imports: [RouterOutlet, Profile, MouseEffects],
})
export class App {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    isMobile() {
        return !isPlatformBrowser(this.platformId) || isMobile();
    }
}
