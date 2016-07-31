import {provideRouter, RouterConfig} from '@angular/router';
import {MessagesComponent} from './message/messages.component';
import {AuthenticationComponent} from './auth/authentication.component';
import {SignupComponent} from './auth/signup.component';
import {SigninComponent} from './auth/signin.component';
import {LogoutComponent} from './auth/logout.component';

export const AppRoutes: RouterConfig = [
    {path: 'messages', component: MessagesComponent},
    {path: 'auth', component: AuthenticationComponent,
            children: [
                {path: 'signup', component: SignupComponent},
                {path: 'signin', component: SigninComponent},
                {path: 'logout', component: LogoutComponent}
            ]
        },
    {path: '', redirectTo: 'messages', pathMatch: 'full'},
    {path: 'auth', redirectTo: 'auth/signup', pathMatch: 'full'},
    
];

export const APP_ROUTER_PROVIDERS = [ provideRouter(AppRoutes) ];