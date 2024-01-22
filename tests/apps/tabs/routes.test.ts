import { Request, Response, Router } from "express"
import {
    RequestLogger,
    TabController,
    TabRouteHandler,
} from "../../../src/apps/tabs/routes"

describe("TabRouter", () => {
    let mockRouter: Router
    let mockTabController: jest.Mocked<TabController>
    let mockRequestLogger: jest.Mocked<RequestLogger>
    let req: Request
    let res: Response

    beforeEach(() => {
        mockRouter = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
        } as unknown as Router

        mockTabController = {
            newTab: jest.fn(),
            getTab: jest.fn(),
            deleteTab: jest.fn(),
            postTransaction: jest.fn(),
        } as jest.Mocked<TabController>

        mockRequestLogger = {
            logRequest: jest.fn(),
        } as jest.Mocked<RequestLogger>

        req = {} as Request
        res = {} as Response
    })

    it("should set up routes and use provided dependencies", () => {
        // Act
        const routeHandler = new TabRouteHandler(
            mockRouter,
            mockTabController,
            mockRequestLogger,
        )

        // Assert
        expect(routeHandler.router.post).toHaveBeenCalledWith(
            "/",
            routeHandler["postTab"],
        )
        expect(routeHandler.router.get).toHaveBeenCalledWith(
            "/:id",
            routeHandler["getTab"],
        )
        expect(routeHandler.router.delete).toHaveBeenCalledWith(
            "/:id",
            routeHandler["deleteTab"],
        )
        expect(routeHandler.router.post).toHaveBeenCalledWith(
            "/:id/transaction",
            routeHandler["postTransaction"],
        )
    })

    describe("getTab", () => {
        it("should pass the request to the request logger, and pass the request and response to the controller", () => {
            // Arrange
            const tabRouter = new TabRouteHandler(
                Router(),
                mockTabController,
                mockRequestLogger,
            )

            // Act
            tabRouter["getTab"](req, res)

            // Assert
            expect(mockRequestLogger.logRequest).toHaveBeenCalledWith(req)
            expect(mockTabController.getTab).toHaveBeenCalledWith(req, res)
        })
    })

    describe("postTab", () => {
        it("should pass the request to the request logger, and pass the request and response to the controller", () => {
            // Arrange
            const tabRouter = new TabRouteHandler(
                Router(),
                mockTabController,
                mockRequestLogger,
            )

            // Act
            tabRouter["postTab"](req, res)

            // Assert
            expect(mockRequestLogger.logRequest).toHaveBeenCalledWith(req)
            expect(mockTabController.newTab).toHaveBeenCalledWith(req, res)
        })
    })

    describe("deleteTab", () => {
        it("should pass the request to the request logger, and pass the request and response to the controller", () => {
            // Arrange
            const tabRouter = new TabRouteHandler(
                Router(),
                mockTabController,
                mockRequestLogger,
            )

            // Act
            tabRouter["deleteTab"](req, res)

            // Assert
            expect(mockRequestLogger.logRequest).toHaveBeenCalledWith(req)
            expect(mockTabController.deleteTab).toHaveBeenCalledWith(req, res)
        })
    })

    describe("postTransaction", () => {
        it("should pass the request to the request logger, and pass the request and response to the controller", () => {
            // Arrange
            const tabRouter = new TabRouteHandler(
                Router(),
                mockTabController,
                mockRequestLogger,
            )

            // Act
            tabRouter["postTransaction"](req, res)

            // Assert
            expect(mockRequestLogger.logRequest).toHaveBeenCalledWith(req)
            expect(mockTabController.postTransaction).toHaveBeenCalledWith(req, res)
        })
    })
})
