import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    PLATFORM_ID,
    signal,
} from "@angular/core";
import { Project } from "../../../types";
import { getLanguageLogo } from "../../../utils";

@Component({
    selector: "projects",
    templateUrl: "./projects.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects implements OnInit {
    githubProjects = signal<(Project & { language: string })[]>([]);

    platformId = inject(PLATFORM_ID);
    http = inject(HttpClient);

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.http
            .get("https://api.github.com/users/incohesions/repos", {
                responseType: "json",
            })
            .subscribe((data: any) =>
                this.githubProjects.update(() =>
                    data.filter((proj: any) => proj.language !== null),
                ),
            );
    }

    getLanguageLogo = getLanguageLogo;
}
