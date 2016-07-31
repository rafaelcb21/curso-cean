import {Component} from '@angular/core';
import {HeaderComponent} from './header.component'
import {ROUTER_DIRECTIVES} from "@angular/router";

import {provideRouter, RouterConfig} from '@angular/router';
import {MessagesComponent} from './message/messages.component';
import {AuthenticationComponent} from './auth/authentication.component';

import {SignupComponent} from './auth/signup.component';
import {SigninComponent} from './auth/signin.component';
import {LogoutComponent} from './auth/logout.component';

import {ErrorComponent} from './errors/error.component';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    template: `
        <div class="container">
            <my-header></my-header>
        </div>
        <my-error></my-error>
    `,
    directives: [HeaderComponent, ErrorComponent],
    precompile: [AuthenticationComponent, MessagesComponent, SignupComponent, SigninComponent, LogoutComponent, ErrorComponent]
})

export class AppComponent {

}
