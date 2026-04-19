import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { SpinningFish } from "../spinning-fish/spinning-fish";

@Component({
    selector: "profile",
    templateUrl: "./profile.html",
    styleUrl: "./profile.css",
    imports: [SpinningFish],
})
export class Profile implements OnInit {
    splash: string = "";

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.http
            .get("splashes.txt", { responseType: "text" })
            .subscribe((data) => {
                const splashes = data.split("\n");
                this.splash =
                    splashes[Math.floor(Math.random() * splashes.length)];
            });
    }

    friends: {
        name: string;
        url: string;
        img: string;
    }[] = [
        {
            name: "Burg",
            url: "https://burgburg.net/",
            img: "https://burgburg.net/burgbutton.png",
        },
    ];

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

    languages: {
        name: string;
        id: string;
        filter?: string;
    }[] = [
        { name: "Python", id: "python" },
        { name: "C++", id: "cplusplus" },
        { name: "C#", id: "csharp" },
        { name: "JavaScript", id: "javascript" },
        { name: "TypeScript", id: "typescript" },
        { name: "Java", id: "java" },
        { name: "Kotlin", id: "kotlin" },
        {
            name: "Rust",
            id: "rust",
            filter: "invert(var(--invert-icon))",
        },
        { name: "Go", id: "go" },
    ];

    getLanguageLogo(id: string) {
        return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${id}/${id}-original.svg`;
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
            navigator.userAgent,
        );
    }
}
