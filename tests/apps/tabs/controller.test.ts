import { Request, Response } from "express"
import { TabController } from "../../../src/apps/tabs/controller"
import { tabNotExistError } from "../../../src/apps/tabs/service/errors"
import { AddTransactionArgs } from "../../../src/apps/tabs/service/service"

interface MockTabService {
    newTab(name: string, users: string[]): Promise<string>
    getTab(id: string): Promise<object>
    deleteTab(id: string): void
    addTransaction(id: string, transaction: AddTransactionArgs): void
}

describe("TabController", () => {
    let mockTabService: jest.Mocked<MockTabService>
    let mockResponse: jest.Mocked<Response>

    beforeEach(() => {
        mockTabService = {
            newTab: jest.fn(),
            getTab: jest.fn(),
            deleteTab: jest.fn(),
            addTransaction: jest.fn(),
        } as jest.Mocked<MockTabService>

        mockResponse = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        } as unknown as jest.Mocked<Response>
    })

    describe("newTab", () => {
        it("should create a new tab and send its id in the response", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                body: {
                    name: "new-tab",
                    users: ["user1", "user2"],
                },
            }

            const expectedID = "uuid"
            mockTabService.newTab.mockResolvedValue(expectedID)

            // Act
            controller.newTab(req as Request, mockResponse).then(() => {
                // Assert
                expect(mockTabService.newTab).toHaveBeenCalledWith("new-tab", [
                    "user1",
                    "user2",
                ])
                expect(mockResponse.send).toHaveBeenCalledWith(expectedID)
            })
        })
    })

    describe("getTab", () => {
        it("should retrieve the tab matching the id and send it in the response", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                params: {
                    id: "uuid",
                },
            }

            const expectedTab = { name: "tab" }
            mockTabService.getTab.mockResolvedValue(expectedTab)

            // Act
            controller.getTab(req as Request, mockResponse).then(() => {
                // Assert
                expect(mockTabService.getTab).toHaveBeenCalledWith("uuid")
                expect(mockResponse.send).toHaveBeenCalledWith(expectedTab)
            })
        })

        it("should return a 404 NOT_FOUND if the service throws a TAB_NOT_EXIST_ERROR", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                params: {
                    id: "uuid",
                },
            }

            mockTabService.getTab.mockImplementation(() => {
                throw tabNotExistError("")
            })

            // Act
            controller.getTab(req as Request, mockResponse).then(() => {
                // Assert
                expect(mockTabService.getTab).toHaveBeenCalledWith("uuid")
                expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
            })
        })
    })

    describe("deleteTab", () => {
        it("should delete the tab matching that id and return a 200 OK", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                params: {
                    id: "uuid",
                },
            }

            // Act
            controller.deleteTab(req as Request, mockResponse)

            // Assert
            expect(mockTabService.deleteTab).toHaveBeenCalledWith("uuid")
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
        })

        it("should return a 404 NOT_FOUND if the service throws a TAB_NOT_EXIST_ERROR", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                params: {
                    id: "uuid",
                },
            }

            mockTabService.deleteTab.mockImplementation(() => {
                throw tabNotExistError("")
            })

            // Act
            controller.deleteTab(req as Request, mockResponse)

            // Assert
            expect(mockTabService.deleteTab).toHaveBeenCalledWith("uuid")
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
        })
    })

    describe("postTransaction", () => {
        it("should add the transaction and send a 200 OK in the response", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                body: {
                    paidBy: "user1",
                    amount: 20,
                    owedBy: {
                        user2: 10,
                        user3: 10,
                    },
                },
                params: {
                    id: "uuid",
                },
            }

            // Act
            controller.postTransaction(req as Request, mockResponse)

            // Assert
            expect(mockTabService.addTransaction).toHaveBeenCalledWith("uuid", {
                paidBy: "user1",
                amount: 20,
                owedBy: {
                    user2: 10,
                    user3: 10,
                },
            })
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
        })

        it("should return a 404 NOT_FOUND if the service throws a TAB_NOT_EXIST_ERROR", () => {
            // Arrange
            const controller = new TabController(mockTabService)
            const req: Partial<Request> = {
                body: {
                    paidBy: "user1",
                    amount: 20,
                    owedBy: {
                        user2: 10,
                        user3: 10,
                    },
                },
                params: {
                    id: "uuid",
                },
            }

            mockTabService.addTransaction.mockImplementation(() => {
                throw tabNotExistError("")
            })

            // Act
            controller.postTransaction(req as Request, mockResponse)

            // Assert
            expect(mockTabService.addTransaction).toHaveBeenCalledWith("uuid", {
                paidBy: "user1",
                amount: 20,
                owedBy: {
                    user2: 10,
                    user3: 10,
                },
            })
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
        })
    })
})
