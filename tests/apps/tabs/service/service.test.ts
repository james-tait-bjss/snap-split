import {
    TabDTO,
    TransactionDTO,
} from "../../../../src/apps/tabs/repository/dto"
import { TabServiceError } from "../../../../src/apps/tabs/service/errors"
import {
    TabRepository,
    TabService,
} from "../../../../src/apps/tabs/service/service"

describe("TabService", () => {
    let mockTabRepository: jest.Mocked<TabRepository>

    beforeEach(() => {
        mockTabRepository = {
            newTab: jest.fn(),
            getTab: jest.fn(),
            deleteTab: jest.fn(),
            updateTab: jest.fn(),
        } as jest.Mocked<TabRepository>
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
                            user1: -10
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
})
