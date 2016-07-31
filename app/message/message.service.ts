import {Injectable, EventEmitter} from "@angular/core";
import {Message} from "./message";
import {Http, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {Config} from '../config';

@Injectable()
export class MessageService {
    messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private _http: Http) {}

    /**randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }*/

    addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = '?token=' + localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.post(Config.URL_SITE + 'message' + token, body, {headers: headers})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));

/** 
        return this._http.post('http://localhost:3000/message', body, {headers: headers})
            .map(response => {
                const data = response.json().obj;
                const id_rev = response.json().id_rev;
                let message = new Message(data.content, 'Dummy', null, null, id_rev.id, id_rev.rev);
            })
            .catch(error => Observable.throw(error.json()));
*/
    }

    getMessages() {
        return this._http.get(Config.URL_SITE + 'message')
            .map(response => {
                const data = response.json().obj;
                //console.log(data);
                //const size = Object.keys(data.rows).length;
                const size = Object.keys(data).length;
                let objs: any[] = [];            
                for (let i = 0; i < size; i++) {
                    //objs.push(data.rows[i].doc);
                    objs.push(data[i].value);
                    //console.log(data[i].value);
                }
                return objs;
            })
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        console.log(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = '?token=' + localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        const userId = '&userId=' + localStorage.getItem('userId') ? '&userId=' + localStorage.getItem('userId') : '';
        //this.messages[this.messages.indexOf(message)] = new Message('Edited', 'Dummy', null);
        return this._http.patch(Config.URL_SITE + 'message/' + message._id + token + userId, body, {headers: headers})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message); 
    }
    
    deleteMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = '?token=' + localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.patch(Config.URL_SITE + 'message/' + message._id + "/" + message._rev  + token, body, {headers: headers})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }
}