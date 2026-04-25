import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "friends",
    templateUrl: "./friends.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Friends {
    protected readonly friends = [
        {
            name: "Burg",
            url: "https://burgburg.net/",
            img: "https://burgburg.net/burgbutton.png",
        },
        {
            name: "Swift",
            url: "https://swiftersweeper.nekoweb.org/",
            img: "https://swiftersweeper.nekoweb.org/swiftbutton.png",
        },
    ];
}
