import {Component} from "@angular/core";
import {SignupComponent} from "./signup.component";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {AuthService} from './auth.service';

@Component({
    selector: 'my-auth',
    template: `
        <header class="row spacing">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-tabs">
                    <li><a [routerLink]="['./signup']">Signup</a></li>
                    <li><a [routerLink]="['./signin']" *ngIf="!isLoggedIn()">Signin</a></li>
                    <li><a [routerLink]="['./logout']" *ngIf="isLoggedIn()">Logout</a></li>
                </ul>
            </nav>
        </header>
        <div class="row spacing">
            <router-outlet></router-outlet>
        </div>
    `,
    directives: [ROUTER_DIRECTIVES],
    styles: [`
        .router-link-active {
            color: #555;
            cursor: default;
            background-color: #fff;
            border: 1px solid #ddd;
            border-bottom-color: transparent;
        }
    `]
})

export class AuthenticationComponent {
    constructor(private _authService: AuthService) {}

    isLoggedIn() {
        return this._authService.isLoggedIn();
    }
}