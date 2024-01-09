import { randomUUID } from "crypto"
import { TabRepository, TabService } from "../../../../src/apps/tabs/service/service"
import { TabServiceError } from "../../../../src/apps/tabs/service/errors"
import { TabDTO } from "../../../../src/apps/tabs/repository/dto"

class MockTabRepository implements TabRepository{
    public tabs = new Map<string, TabDTO>()

    newTab(dto: TabDTO): string {
        const id = randomUUID()
        this.tabs.set(id, dto)
        return id
    }

    getTab(id: string): TabDTO | undefined {
        return this.tabs.get(id)
    }

    deleteTab(id: string): void {
        this.tabs.delete(id)
    }

    updateTab(id: string, dto: TabDTO): void {
        this.tabs.set(id, dto)
    }
}

describe("TabService.newTab", () => {
    it("should create a new tab with the given name and balances set to zero", () => {
        const mock = new MockTabRepository()
        const service = new TabService(mock)

        const id = service.newTab("new_tab", ["user1", "user2", "user3"])

        expect(
            mock.getTab(id)
        ).toStrictEqual(
                new TabDTO(
                    "new_tab", 
                    {
                        "user1": 0,
                        "user2": 0,
                        "user3": 0,
                    }
                )
            )
    })
})

describe("TabService.getTab", () => {
    it("should return the tab as an object if it exists", () => {
        const mock = new MockTabRepository()
        const id = mock.newTab(new TabDTO("new_tab", {"user1": 0, "user2": 0}))
        const service = new TabService(mock)

        expect(
            service.getTab(id)
        ).toStrictEqual(
            new TabDTO(
                "new_tab",
                {
                    "user1": 0,
                    "user2": 0,
                }
            )
        )
    })

    it("should throw a TabServiceError if the tab does not exist in the repository", () => {
        const mock = new MockTabRepository()
        const service = new TabService(mock)

        expect(() => service.getTab("id")).toThrow(TabServiceError)
    })
})

describe("TabService.DeleteTab", () => {
    it("should delete the tab if it exists", () => {
        const mock = new MockTabRepository()
        const id = mock.newTab(new TabDTO("new_tab", {"user1": 0, "user2": 0}))
        const service = new TabService(mock)

        service.deleteTab(id)

        expect(mock.getTab(id)).toStrictEqual(undefined)
    })

    it("should throw a TabServiceError if the tab does not exist in the repository", () => {
        const mock = new MockTabRepository()
        const service = new TabService(mock)

        expect(() => service.deleteTab("id")).toThrow(TabServiceError)
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