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

describe("get", () => {
    it("should retrieve an element that exists", () => {
        const json = {
            "/file.db": '{"hello": "world"}'
        }
        const vol = Volume.fromJSON(json)
        const fileDB = fileDatabaseFactory("/file.db", vol)

        expect(fileDB.get("hello")).toEqual("world") 
    })
    
    it("should return an undefined object if the element does not exist", () => {
        const vol = Volume.fromJSON({})
        const fileDB = fileDatabaseFactory("/file.db", vol)

        expect(fileDB.get("hello")).toEqual(undefined)
    })
})

describe("create", () => {
    it("should create a database entry if the key does not exist", () => {
        const vol = Volume.fromJSON({})
        const fileDB = fileDatabaseFactory("/file.db", vol)

        fileDB.create("foo", {"bar": "baz"})
        expect(fileDB.get("foo")).toEqual({"bar": "baz"})
    })

    it("should reject a creation if the key does exist", () => {
        const json = {
            "/file.db": '{"foo": {"bar": "baz"}}'
        }
        const vol = Volume.fromJSON(json)
        const fileDB = fileDatabaseFactory("/file.db", vol)

        expect(() => fileDB.create("foo", {"bar2": "baz2"})).toThrow(Error)
    })
})

describe("update", () => {
    it("should reject an update if the key does not exist", () => {
        const vol = Volume.fromJSON({})
        const fileDB = fileDatabaseFactory("/file.db", vol)

        expect(() => fileDB.update("foo", {"bar": "baz"})).toThrow(Error)
    })

    it("should update a record if the key does exist", () => {
        const json = {
            "/file.db": '{"foo": {"bar": "baz"}}'
        }
        const vol = Volume.fromJSON(json)
        const fileDB = fileDatabaseFactory("/file.db", vol)

        fileDB.update("foo", {"bar2": "baz2"})

        expect(fileDB.get("foo")).toEqual({"bar2": "baz2"})
    })
})

describe("delete", () => {
    it("should do nothing if the key does not exist", () => {
        const vol = Volume.fromJSON({})
        const fileDB = fileDatabaseFactory("/file.db", vol)

        fileDB.delete("foo")

        expect(fileDB.get("foo")).toEqual(undefined)
    })

    it("should delete a record if the key does exist", () => {
        const json = {
            "/file.db": '{"foo": {"bar": "baz"}}'
        }
        const vol = Volume.fromJSON(json)
        const fileDB = fileDatabaseFactory("/file.db", vol)

        fileDB.delete("foo")

        expect(fileDB.get("foo")).toEqual(undefined)
    })
})