import { Request } from "express"

export class RequestLogger {
    constructor() {}
    public logRequest(req: Request) {
        console.log("%s %s", req.method, req.originalUrl)
    }
}
