import { User } from "../../../../src/apps/tabs/service/user"

describe("User", () => {
    describe("shouldPay", () => {
        it("should reduce the owedBy amount for unknown user that should be paid", () => {
            // Arrange
            const user = new User("id")

            // Act
            user.shouldPay("user2", 10)

            // Assert
            expect(user["owedBy"].get("user2")).toBe(-10)
        })

        it("should reduce the owedBy amount for known user that should be paid", () => {
            // Arrange
            const user = new User("id")
            user["owedBy"].set("user2", 10)

            // Act
            user.shouldPay("user2", 10)

            // Assert
            expect(user["owedBy"].get("user2")).toBe(0)
        })
    })

    describe("shouldBePaidBy", () => {
        it("should increase the owedBy amount for unknown user that owes", () => {
            // Arrange
            const user = new User("id")

            // Act
            user.shouldBePaidBy("user2", 10)

            // Assert
            expect(user["owedBy"].get("user2")).toBe(10)
        })

        it("should reduce the owedBy amount for known user that owes", () => {
            // Arrange
            const user = new User("id")
            user["owedBy"].set("user2", 10)

            // Act
            user.shouldBePaidBy("user2", 10)

            // Assert
            expect(user["owedBy"].get("user2")).toBe(20)
        })
    })

    describe("calculateBalance", () => {
        it("should correctly return the balance of the user", () => {
            // Arrange
            const user = new User("id")
            user["owedBy"].set("user2", 10)
            user["owedBy"].set("user3", 10)
            user["owedBy"].set("user4", -5)

            // Act
            const balance = user.calculateBalance()

            // Assert
            expect(balance).toBe(15)
        })
    })
})
