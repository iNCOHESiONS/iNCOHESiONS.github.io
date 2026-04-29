import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "profile-picture",
    imports: [NgOptimizedImage],
    templateUrl: "./profile-picture.html",
    styleUrl: "./profile-picture.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePicture {
    public readonly splash = input.required<string>();
}
