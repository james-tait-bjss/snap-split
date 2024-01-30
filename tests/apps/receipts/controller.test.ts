import { Request, Response } from "express"
import {
    ReceiptController,
    ReceiptService,
} from "../../../src/apps/receipts/controller"
import { imgFileNotExistError } from "../../../src/apps/receipts/service/errors"

describe("ReceiptController", () => {
    let mockReceiptService: jest.Mocked<ReceiptService>
    let mockResponse: jest.Mocked<Response>

    beforeEach(() => {
        mockReceiptService = {
            getReceiptItems: jest.fn(),
        } as jest.Mocked<ReceiptService>

        mockResponse = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        } as unknown as jest.Mocked<Response>
    })

    describe("postReceipt", () => {
        it("should respond with the body returned by ReceiptService and 200 OK", () => {
            // Arrange
            const controller = new ReceiptController(mockReceiptService)
            const serviceResponse = {
                items: [{ name: "item1", quantity: 1, amount: 200 }],
                hadParsingError: false,
            }
            mockReceiptService.getReceiptItems.mockResolvedValue(
                serviceResponse,
            )

            const req = {
                body: {
                    imgPath: "path",
                    mimeType: "type",
                },
            } as Request

            // Act
            const result = controller.postReceipt(req, mockResponse)

            result.then(() => {
                // Assert
                expect(mockReceiptService.getReceiptItems).toHaveBeenCalledWith(
                    req.body.imgPath,
                    req.body.mimeType,
                )
                expect(mockResponse.send).toHaveBeenCalledWith(serviceResponse)
            })
        })

        it("should respond with 400 BadRequest if the ReceiptService responsds with the correcponding error", () => {
            // Arrange
            const controller = new ReceiptController(mockReceiptService)
            mockReceiptService.getReceiptItems.mockImplementation((path, t) => {
                throw imgFileNotExistError(path)
            })

            const req = {
                body: {
                    imgPath: "not-exist-path",
                    mimeType: "type",
                },
            } as Request

            // Act
            controller.postReceipt(req, mockResponse)

            // Assert
            expect(mockReceiptService.getReceiptItems).toHaveBeenCalledWith(
                req.body.imgPath,
                req.body.mimeType,
            )
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
        })
    })
})
