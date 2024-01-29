import { ReceiptServiceError } from "../../../../src/apps/receipts/service/errors"
import {
    FileSystem,
    ReceiptParser,
    ReceiptService,
} from "../../../../src/apps/receipts/service/service"

describe("ReceiptService", () => {
    let mockReceiptParser: jest.Mocked<ReceiptParser>
    let mockFileSystem: jest.Mocked<FileSystem>

    beforeEach(() => {
        mockReceiptParser = {
            parseReceipt: jest.fn(),
        } as jest.Mocked<ReceiptParser>

        mockFileSystem = {
            existsSync: jest.fn(),
            readFileSync: jest.fn(),
        } as unknown as jest.Mocked<FileSystem>
    })

    describe("getReceiptItems", () => {
        it("should throw a ReceiptServiceError if the file does not exist", () => {
            // Arrange
            const receiptService = new ReceiptService(
                mockReceiptParser,
                mockFileSystem,
            )
            mockFileSystem.existsSync.mockReturnValue(false)

            // Act
            const result = receiptService.getReceiptItems(
                "doesnt-matter",
                "type",
            )

            // Assert
            expect(result).rejects.toThrow(ReceiptServiceError)
        })

        it("should read the file if it exists, convert its contents to base46, and return it", () => {
            // Arrange
            const receiptService = new ReceiptService(
                mockReceiptParser,
                mockFileSystem,
            )
            mockFileSystem.existsSync.mockReturnValue(true)

            const exampleImageBuffer = Buffer.from([
                0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ])
            mockFileSystem.readFileSync.mockReturnValue(exampleImageBuffer)

            const returnedItems = [
                {
                    name: "item1",
                    quantity: 2,
                    amount: 20,
                },
                {
                    name: "item2",
                    quantity: 1,
                    amount: 40,
                },
            ]
            mockReceiptParser.parseReceipt.mockResolvedValue(returnedItems)

            // Act
            const result = receiptService.getReceiptItems(
                "img-path",
                "mimeType",
            )

            // Assert
            expect(result).resolves.toStrictEqual({
                items: returnedItems,
            })

            expect(mockFileSystem.existsSync).toHaveBeenCalledWith("img-path")
            expect(mockReceiptParser.parseReceipt).toHaveBeenCalledWith(
                "iVBORw0KGgo=", // The base64 encoding of exampleImageBuffer
                "mimeType",
            )
        })
    })
})
