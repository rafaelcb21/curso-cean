import { Component } from "@angular/core";
import { MessageInputComponent } from "./message-input.component";
import { MessageListComponent} from "./message-list.component";

@Component({
    selector: 'my-messages',
    templateUrl: './js/app/message/messages.component.html',
    directives: [ MessageListComponent, MessageInputComponent ],
})
export class MessagesComponent {

}