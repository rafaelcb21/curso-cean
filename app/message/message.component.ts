import {Component, EventEmitter} from '@angular/core';
import {Message} from "./message";
import {MessageService} from "./message.service";
import {ErrorService} from "../errors/error.service";

@Component({
    selector: 'my-message',
    templateUrl: './js/app/message/message.component.html',
    styleUrls:['./js/app/message/message.component.css'],
    inputs: ['message'],
    outputs: ['editClicked']
})

export class MessageComponent {
    private message:Message;
    editClicked = new EventEmitter<string>();

    constructor(private _messageService: MessageService, private _errorService: ErrorService){}

    onEdit() {
        this._messageService.editMessage(this.message);
    }

    onDelete() {
        this._messageService.deleteMessage(this.message)
            .subscribe(
                data => console.log(data),
                error => this._errorService.handlerError(error)
            );
    }

    belongsToUser() {
        //console.log(this.message);
        
        return localStorage.getItem('userId') == this.message.userId;
    }
}