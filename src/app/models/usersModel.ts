export class Users{
    _id: number;
    email: string;
    password: string;
    name:string;
    role: string;
    token?: string;


    constructor(token?:string){
        this.token = token;
    }
}