import { Request, RequestHandler, Response, Router } from "express"
import {
    ImageReceiver,
    ReceiptController,
    ReceiptRouteHandler,
    RequestLogger,
} from "../../../src/apps/receipts/routes"

describe("ReceiptRouteHandler", () => {
    let mockRouter: Router
    let mockReceiptController: jest.Mocked<ReceiptController>
    let mockImageReceiver: jest.Mocked<ImageReceiver>
    let mockRequestLogger: jest.Mocked<RequestLogger>
    let req: Request
    let res: Response

    beforeEach(() => {
        mockRouter = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
        } as unknown as Router

        mockReceiptController = {
            postReceipt: jest.fn(),
        } as jest.Mocked<ReceiptController>

        mockImageReceiver = {
            single: jest.fn()
        } as jest.Mocked<ImageReceiver>

        mockRequestLogger = {
            logRequest: jest.fn(),
        } as jest.Mocked<RequestLogger>

        req = {} as Request
        res = {} as Response
    })


    describe("constructor", () => {
        it("should set up routes and use provided dependencies", () => {
            // Arrange
            const imageReceiverOutput = {} as RequestHandler
            mockImageReceiver.single.mockReturnValue(imageReceiverOutput)
            
            // Act
            const routeHandler = new ReceiptRouteHandler(
                mockRouter,
                mockReceiptController,
                mockImageReceiver,
                mockRequestLogger,
            )

            // Assert
            expect(mockImageReceiver.single).toHaveBeenCalledWith("image")
            expect(routeHandler.router.post).toHaveBeenCalledWith(
                "/",
                imageReceiverOutput,
                routeHandler["postReceipt"],
            )
        })
    })

    describe("postReceipt", () => {
        it("should pass the request to the request logger, and pass reqest and response to the controller", () => {
            // Arrange
            const routeHandler = new ReceiptRouteHandler(
                mockRouter,
                mockReceiptController,
                mockImageReceiver,
                mockRequestLogger,
            )

            // Act
            routeHandler["postReceipt"](req, res)

            // Assert
            expect(mockRequestLogger.logRequest).toHaveBeenCalledWith(req)
            expect(mockReceiptController.postReceipt).toHaveBeenCalledWith(req, res)
        })
    })
})
