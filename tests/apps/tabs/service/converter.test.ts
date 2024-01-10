import { TabDTO } from "../../../../src/apps/tabs/repository/dto"
import { TabConverter } from "../../../../src/apps/tabs/service/converter"
import { Tab } from "../../../../src/apps/tabs/service/service"

describe("TabConverter", () => {
    describe("fromDTO", () => {
        it("should convert TabDTO to Tab", () => {
            // Arrange
            const tabDTO = new TabDTO("new-tab", {"user1": 10, "user2": 20})

            // Act
            const result = TabConverter.fromDTO(tabDTO)

            // Assert
            expect(result.name).toBe("new-tab")
            expect(result.getBalances().get("user1")).toBe(10)
            expect(result.getBalances().get("user2")).toBe(20)
        })
    })

    describe("toDTO", () => {
        // Arrange
        const initialBalances = new Map<string, number>()
        initialBalances.set("user1", 10)
        initialBalances.set("user2", 20)

        const tab = Tab.fromBalances("new-tab", initialBalances)

        // Act
        const result = TabConverter.toDTO(tab)

        // Assert
        expect(result.name).toBe("new-tab")
        expect(result.balances).toStrictEqual({
            "user1": 10,
            "user2": 20
        })
    })
})
