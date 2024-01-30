import { protos } from "@google-cloud/documentai"
import { IReceiptParser, ReceiptItem } from "./service"

type nullableString = string | null | undefined

export interface GCPDocumentRecogniser {
    processDocument(
        request: protos.google.cloud.documentai.v1.IProcessRequest,
    ): Promise<
        [
            protos.google.cloud.documentai.v1.IProcessResponse,
            protos.google.cloud.documentai.v1.IProcessRequest | undefined,
            {} | undefined,
        ]
    >
}

export class GCPReceiptParser implements IReceiptParser {
    private processorName: string

    constructor(
        private readonly documentRecogniser: GCPDocumentRecogniser,
        projectNumber: string,
        processorID: string,
    ) {
        this.processorName = `projects/${projectNumber}/locations/eu/processors/${processorID}`
    }

    async parseReceipt(
        encodedImage: string,
        mimeType: string,
    ): Promise<[ReceiptItem[], boolean]> {
        const request: protos.google.cloud.documentai.v1.IProcessRequest = {
            name: this.processorName,
            rawDocument: {
                content: encodedImage,
                mimeType: mimeType,
            },
        }

        const [result] = await this.documentRecogniser.processDocument(request)

        return this.parseResponse(result)
    }

    private parseResponse(
        response: protos.google.cloud.documentai.v1.IProcessResponse,
    ): [ReceiptItem[], boolean] {
        const document = response.document

        if (document == null) {
            return [[], true]
        }

        if (document.entities == null || document.entities.length == 0) {
            return [[], true]
        }

        const items: ReceiptItem[] = []

        let hadParsingError = false
        document.entities.forEach((entity) => {
            if (entity.type == "line_item") {
                const [item, parsingError] = this.parseReceiptItem(entity)

                hadParsingError = hadParsingError || parsingError

                items.push(item)
            }
        })

        return [items, hadParsingError]
    }

    private parseReceiptItem(
        entity: protos.google.cloud.documentai.v1.Document.IEntity,
    ): [ReceiptItem, boolean] {
        const item: ReceiptItem = {
            name: "",
            quantity: 0,
            amount: 0,
        }
        let hadParsingError = false
        entity.properties?.forEach((property) => {
            const ok = this.populateItemProperty(
                item,
                property.type,
                property.mentionText,
            )
            if (!ok) hadParsingError = true
        })

        return [item, hadParsingError]
    }

    private populateItemProperty(
        item: ReceiptItem,
        type: nullableString,
        text: nullableString,
    ): boolean {
        let ok: boolean
        switch (type) {
            case "line_item/description":
                ok = this.populateName(item, text)
                return ok

            case "line_item/quantity":
                ok = this.populateQuantity(item, text)
                return ok

            case "line_item/amount":
                ok = this.populateAmount(item, text)
                return ok
        }

        // This property was not one that we need to parse, so there was no error
        return true
    }

    private populateName(item: ReceiptItem, text: nullableString): boolean {
        if (text == null) {
            console.log("could not read line_item/description")
            return false
        }

        item.name = text

        return true
    }

    private populateQuantity(item: ReceiptItem, text: nullableString): boolean {
        if (text == null) {
            console.log("could not read line_item/quantity")
            return false
        }

        item.quantity = +text

        return true
    }

    private populateAmount(item: ReceiptItem, text: nullableString): boolean {
        if (text == null ) {
            console.log("could not read line_item/amount")
            return false
        }

        // To get the amount into pence
        item.amount = +text * 100

        return true
    }
}
