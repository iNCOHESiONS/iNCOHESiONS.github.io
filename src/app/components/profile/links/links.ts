import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "links",
    imports: [NgOptimizedImage],
    templateUrl: "./links.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Links {
    protected readonly links = [
        {
            url: "https://github.com/incohesions",
            favicon: "https://github.com/favicon.ico",
            name: "@iNCOHESiONS",
            invert: true,
        },
        {
            url: "https://x.com/noinconsistency",
            favicon:
                "https://upload.wikimedia.org/wikipedia/sco/9/9f/Twitter_bird_logo_2012.svg",
            name: "@noinconsistency",
        },
    ];
}
