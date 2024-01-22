import {
    TabDTO,
    TransactionDTO,
} from "../../../../src/apps/tabs/repository/dto"
import { TabServiceError } from "../../../../src/apps/tabs/service/errors"
import { TabService } from "../../../../src/apps/tabs/service/service"

interface MockTabRepository {
    newTab(dto: TabDTO): Promise<string>
    getTab(id: string): Promise<TabDTO | null>
    deleteTab(id: string): void
    updateTab(id: string, dto: TabDTO): void
}

describe("TabService", () => {
    let mockTabRepository: jest.Mocked<MockTabRepository>

    beforeEach(() => {
        mockTabRepository = {
            newTab: jest.fn(),
            getTab: jest.fn(),
            deleteTab: jest.fn(),
            updateTab: jest.fn(),
        } as jest.Mocked<MockTabRepository>
    })

    describe("newTab", () => {
        it("should create a new tab with the given name and balances set to zero", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            const expectedID = "uuid"
            mockTabRepository.newTab.mockResolvedValue(expectedID)

            // Act
            const id = service.newTab("new-tab", ["user1", "user2", "user3"])

            // Assert
            expect(mockTabRepository.newTab).toHaveBeenCalledWith(
                new TabDTO("new-tab", ["user1", "user2", "user3"], []),
            )

            expect(id).resolves.toBe(expectedID)
        })
    })

    describe("getTab", () => {
        it("should return the tab as an object if repository returns it", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            const existingTabDTO = new TabDTO(
                "new-tab",
                ["user1", "user2"],
                [new TransactionDTO("user1", 10, { user2: 10 })],
            )
            mockTabRepository.getTab.mockResolvedValue(existingTabDTO)

            // Act
            const returnedTabDTO = service.getTab("id")

            // Assert
            expect(mockTabRepository.getTab).toHaveBeenCalledWith("id")
            expect(returnedTabDTO).resolves.toStrictEqual({
                name: "new-tab",
                users: {
                    user1: {
                        balance: 10,
                        owedBy: {
                            user2: 10,
                        },
                    },
                    user2: {
                        balance: -10,
                        owedBy: {
                            user1: -10,
                        },
                    },
                },
            })
        })

        it("should throw a TabServiceError if the tab does not exist in the repository", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            mockTabRepository.getTab.mockResolvedValue(null)

            // Act & Assert
            expect(() => service.getTab("id")).rejects.toThrow(TabServiceError)
        })
    })

    describe("deleteTab", () => {
        it("should delete the tab if it exists", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            mockTabRepository.getTab.mockResolvedValue(
                new TabDTO("name", [], []),
            )

            // Act
            service.deleteTab("id").then(() => {
                // Assert
                expect(mockTabRepository.getTab).toHaveBeenCalledWith("id")
                expect(mockTabRepository.deleteTab).toHaveBeenCalledWith("id")
            })
        })

        it("should throw a TabServiceError if the tab does not exist in the repository", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            mockTabRepository.getTab.mockResolvedValue(null)

            // Act & Assert
            expect(() => service.deleteTab("id")).rejects.toThrow(
                TabServiceError,
            )
        })
    })

    describe("addTransaction", () => {
        it("should throw a TabServiceError if the tab does not exist in the repository", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            mockTabRepository.getTab.mockResolvedValue(null)

            const transaction = {
                paidBy: "",
                amount: 0,
                owedBy: { "": 0 },
            }

            // Act & Assert
            expect(() =>
                service.addTransaction("id", transaction),
            ).rejects.toThrow(TabServiceError)
        })

        it("should update the tab with the transaction if it does exist", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            mockTabRepository.getTab.mockResolvedValue(
                new TabDTO("existing-tab", ["user1", "user2", "user3"], []),
            )

            // Act
            const result = service.addTransaction("id", {
                paidBy: "user1",
                amount: 10,
                owedBy: { user2: 10 },
            })

            // Assert
            result.then(() => {
                expect(mockTabRepository.updateTab).toHaveBeenCalledWith(
                    "id",
                    new TabDTO(
                        "existing-tab",
                        ["user1", "user2", "user3"],
                        [new TransactionDTO("user1", 10, { user2: 10 })],
                    ),
                )
            })
        })
    })
})

