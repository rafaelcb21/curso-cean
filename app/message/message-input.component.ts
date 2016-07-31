import {Component, OnInit} from '@angular/core';
import {Message} from "./message";
import {MessageService} from "./message.service";
import {ErrorService} from "../errors/error.service";

@Component({
    selector: 'my-message-input',
    template: `
    <section class="col-md-8 col-md-offset-2">
        <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">
            <div class="form-group">
                <label for="content">Content</label>
                <input ngControl="content" type="text" class="form-control" id="content" #input [value]="message?.content">
            </div>
            <button type="submit" class="btn btn-primary">{{ !message ? 'Send Message' : 'Save Message' }}</button>
            <button type="buttona" class="btn btn-danger" (click)="onCancel()" *ngIf="message">Cancel</button>
        </form>
     </section>`
})
export class MessageInputComponent implements OnInit {
    message: Message = null;
    //public hash = "";

    constructor(private _messageService: MessageService, private _errorService: ErrorService) {}


    onSubmit(form:any) {
        if (this.message){

            //console.log(this.message);
            //console.log("**************");
            //console.log(form.content);
            //console.log("**************");

            this.message.content = form.content;
            this._messageService.updateMessage(this.message)
                .subscribe(
                    data => console.log(data),
                    error => this._errorService.handlerError(error)
                );
            this.message = null;
        }else{
            //const hash = this._messageService.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            const message: Message = new Message('message', form.content, 'Dummy', null);//, null, hash);
            this._messageService.addMessage(message)
                .subscribe(
                    data => {
                        const message: Message = new Message('message', data.obj.content, data.obj.username, data.obj.messageId, data.obj.userId, data.id_rev.id, data.id_rev.rev);                     
                        this._messageService.messages.push(message);
                        //console.log(message);
                    },
                    error => this._errorService.handlerError(error)
                );
            }
        }

    onCancel(){
        this.message = null
    }

    ngOnInit() {
        this._messageService.messageIsEdit.subscribe(
            message=> {
                this.message = message;
            }
        );
    }
}