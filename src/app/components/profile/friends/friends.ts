import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "friends",
    imports: [NgOptimizedImage],
    templateUrl: "./friends.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Friends {
    protected readonly friends = [
        {
            name: "Burg",
            url: "https://burgburg.net/",
            img: "https://burgburg.net/burgbutton.png",
            mouseEffectColor: "#de8da3",
        },
        {
            name: "Swift",
            url: "https://swiftersweeper.nekoweb.org/",
            img: "https://swiftersweeper.nekoweb.org/swiftbutton.png",
            mouseEffectColor: "#6c85b9",
        },
    ];
}
