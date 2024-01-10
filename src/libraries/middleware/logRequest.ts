import { Request } from "express"

export class RequestLogger {
    public logRequest(req: Request) {
        console.log("%s %s", req.method, req.originalUrl)
    }
}
