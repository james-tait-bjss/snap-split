import { TabDTO, TransactionDTO } from "../../../../src/apps/tabs/repository/dto"
import { TabServiceError } from "../../../../src/apps/tabs/service/errors"
import {
    TabFactory,
    TabRepository,
    TabService,
} from "../../../../src/apps/tabs/service/service"
import { Tab } from "../../../../src/apps/tabs/service/tab"
import { UserFactory } from "../../../../src/apps/tabs/service/user"

describe("TabService", () => {
    let mockTabRepository: jest.Mocked<TabRepository>
    let mockTabFactory: jest.Mocked<TabFactory>

    beforeEach(() => {
        mockTabRepository = {
            newTab: jest.fn(),
            getTab: jest.fn(),
            deleteTab: jest.fn(),
            updateTab: jest.fn(),
        } as jest.Mocked<TabRepository>

        mockTabFactory = {
            createTab: jest.fn(),
        } as jest.Mocked<TabFactory>
    })

    describe("newTab", () => {
        it("should create a new tab with the given name and balances set to zero", () => {
            // Arrange
            const service = new TabService(mockTabRepository, mockTabFactory)

            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            const returnedFromFactory = new Tab(name, users, new UserFactory())
            mockTabFactory.createTab.mockReturnValue(returnedFromFactory)

            const expectedID = "uuid"
            mockTabRepository.newTab.mockResolvedValue(expectedID)

            // Act
            const id = service.newTab(name, users)

            // Assert
            expect(mockTabFactory.createTab).toHaveBeenCalledWith(name, users)
            expect(mockTabRepository.newTab).toHaveBeenCalledWith(
                new TabDTO("new-tab", ["user1", "user2", "user3"], []),
            )
            expect(id).resolves.toBe(expectedID)
        })
    })

    describe("getTab", () => {
        it("should return the tab as an object if repository returns it", () => {
            // Arrange
            const service = new TabService(mockTabRepository, mockTabFactory)
            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            const returnedFromRepository = new TabDTO(name, users, [])
            mockTabRepository.getTab.mockResolvedValue(returnedFromRepository)

            const returnedFromFactory = new Tab(name, users, new UserFactory())
            mockTabFactory.createTab.mockReturnValue(returnedFromFactory)

            // Act
            const result = service.getTab("id")

            // Assert
            result.then((returnedTabDTO) => {
                expect(mockTabRepository.getTab).toHaveBeenCalledWith("id")
                expect(mockTabFactory.createTab).toHaveBeenCalledWith(
                    name,
                    users,
                )
                expect(returnedTabDTO).toStrictEqual({
                    name: "new-tab",
                    users: {
                        user1: {
                            balance: 0,
                            owedBy: {},
                        },
                        user2: {
                            balance: 0,
                            owedBy: {},
                        },
                        user3: {
                            balance: 0,
                            owedBy: {},
                        },
                    },
                })
            })
        })

        it("should throw a TabServiceError if the tab does not exist in the repository", () => {
            // Arrange
            const service = new TabService(mockTabRepository, mockTabFactory)

            mockTabRepository.getTab.mockResolvedValue(null)

            // Act & Assert
            expect(() => service.getTab("id")).rejects.toThrow(TabServiceError)
        })
    })

    describe("deleteTab", () => {
        it("should delete the tab if it exists", () => {
            // Arrange
            const service = new TabService(mockTabRepository, mockTabFactory)

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
            const service = new TabService(mockTabRepository, mockTabFactory)

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
            const service = new TabService(mockTabRepository, mockTabFactory)

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
            const service = new TabService(mockTabRepository, mockTabFactory)
            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            const returnedFromRepository = new TabDTO(name, users, [])
            mockTabRepository.getTab.mockResolvedValue(
                returnedFromRepository
            )

            const returnedFromFactory = new Tab(name, users, new UserFactory())
            mockTabFactory.createTab.mockReturnValue(returnedFromFactory)

            const id = "id"

            // Act
            const result = service.addTransaction(id, {
                paidBy: "user1",
                amount: 10,
                owedBy: { user2: 10 },
            })

            // Assert
            result.then(() => {
                expect(mockTabRepository.getTab).toHaveBeenCalledWith(id)
                expect(mockTabFactory.createTab).toHaveBeenCalledWith(name, users)

                expect(mockTabRepository.updateTab).toHaveBeenCalledWith(
                    "id",
                    new TabDTO(
                        name,
                        users,
                        [new TransactionDTO("user1", 10, { user2: 10 })],
                    ),
                )
            })
        })
    })
})
