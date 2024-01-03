import User from "../../../../src/app/services/tab/user"

const generatedUUID = "uuid"

jest.mock("crypto", () => {
    return {
        randomUUID: jest.fn(() => {
            return generatedUUID
        }),
    }
})

describe("new User", () => {
    it("should set the firstName", () => {
        expect(new User("joe", "").firstName).toBe("joe")
    })
    
    it("should set the secondName", () => {
        expect(new User("", "bloggs").lastName).toBe("bloggs")
    })

    test("should set id using crypto.randomUUID", () => {
        expect(new User("", "").id).toBe(generatedUUID)
    })
})