import Tab from "../../src/tab/tab"
import User from "../../src/tab/user"

const user1 = new User("joe", "bloggs")
const user2 = new User("foo", "bar")
const user3 = new User("baz", "ball")

const users: User[] = [user1, user2, user3]

describe("new Tab", () => {
    it("should set the name correctly", () => {
        expect(new Tab("foobar", []).name).toBe("foobar")
    })

    it("should have one balance entry for each user", () => {
        expect(new Tab("", users).balances.size).toBe(users.length)
    })

    it("should have a balance of zero for each user", () => {
        const tab = new Tab("", users)
        expect(tab.balances.get(user1.id)).toBe(0)
        expect(tab.balances.get(user2.id)).toBe(0)
        expect(tab.balances.get(user3.id)).toBe(0)
    })
})

describe("addTransactionWithEqualSplit", () => {
    it("should reject an invalid transaction amount", () => {
        const invalidTransactionAmountString = "Transaction amount should be a valid number greater than zero"
        const tab = new Tab("foobar", users)

        expect(() => tab.addTransactionWithEqualSplit(0,  Array.from(tab.balances.keys())))
        .toThrow(invalidTransactionAmountString)

        expect(() => tab.addTransactionWithEqualSplit(-1,  Array.from(tab.balances.keys())))
        .toThrow(invalidTransactionAmountString)

        expect(() => tab.addTransactionWithEqualSplit(NaN,  Array.from(tab.balances.keys())))
        .toThrow(invalidTransactionAmountString)
    })

    it("should reject an invalid users array", () => {
        const tab = new Tab("foobar", users)

        expect(() => tab.addTransactionWithEqualSplit(1, []))
        .toThrow("Must have at least one involved user")

        expect(() => tab.addTransactionWithEqualSplit(1,  ["fake-user"]))
        .toThrow("User was not found in tab")
    })

    it("should evenly distribute the transaction when it divides the number of users", () => {
        const tab = new Tab("foobar", users)

        tab.addTransactionWithEqualSplit(6, Array.from(tab.balances.keys()))

        expect(tab.balances.get(user1.id)).toBe(2)
        expect(tab.balances.get(user2.id)).toBe(2)
        expect(tab.balances.get(user3.id)).toBe(2)
    })

    it("should add the remainder to the correct users when the transaction doesn't divide the number of users", () => {
        const tab = new Tab("foobar", users)

        tab.addTransactionWithEqualSplit(8, Array.from(tab.balances.keys()))

        expect(tab.balances.get(user1.id)).toBe(3)
        expect(tab.balances.get(user2.id)).toBe(3)
        expect(tab.balances.get(user3.id)).toBe(2)
    })

    it("should only increase balance for included users", () => {
        const tab = new Tab("foobar", users)

        tab.addTransactionWithEqualSplit(4, [user1.id, user2.id])

        expect(tab.balances.get(user1.id)).toBe(2)
        expect(tab.balances.get(user2.id)).toBe(2)
        expect(tab.balances.get(user3.id)).toBe(0)
    })

})