import { Component } from "@angular/core";

@Component({
    selector: "friends",
    templateUrl: "./friends.html",
})
export class Friends {
    friends: {
        name: string;
        url: string;
        img: string;
    }[] = [
        {
            name: "Burg",
            url: "https://burgburg.net/",
            img: "https://burgburg.net/burgbutton.png",
        },
    ];
}
