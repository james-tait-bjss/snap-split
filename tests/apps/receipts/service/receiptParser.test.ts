import {
    GCPDocumentRecogniser,
    GCPReceiptParser,
} from "../../../../src/apps/receipts/service/receiptParser"

describe("ReceiptParser", () => {
    let mockDocumentRecogniser: jest.Mocked<GCPDocumentRecogniser>

    beforeEach(() => {
        mockDocumentRecogniser = {
            processDocument: jest.fn(),
        } as jest.Mocked<GCPDocumentRecogniser>
    })

    describe("constructor", () => {
        it("should set the processorName property correctly", () => {
            // Arrange
            const projectNumber = "12345"
            const processorID = "id"

            // Act
            const parser = new GCPReceiptParser(
                mockDocumentRecogniser,
                projectNumber,
                processorID,
            )

            // Assert
            expect(parser["processorName"]).toBe(
                "projects/12345/locations/eu/processors/id",
            )
        })
    })

    describe("parseReceipt", () => {
        let parser: GCPReceiptParser
        let expectedProcessorName: string

        beforeEach(() => {
            const projectNumber = "12345"
            const processorID = "id"
            expectedProcessorName = "projects/12345/locations/eu/processors/id"
            parser = new GCPReceiptParser(
                mockDocumentRecogniser,
                projectNumber,
                processorID,
            )
        })

        it("should return an empty array and true if the document field was null", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                {},
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([[], true])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should return an empty array and true if the document field was undefined", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: undefined },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([[], true])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should return an empty array and true if the entities field was null", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: {} },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([[], true])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should return an empty array and true if the entities field was undefined", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: { entities: undefined } },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([[], true])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should return an empty array and true if the entities fields is an empty array", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: { entities: [] } },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([[], true])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should correctly parse two receipt items", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            const entity1 = {
                type: "line_item",
                properties: [
                    {
                        type: "line_item/description",
                        mentionText: "itemName",
                    },
                    {
                        type: "line_item/quantity",
                        mentionText: "1",
                    },
                    {
                        type: "line_item/amount",
                        mentionText: "10.00",
                    },
                ],
            }

            const entity2 = {
                type: "line_item",
                properties: [
                    {
                        type: "line_item/description",
                        mentionText: "itemName2",
                    },
                    {
                        type: "line_item/quantity",
                        mentionText: "2",
                    },
                    {
                        type: "line_item/amount",
                        mentionText: "20.00",
                    },
                ],
            }

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: { entities: [entity1, entity2] } },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([
                [
                    {
                        name: "itemName",
                        quantity: 1,
                        amount: 1000,
                    },
                    {
                        name: "itemName2",
                        quantity: 2,
                        amount: 2000,
                    },
                ],
                false,
            ])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should correctly parse an item that is missing a description but return true", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            const entity1 = {
                type: "line_item",
                properties: [
                    {
                        type: "line_item/description",
                        mentionText: null,
                    },
                    {
                        type: "line_item/quantity",
                        mentionText: "1",
                    },
                    {
                        type: "line_item/amount",
                        mentionText: "10.00",
                    },
                ],
            }

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: { entities: [entity1] } },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([
                [
                    {
                        name: "",
                        quantity: 1,
                        amount: 1000,
                    },
                ],
                true,
            ])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })

        it("should correctly parse an item that is missing a quantity but return true", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            const entity1 = {
                type: "line_item",
                properties: [
                    {
                        type: "line_item/description",
                        mentionText: "itemName",
                    },
                    {
                        type: "line_item/quantity",
                        mentionText: null,
                    },
                    {
                        type: "line_item/amount",
                        mentionText: "10.00",
                    },
                ],
            }

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: { entities: [entity1] } },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([
                [
                    {
                        name: "itemName",
                        quantity: 0,
                        amount: 1000,
                    },
                ],
                true,
            ])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })
        
        it("should correctly parse an item that is missing an amount but return true", () => {
            // Arrange
            const encodedImage = "encoded"
            const mimeType = "mimeType"

            const entity1 = {
                type: "line_item",
                properties: [
                    {
                        type: "line_item/description",
                        mentionText: "itemName",
                    },
                    {
                        type: "line_item/quantity",
                        mentionText: "1",
                    },
                    {
                        type: "line_item/amount",
                        mentionText: null,
                    },
                ],
            }

            mockDocumentRecogniser.processDocument.mockResolvedValue([
                { document: { entities: [entity1] } },
                undefined,
                undefined,
            ])

            // Act
            const result = parser.parseReceipt(encodedImage, mimeType)

            // Assert
            expect(result).resolves.toStrictEqual([
                [
                    {
                        name: "itemName",
                        quantity: 1,
                        amount: 0,
                    },
                ],
                true,
            ])

            expect(mockDocumentRecogniser.processDocument).toHaveBeenCalledWith(
                {
                    name: expectedProcessorName,
                    rawDocument: {
                        content: encodedImage,
                        mimeType: mimeType,
                    },
                },
            )
        })
    })
})
