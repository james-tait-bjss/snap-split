import { TabDTO } from "../../../../src/apps/tabs/repository/dto"
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
                new TabDTO("new-tab", {
                    user1: 0,
                    user2: 0,
                    user3: 0,
                }),
            )

            expect(id).resolves.toBe(expectedID)
        })
    })

    describe("getTab", () => {
        it("should return the tab as an object if repository returns it", () => {
            // Arrange
            const service = new TabService(mockTabRepository)

            const existingTabDTO = new TabDTO("new-tab", { user1: 0, user2: 0 })
            mockTabRepository.getTab.mockResolvedValue(existingTabDTO)

            // Act
            const returnedTabDTO = service.getTab("id")

            // Assert
            expect(mockTabRepository.getTab).toHaveBeenCalledWith("id")
            expect(returnedTabDTO).resolves.toBe(existingTabDTO)
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

            mockTabRepository.getTab.mockResolvedValue(new TabDTO("name", {}))

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
            expect(() => service.deleteTab("id")).rejects.toThrow(TabServiceError)
        })
    })
})

// describe("addTransactionWithEqualSplit", () => {
//     it("should reject an invalid transaction amount", () => {
//         const invalidTransactionAmountString = "Transaction amount should be a valid number greater than zero"
//         const tab = new Tab("foobar", users)

//         expect(() => tab.addTransactionWithEqualSplit(0,  Array.from(tab.getBalances().keys())))
//         .toThrow(invalidTransactionAmountString)

//         expect(() => tab.addTransactionWithEqualSplit(-1,  Array.from(tab.getBalances().keys())))
//         .toThrow(invalidTransactionAmountString)

//         expect(() => tab.addTransactionWithEqualSplit(NaN,  Array.from(tab.getBalances().keys())))
//         .toThrow(invalidTransactionAmountString)
//     })

//     it("should reject an invalid users array", () => {
//         const tab = new Tab("foobar", users)

//         expect(() => tab.addTransactionWithEqualSplit(1, []))
//         .toThrow("Must have at least one involved user")

//         expect(() => tab.addTransactionWithEqualSplit(1,  ["fake-user"]))
//         .toThrow("User not found in tab")
//     })

//     it("should evenly distribute the transaction when it divides the number of users", () => {
//         const tab = new Tab("foobar", users)

//         tab.addTransactionWithEqualSplit(6, Array.from(tab.getBalances().keys()))

//         expect(tab.getBalances().get(user1)).toBe(2)
//         expect(tab.getBalances().get(user2)).toBe(2)
//         expect(tab.getBalances().get(user3)).toBe(2)
//     })

//     it("should add the remainder to the correct users when the transaction doesn't divide the number of users",
//       () => {
//         const tab = new Tab("foobar", users)

//         tab.addTransactionWithEqualSplit(8, Array.from(tab.getBalances().keys()))

//         expect(tab.getBalances().get(user1)).toBe(3)
//         expect(tab.getBalances().get(user2)).toBe(3)
//         expect(tab.getBalances().get(user3)).toBe(2)
//     })

//     it("should only increase balance for included users", () => {
//         const tab = new Tab("foobar", users)

//         tab.addTransactionWithEqualSplit(4, [user1, user2])

//         expect(tab.getBalances().get(user1)).toBe(2)
//         expect(tab.getBalances().get(user2)).toBe(2)
//         expect(tab.getBalances().get(user3)).toBe(0)
//     })
// })
