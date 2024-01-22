import {
    TabDTO,
    TransactionDTO,
} from "../../../../src/apps/tabs/repository/dto"
import { TabConverter } from "../../../../src/apps/tabs/service/converter"
import { Tab } from "../../../../src/apps/tabs/service/tab"

describe("TabConverter", () => {
    describe("fromDTO", () => {
        it("should convert TabDTO to Tab", () => {
            // Arrange
            const transactions = [
                new TransactionDTO("user1", 10, { user2: 5, user3: 5 }),
                new TransactionDTO("user2", 10, { user3: 10 }),
            ]
            const tabDTO = new TabDTO(
                "new-tab",
                ["user1", "user2", "user3"],
                transactions,
            )

            // Act
            const result = TabConverter.fromDTO(tabDTO)

            // Assert
            expect(result.name).toBe("new-tab")
            expect(result.getBalances().get("user1")).toBe(10)
            expect(result.getBalances().get("user2")).toBe(5)
            expect(result.getBalances().get("user3")).toBe(-15)
            expect(result.getTransactions().length).toBe(2)
        })
    })

    describe("toDTO", () => {
        // Arrange
        const tab = new Tab("new-tab", ["user1", "user2", "user3"])
        tab.addTransaction({
            paidBy: "user1",
            amount: 10,
            owedBy: new Map([
                ["user2", 5],
                ["user3", 5],
            ]),
        })
        tab.addTransaction({
            paidBy: "user2",
            amount: 10,
            owedBy: new Map([["user3", 10]]),
        })

        // Act
        const result = TabConverter.toDTO(tab)

        // Assert
        expect(result.name).toBe("new-tab")
        expect(result.users).toStrictEqual(["user1", "user2", "user3"])
        expect(result.transactions).toStrictEqual([
            new TransactionDTO("user1", 10, { user2: 5, user3: 5 }),
            new TransactionDTO("user2", 10, { user3: 10 }),
        ])
    })
})
