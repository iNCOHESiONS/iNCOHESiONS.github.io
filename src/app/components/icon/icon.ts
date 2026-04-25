import { isPlatformBrowser } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    PLATFORM_ID,
} from "@angular/core";

@Component({
    selector: "icon",
    template: `<img
        [src]="src"
        [alt]="alt"
        [class.invert]="prefersDarkMode && invertInDarkMode"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
    platformId = inject(PLATFORM_ID);

    @Input() src!: string;
    @Input() alt!: string;
    @Input() invertInDarkMode: boolean = false;

    protected prefersDarkMode = false;

    constructor() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
    }
}
