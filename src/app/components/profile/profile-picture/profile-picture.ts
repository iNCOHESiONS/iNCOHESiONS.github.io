import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "profile-picture",
    templateUrl: "./profile-picture.html",
    styleUrl: "./profile-picture.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePicture {
    splash = input.required<string>();
}
