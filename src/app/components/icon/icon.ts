import { isPlatformBrowser } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    PLATFORM_ID,
} from "@angular/core";

@Component({
    selector: "icon",
    template: `<img
        [src]="src()"
        [alt]="alt()"
        [class.invert]="prefersDarkMode && invertInDarkMode()"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
    platformId = inject(PLATFORM_ID);

    src = input.required<string>();
    alt = input.required<string>();
    invertInDarkMode = input(false);

    protected prefersDarkMode = false;

    constructor() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
    }
}
