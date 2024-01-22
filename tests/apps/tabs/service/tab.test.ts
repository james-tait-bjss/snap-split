import { TabFactory, UserFactory } from "../../../../src/apps/tabs/service/tab"
import { User } from "../../../../src/apps/tabs/service/user"

describe("TabFactory", () => {
    let mockUserFactory: jest.Mocked<UserFactory>

    beforeEach(() => {
        mockUserFactory = {
            createUser: jest.fn(),
        } as jest.Mocked<UserFactory>
    })

    describe("createTab", () => {
        it("should create a new tab with no transactions and all the users added", () => {
            // Arrange
            const factory = new TabFactory(mockUserFactory)

            const name = "new-tab"
            const users = ["user1", "user2", "user3"]

            mockUserFactory.createUser.mockImplementation((id): User => {
                return new User(id)
            })

            // Act
            const tab = factory.createTab(name, users)

            // Assert
            expect(tab.name).toBe(name)
            expect(tab.getTransactions().length).toBe(0)
            expect(tab.getUserIDs()).toStrictEqual(users)
        })

        it("should call createUser method for each user", () => {
            // Arrange
            const factory = new TabFactory(mockUserFactory);

            const name = "new-tab";
            const users = ["user1", "user2", "user3"];

            mockUserFactory.createUser.mockImplementation((id): User => {
                return new User(id);
            });

            // Act
            factory.createTab(name, users);

            // Assert
            expect(mockUserFactory.createUser).toHaveBeenCalledTimes(users.length);
            users.forEach((user) => {
                expect(mockUserFactory.createUser).toHaveBeenCalledWith(user);
            });
        });
    })
})
