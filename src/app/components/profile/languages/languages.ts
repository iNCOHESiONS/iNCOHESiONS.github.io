import { ChangeDetectionStrategy, Component } from "@angular/core";
import { getLanguageLogo } from "../../../utils";
import { Icon } from "../../icon/icon";

@Component({
    selector: "languages",
    templateUrl: "./languages.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Icon],
})
export class Languages {
    protected readonly languages = [
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
            invertInDarkMode: true,
        },
        { name: "Go", id: "go" },
    ];

    getLanguageLogo = getLanguageLogo;
}
