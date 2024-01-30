import { imgFileNotExistError } from "./errors"

type base64 = string

export interface HTTPReceiptItems {
    items: ReceiptItem[]
    hadParsingError: boolean
}

export interface FileSystem {
    existsSync(filepath: string): boolean
    readFileSync(filepath: string): string | Buffer
}

export interface IReceiptParser {
    parseReceipt(
        image: base64,
        mimeType: string,
    ): Promise<[ReceiptItem[], boolean]>
}

export interface ReceiptItem {
    name: string
    quantity: number
    amount: number
}

export class ReceiptService {
    constructor(
        private readonly receiptParser: IReceiptParser,
        private readonly fs: FileSystem,
    ) {}

    /**
     * @param imgPath - the file path at which the image is stored
     * @param mimeType - the mimeType of the image
     * @returns an object containing an array of ReceiptItems
     *  representing each item on the receipt, and a boolean
     *  representing whether there was an issue when parsing the receipt
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

        const [receiptItems, hadParsingError] = await this.receiptParser.parseReceipt(
            encodedImage,
            mimeType,
        )

        return {
            items: receiptItems,
            hadParsingError: hadParsingError
        }
    }
}
