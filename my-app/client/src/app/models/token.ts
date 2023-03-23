//import uuid
import { v4 as uuid } from 'uuid';

export class Token {
    name : String;
    url : String;
    id : String
    constructor(name : String, url : String){
        this.name = name;
        this.url = url;
        this.id = uuid();
    }
}
