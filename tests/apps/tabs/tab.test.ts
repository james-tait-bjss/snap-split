// import { randomUUID } from "crypto"
// import { Tab } from "../../../src/apps/tabs/service"

// const user1 = randomUUID()
// const user2 = randomUUID()
// const user3 = randomUUID()

// const users: string[] = [user1, user2, user3]

// describe("new Tab", () => {
//     it("should set the name correctly", () => {
//         expect(new Tab("foobar", []).name).toBe("foobar")
//     })

//     it("should have one balance entry for each user", () => {
//         expect(new Tab("", users).getBalances().size).toBe(users.length)
//     })

//     it("should have a balance of zero for each user", () => {
//         const tab = new Tab("", users)
//         expect(tab.getBalances().get(user1)).toBe(0)
//         expect(tab.getBalances().get(user2)).toBe(0)
//         expect(tab.getBalances().get(user3)).toBe(0)
//     })
// })

// describe("getBalances", () => {

// })

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

//     it("should add the remainder to the correct users when the transaction doesn't divide the number of users", () => {
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