import { Component } from "@angular/core";

@Component({
    selector: "languages",
    templateUrl: "./languages.html",
})
export class Languages {
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
}
