import * as crypto from "crypto"
import { Volume } from "memfs"
import fileDatabaseFactory, {
    FileDatabase,
    FileSystem,
} from "../../../src/libraries/db/file"

jest.mock("crypto")

describe("FileDatabase", () => {
    let mockFileSystem: jest.Mocked<FileSystem>
    let mockRandomUUID: jest.Mock

    beforeEach(() => {
        mockFileSystem = {
            existsSync: jest.fn(),
            mkdirSync: jest.fn(),
            readFileSync: jest.fn(),
            writeFileSync: jest.fn(),
        } as jest.Mocked<FileSystem>

        mockRandomUUID = crypto.randomUUID as jest.Mock
    })

    describe("constructor", () => {
        it("should initialise the store from a file if one exists", () => {
            // Arrange
            mockFileSystem.existsSync.mockReturnValue(true)
            mockFileSystem.readFileSync.mockReturnValue(`{"hello": "world"}`)

            // Act
            const db = new FileDatabase(mockFileSystem, "path")

            // Assert
            expect(mockFileSystem.readFileSync).toHaveBeenCalledWith("path")
            expect(db["store"]).toEqual(
                new Map<string, string>([["hello", "world"]]),
            )
        })

        it("should initialise a blank store and write a new file if one doesn't exist", () => {
            // Arrange
            mockFileSystem.existsSync.mockReturnValue(false)

            // Act
            const db = new FileDatabase(mockFileSystem, "/path/to/db")

            // Assert
            expect(mockFileSystem.mkdirSync).toHaveBeenCalledWith("/path/to", {
                recursive: true,
            })
            expect(db["store"]).toEqual(new Map<string, string>())
            expect(mockFileSystem.writeFileSync).toHaveBeenCalledWith(
                "/path/to/db",
                "{}",
            )
        })
    })

    describe("create", () => {
        it("should create a database entry and return the new key", () => {
            // Arrange
            const vol = Volume.fromJSON({})
            const fileDB = fileDatabaseFactory("/file.db", vol)

            const generatedID = "id"
            mockRandomUUID.mockReturnValue(generatedID)

            // Act
            const result = fileDB.create({ bar: "baz" })

            // Assert
            expect(result).resolves.toBe(generatedID)
            expect(fileDB.get(generatedID)).resolves.toEqual({ bar: "baz" })
        })
    })

    describe("get", () => {
        it("should retrieve an element that exists", () => {
            // Arrange
            const json = {
                "/file.db": '{"hello": "world"}',
            }
            const vol = Volume.fromJSON(json)
            const fileDB = fileDatabaseFactory("/file.db", vol)

            // Act
            const result = fileDB.get("hello")

            // Assert
            expect(result).resolves.toBe("world")
        })

        it("should return an undefined object if the element does not exist", () => {
            // Arrange
            const vol = Volume.fromJSON({})
            const fileDB = fileDatabaseFactory("/file.db", vol)

            // Act
            const result = fileDB.get("hello")

            // Assert
            expect(result).resolves.toEqual(null)
        })
    })

    describe("update", () => {
        it("should reject an update if the key does not exist", () => {
            // Arrange
            const vol = Volume.fromJSON({})
            const fileDB = fileDatabaseFactory("/file.db", vol)

            // Act & Assert
            expect(() => fileDB.update("foo", { bar: "baz" })).toThrow(Error)
        })

        it("should update a record if the key does exist", () => {
            // Arrange
            const json = {
                "/file.db": '{"foo": {"bar": "baz"}}',
            }
            const vol = Volume.fromJSON(json)
            const fileDB = fileDatabaseFactory("/file.db", vol)

            // Act
            fileDB.update("foo", { bar2: "baz2" })

            // Assert
            expect(fileDB.get("foo")).resolves.toEqual({ bar2: "baz2" })
        })
    })

    describe("delete", () => {
        it("should do nothing if the key does not exist", () => {
            // Arrange
            const vol = Volume.fromJSON({})
            const fileDB = fileDatabaseFactory("/file.db", vol)

            // Act
            fileDB.delete("foo")

            // Assert
            expect(fileDB.get("foo")).resolves.toEqual(null)
        })

        it("should delete a record if the key does exist", () => {
            // Arrange
            const json = {
                "/file.db": '{"foo": {"bar": "baz"}}',
            }
            const vol = Volume.fromJSON(json)
            const fileDB = fileDatabaseFactory("/file.db", vol)

            // Act
            fileDB.delete("foo")

            // Assert
            expect(fileDB.get("foo")).resolves.toEqual(null)
        })
    })
})
