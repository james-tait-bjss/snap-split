import { TabDTO } from "../../../../src/apps/tabs/repository/dto"
import { TabServiceError } from "../../../../src/apps/tabs/service/errors"
import {
    TabConverter,
    TabFactory,
    TabRepository,
    TabService,
} from "../../../../src/apps/tabs/service/service"
import { Tab } from "../../../../src/apps/tabs/service/tab"
import { UserFactory } from "../../../../src/apps/tabs/service/user"

describe("TabService", () => {
    let mockTabRepository: jest.Mocked<TabRepository>
    let mockTabConverter: jest.Mocked<TabConverter>
    let mockTabFactory: jest.Mocked<TabFactory>

    beforeEach(() => {
        mockTabRepository = {
            newTab: jest.fn(),
            getTab: jest.fn(),
            deleteTab: jest.fn(),
            updateTab: jest.fn(),
        } as jest.Mocked<TabRepository>

        mockTabConverter = {
            fromDTO: jest.fn(),
            toDTO: jest.fn(),
        } as jest.Mocked<TabConverter>

        mockTabFactory = {
            createTab: jest.fn(),
        } as jest.Mocked<TabFactory>
    })

    describe("newTab", () => {
        it("should create a new tab with the given name and balances set to zero", () => {
            // Arrange
            const service = new TabService(
                mockTabRepository,
                mockTabFactory,
                mockTabConverter,
            )

            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            const returnedFromFactory = new Tab(name, users, new UserFactory())
            mockTabFactory.createTab.mockReturnValue(returnedFromFactory)

            const returnedFromConverter = new TabDTO(name, users, [])
            mockTabConverter.toDTO.mockReturnValue(returnedFromConverter)

            const expectedID = "uuid"
            mockTabRepository.newTab.mockResolvedValue(expectedID)

            // Act
            const id = service.newTab(name, users)

            // Assert
            expect(mockTabFactory.createTab).toHaveBeenCalledWith(name, users)
            expect(mockTabConverter.toDTO).toHaveBeenCalledWith(
                returnedFromFactory,
            )
            expect(mockTabRepository.newTab).toHaveBeenCalledWith(
                returnedFromConverter,
            )
            expect(id).resolves.toBe(expectedID)
        })
    })

    describe("getTab", () => {
        it("should return the tab as an object if repository returns it", () => {
            // Arrange
            const service = new TabService(
                mockTabRepository,
                mockTabFactory,
                mockTabConverter,
            )
            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            const returnedFromRepository = new TabDTO(name, users, [])
            mockTabRepository.getTab.mockResolvedValue(returnedFromRepository)

            const returnedFromConverter = new Tab(
                name,
                users,
                new UserFactory(),
            )
            mockTabConverter.fromDTO.mockReturnValue(returnedFromConverter)

            // Act
            const result = service.getTab("id")

            // Assert
            result.then((returnedTabDTO) => {
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

                expect(mockTabRepository.getTab).toHaveBeenCalledWith("id")
                expect(mockTabConverter.fromDTO).toHaveBeenCalledWith(
                    returnedFromRepository,
                )
            })
        })

        it("should throw a TabServiceError if the tab does not exist in the repository", () => {
            // Arrange
            const service = new TabService(
                mockTabRepository,
                mockTabFactory,
                mockTabConverter,
            )

            mockTabRepository.getTab.mockResolvedValue(null)

            // Act & Assert
            expect(() => service.getTab("id")).rejects.toThrow(TabServiceError)
        })
    })

    describe("deleteTab", () => {
        it("should delete the tab if it exists", () => {
            // Arrange
            const service = new TabService(
                mockTabRepository,
                mockTabFactory,
                mockTabConverter,
            )

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
            const service = new TabService(
                mockTabRepository,
                mockTabFactory,
                mockTabConverter,
            )

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
            const service = new TabService(
                mockTabRepository,
                mockTabFactory,
                mockTabConverter,
            )

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

        // TODO: Complete when the Tab is mocked in the TabService
        // it("should update the tab with the transaction if it does exist", () => {
        //     // Arrange
        //     const service = new TabService(mockTabRepository, mockTabFactory, mockTabConverter)

        //     const returnedFromRepository = new TabDTO("existing-tab", ["user1", "user2", "user3"], [])
        //     mockTabRepository.getTab.mockResolvedValue(
        //         returnedFromRepository
        //     )

        //     const returnedFromDTO = new Tab("existing-tab", ["user1", "user2", "user3"], new UserFactory())
        //     mockTabConverter.fromDTO.mockReturnValue(returnedFromDTO)

        //     // TODO: Temporary until the Tab class is mocked out
        //     returnedFromDTO.addTransaction()

        //     const returnedToDTO

        //     const id = "id"

        //     // Act
        //     const result = service.addTransaction(id, {
        //         paidBy: "user1",
        //         amount: 10,
        //         owedBy: { user2: 10 },
        //     })

        //     // Assert
        //     result.then(() => {
        //         expect(mockTabRepository.getTab).toHaveBeenCalledWith(id)
        //         expect(mockTabConverter.fromDTO).toHaveBeenCalledWith(returnedFromRepository)
        //         expect(mockTabConverter.toDTO).toHaveBeenCalledWith()

        //         expect(mockTabRepository.updateTab).toHaveBeenCalledWith(
        //             "id",
        //             new TabDTO(
        //                 "existing-tab",
        //                 ["user1", "user2", "user3"],
        //                 [new TransactionDTO("user1", 10, { user2: 10 })],
        //             ),
        //         )
        //     })
        // })
    })
})
