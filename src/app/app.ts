import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Profile } from "./components/profile/profile";

@Component({
    selector: "app",
    templateUrl: "./app.html",
    styleUrl: "./app.css",
    imports: [RouterOutlet, Profile],
})
export class App {}
