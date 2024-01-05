import{ Volume } from "memfs"
import fileDatabaseFactory from "../../../src/libraries/db/file"

describe("fileDatabaseFactory", () => {
    it("should create an empty database file if one does not exist", () => {
        const vol = Volume.fromJSON({})
        
        void fileDatabaseFactory("/doesnt/exist.db", vol)

        expect(vol.toJSON()).toEqual({"/doesnt/exist.db" : "{}"})
    })

    it("should import database file if it does exist", () => {
        const json = {
            "/does/exist.db": '{"hello": "world"}'
        }
        const vol = Volume.fromJSON(json)

        const fileDB = fileDatabaseFactory("/does/exist.db", vol)

        // Using the public API here as there is no other way to test really
        expect(fileDB.get("hello")).toEqual("world")
    })
})