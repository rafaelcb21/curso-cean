/**export class User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;

    constructor(email: string, password: string, firstName?: string, lastName?: string) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}*/

export class User {
    constructor(
        public email: string,
        public password: string,
        public firstName?: string,
        public lastName?: string,
        public messagesIds?: Array<string>
    ){}
}