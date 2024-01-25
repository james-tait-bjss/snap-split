import {
    Tab,
    TabFactory,
    UserFactory,
} from "../../../../src/apps/tabs/service/tab"
import { User } from "../../../../src/apps/tabs/service/user"

describe("TabFactory", () => {
    let mockUserFactory: jest.Mocked<UserFactory>

    beforeEach(() => {
        mockUserFactory = {
            createUser: jest.fn(),
        } as jest.Mocked<UserFactory>

        mockUserFactory.createUser.mockImplementation((id): User => {
            return new User(id)
        })
    })

    describe("createTab", () => {
        it("should create a new tab with no transactions and all the users added", () => {
            // Arrange
            const factory = new TabFactory(mockUserFactory)

            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            // Act
            const tab = factory.createTab(name, users)

            // Assert
            expect(tab.name).toBe(name)
            expect(tab.getTransactions().length).toBe(0)
            expect(tab.getUserIDs()).toStrictEqual(users)
        })

        it("should call createUser method for each user", () => {
            // Arrange
            const factory = new TabFactory(mockUserFactory)

            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            // Act
            factory.createTab(name, users)

            // Assert
            expect(mockUserFactory.createUser).toHaveBeenCalledTimes(
                users.length,
            )
            users.forEach((user) => {
                expect(mockUserFactory.createUser).toHaveBeenCalledWith(user)
            })
        })

        it("should throw error if user id duplicated", () => {
            // Arrange
            const factory = new TabFactory(mockUserFactory)

            const name = "new-tab"
            const users = ["user1", "user2", "user2"]

            // Act & Assert
            expect(() => factory.createTab(name, users)).toThrow(Error)
        })
    })
})

describe("Tab", () => {
    let mockUserFactory: jest.Mocked<UserFactory>

    beforeEach(() => {
        mockUserFactory = {
            createUser: jest.fn(),
        } as jest.Mocked<UserFactory>

        mockUserFactory.createUser.mockImplementation((id): User => {
            return new User(id)
        })
    })

    describe("getBalances", () => {
        it("should return each user's balance", () => {
            // Arrange
            const tab = new Tab(
                "tab-name",
                ["user1", "user2", "user3"],
                mockUserFactory,
            )

            // Act
            const balances = tab.getBalances()

            // Assert
            const expectedMap = new Map<String, number>([
                ["user1", 0],
                ["user2", 0],
                ["user3", 0],
            ])
            expect(balances).toStrictEqual(expectedMap)
        })
    })

    describe("addTransaction", () => {
        it("should throw an error if the paying user does not exist", () => {
            // Arrange
            const tab = new Tab("tab-name", ["user1"], mockUserFactory)

            const transaction = {
                paidBy: "not-exist",
                amount: 10,
                owedBy: new Map<string, number>([["", 0]]),
            }

            // Act & Assert
            expect(() => tab.addTransaction(transaction)).toThrow(Error)
        })

        it("should throw an error if an owing user does not exist", () => {
            // Arrange
            const tab = new Tab("tab-name", ["user1", "user2"], mockUserFactory)

            const transaction = {
                paidBy: "user1",
                amount: 10,
                owedBy: new Map<string, number>([["not-exist", 0]]),
            }

            // Act & Assert
            expect(() => tab.addTransaction(transaction)).toThrow(Error)
        })

        it("should add a transaction and update user balances", () => {
            // Arrange
            const tab = new Tab("tab-name", ["user1", "user2"], mockUserFactory)
            const transaction = {
                paidBy: "user1",
                amount: 10,
                owedBy: new Map<string, number>([["user2", 10]]),
            }

            // Act
            tab.addTransaction(transaction)

            // Assert
            expect(tab.getTransactions()).toStrictEqual([transaction])

            const balances = tab.getBalances()
            expect(balances.get("user1")).toBe(10)
            expect(balances.get("user2")).toBe(-10)
        })
    })
})
