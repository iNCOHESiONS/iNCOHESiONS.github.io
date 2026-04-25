import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Icon } from "../../icon/icon";

@Component({
    selector: "links",
    templateUrl: "./links.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Icon],
})
export class Links {
    protected readonly links = [
        {
            url: "https://github.com/incohesions",
            favicon: "https://github.com/favicon.ico",
            name: "@iNCOHESiONS",
            invertInDarkMode: true,
        },
        {
            url: "https://x.com/noinconsistency",
            favicon:
                "https://upload.wikimedia.org/wikipedia/sco/9/9f/Twitter_bird_logo_2012.svg",
            name: "@noinconsistency",
        },
    ];
}
