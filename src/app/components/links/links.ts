import { Component } from "@angular/core";

@Component({
    selector: "links",
    templateUrl: "./links.html",
})
export class Links {
    links: {
        url: string;
        favicon: string;
        name: string;
        filter?: string;
    }[] = [
        {
            url: "https://github.com/incohesions",
            favicon: "https://github.com/favicon.ico",
            name: "@iNCOHESiONS",
            filter: "invert(var(--invert-icon))",
        },
        {
            url: "https://x.com/noinconsistency",
            favicon:
                "https://upload.wikimedia.org/wikipedia/sco/9/9f/Twitter_bird_logo_2012.svg",
            name: "@noinconsistency",
        },
    ];
}
