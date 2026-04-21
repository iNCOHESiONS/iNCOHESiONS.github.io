import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { GithubProject } from "../../types";

@Component({
    selector: "projects",
    templateUrl: "./projects.html",
})
export class Projects implements OnInit {
    platformId = inject(PLATFORM_ID);
    http = inject(HttpClient);

    githubProjects: (GithubProject & { language: string })[] = [];

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.http
            .get("https://api.github.com/users/incohesions/repos", {
                responseType: "json",
            })
            .subscribe(
                (data) =>
                    (this.githubProjects = (data as any).filter(
                        (proj: any) => proj.language !== null,
                    )),
            );
    }

    getLanguageLogo(id: string) {
        return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${id}/${id}-original.svg`;
    }
}
