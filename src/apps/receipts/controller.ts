import { Request, Response } from "express"
import { ReceiptServiceError } from "./service/errors"
import { HTTPReceiptItems } from "./service/service"

export interface ReceiptService {
    getReceiptItems(
        imgPath: string,
        mimeType: string,
    ): Promise<HTTPReceiptItems>
}

export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService) {}

    async postReceipt(req: Request, res: Response) {
        let result: HTTPReceiptItems
        try {
            result = await this.receiptService.getReceiptItems(
                req.body.imgPath,
                req.body.mimeType,
            )
        } catch (err) {
            if (err instanceof ReceiptServiceError) {
                this.handleReceiptServiceError(err, res)
            }
            return
        }

        res.send(result)
    }

    private handleReceiptServiceError(err: ReceiptServiceError, res: Response) {
        switch (err.name) {
            case "IMG_FILE_NOT_EXIST_ERROR":
                res.sendStatus(400)
        }
    }
}
