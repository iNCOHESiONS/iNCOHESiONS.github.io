import { NgOptimizedImage } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from "@angular/core";

@Component({
    selector: "programming-language-icon",
    imports: [NgOptimizedImage],
    templateUrl: "./programming-language-icon.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgrammingLanguageIcon {
    public readonly id = input.required<string>();

    protected readonly iconSrc = computed(
        () =>
            `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${this.id().toLowerCase()}/${this.id().toLowerCase()}-original.svg`,
    );
}
