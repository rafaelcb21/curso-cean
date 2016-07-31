/**export class Message {
    content: string;
    username: string;
    messageId: string;
    userId: string;

    constructor (content: string, messageId?: string, username?: string, userId?: string){
        this.content = content;
        this.messageId = messageId;
        this.username = username;
        this.userId = userId;
    }
}*/

export class Message {
    constructor (
        public type?: string,
        public content?: string,
        public username?: string,
        public messageId?: string,
        public userId?: string,
        public _id?: string,
        public _rev?: string
    ) {}
}