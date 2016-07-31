/// <reference path="../typings.d.ts" />
import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {enableProdMode, provide} from "@angular/core";
import {MessageService} from "./message/message.service";
import {AuthService} from "./auth/auth.service";
import {APP_ROUTER_PROVIDERS} from "./routes.component";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {HTTP_PROVIDERS} from '@angular/http';
import {ErrorService} from './errors/error.service';

enableProdMode();
bootstrap(AppComponent, [MessageService, AuthService, ErrorService, HTTP_PROVIDERS, APP_ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
