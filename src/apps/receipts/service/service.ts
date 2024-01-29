import { imgFileNotExistError } from "./errors"

type base64 = string

interface HTTPReceiptItems {
    items: ReceiptItem[]
}

interface FileSystem {
    existsSync(filepath: string): boolean
    readFileSync(filepath: string): string | Buffer
}

export interface ReceiptParser {
    parseReceipt(image: base64, mimeType: string): Promise<ReceiptItem[]>
}

export interface ReceiptItem {
    name: string
    quantity: number
    amount: number
}

export class ReceiptService {
    constructor(
        private readonly receiptParser: ReceiptParser,
        private readonly fs: FileSystem,
    ) {}

    /**
     * @param imgPath - the file path at which the image is stored
     * @param mimeType - the mimeType of the image
     * @returns an object containing an array of ReceiptItems
     *  representing each item on the receipt
     */
    public async getReceiptItems(
        imgPath: string,
        mimeType: string,
    ): Promise<HTTPReceiptItems> {
        if (!this.fs.existsSync(imgPath)) {
            throw imgFileNotExistError(imgPath)
        }

        const imageFile = this.fs.readFileSync(imgPath)
        const encodedImage = Buffer.from(imageFile).toString("base64")

        const receiptItems = await this.receiptParser.parseReceipt(
            encodedImage,
            mimeType,
        )

        return {
            items: receiptItems,
        }
    }
}
