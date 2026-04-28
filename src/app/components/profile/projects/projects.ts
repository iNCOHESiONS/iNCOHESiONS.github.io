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
    protected readonly githubProjects = signal<
        (Project & { language: string })[]
    >([]);

    private readonly platformId = inject(PLATFORM_ID);
    private readonly http = inject(HttpClient);

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.http
            .get("https://api.github.com/users/incohesions/repos", {
                responseType: "json",
            })
            .subscribe((data: any) =>
                this.githubProjects.set(
                    (data as Project[])
                        .filter((proj) => proj.language !== null)
                        .sort((a, b) =>
                            a.language!.localeCompare(b.language!),
                        ) as any,
                ),
            );
    }

    getLanguageLogo = getLanguageLogo;
}
