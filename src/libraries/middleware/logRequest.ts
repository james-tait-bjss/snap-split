import { Request } from "express"

export default function (req: Request) {
    console.log("%s %s", req.method, req.originalUrl)
}
