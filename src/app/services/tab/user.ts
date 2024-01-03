import { randomUUID } from "crypto";

export default class User {
    id: string;    

    constructor(
        public firstName: string,
        public lastName: string
    ) {
        this.id = randomUUID()
    }
}