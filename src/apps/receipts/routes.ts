import { Request, RequestHandler, Response, Router } from "express"
import { ExpressRoutesFunc } from "../expressRouter"

export interface ImageReceiver {
    single(nameInBody: string): RequestHandler
}

export interface ReceiptController {
    postReceipt: ExpressRoutesFunc
}

export interface RequestLogger {
    logRequest(req: Request): void
}

export class ReceiptRouteHandler {
    constructor(
        public router: Router,
        private readonly receiptController: ReceiptController,
        imageReceiver: ImageReceiver,
        private readonly requestLogger: RequestLogger,
    ) {
        this.router.post("/", imageReceiver.single("image"), this.postReceipt)
    }

    private postReceipt = (req: Request, res: Response) => {
        this.requestLogger.logRequest(req)
        this.receiptController.postReceipt(req, res)
    }
}
