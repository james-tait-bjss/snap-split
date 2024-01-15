import { DatabaseService } from "../../../../src/apps/db"
import { TabDTO } from "../../../../src/apps/tabs/repository/dto"
import {
    TabData,
    TabRepository,
} from "../../../../src/apps/tabs/repository/repository"

describe("TabRepository", () => {
    let mockDatabaseService: jest.Mocked<DatabaseService<string, TabData>>

    beforeEach(() => {
        mockDatabaseService = {
            create: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as jest.Mocked<DatabaseService<string, TabData>>
    })

    describe("getTab", () => {
        it("should return null if record does not exist", () => {
            // Arrange
            const repo = new TabRepository(mockDatabaseService)

            mockDatabaseService.get.mockResolvedValue(null)

            // Act
            const result = repo.getTab("id")

            // Assert
            expect(result).resolves.toBe(null)
            expect(mockDatabaseService.get).toHaveBeenCalledWith("id")
        })

        it("should return the record if it exists", () => {
            // Arrange
            const repo = new TabRepository(mockDatabaseService)

            const recordInDB = {
                name: "new_tab",
                balances: { user1: 20, user2: 40 },
            }
            mockDatabaseService.get.mockResolvedValue(recordInDB)

            // Act
            const result = repo.getTab("id")

            // Assert
            expect(result).resolves.toEqual(recordInDB)
            expect(mockDatabaseService.get).toHaveBeenCalledWith("id")
        })
    })

    describe("newTab", () => {
        it("should create a new tab with random id and return the id", () => {
            // Arrange
            const repo = new TabRepository(mockDatabaseService)

            const createdID = "id"
            mockDatabaseService.create.mockResolvedValue(createdID)

            // Act
            const result = repo.newTab(
                new TabDTO("new-tab", { user1: 20, user2: 40 }),
            )

            // Assert
            expect(result).resolves.toBe(createdID)
            expect(mockDatabaseService.create).toHaveBeenCalledWith({
                name: "new-tab",
                balances: { user1: 20, user2: 40 },
            })
        })
    })

    describe("deleteTab", () => {
        it("should delete a tab if one exists with that id", () => {
            // Arrange
            const repo = new TabRepository(mockDatabaseService)

            // Act
            repo.deleteTab("id").then(() => {
                // Assert
                expect(mockDatabaseService.delete).toHaveBeenCalledWith("id")
            })
        })
    })
})
