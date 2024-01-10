import { Volume } from "memfs"
import {
    TabData,
    TabRepository,
} from "../../../../src/apps/tabs/repository/repository"
import fileDatabaseFactory from "../../../../src/libraries/db/file"
import { TabDTO } from "../../../../src/apps/tabs/repository/dto"

describe("TabRepository.getTab", () => {
    it("should return undefined if record does not exist", () => {
        const repo = repoFromJSON({})

        expect(repo.getTab("id")).toStrictEqual(undefined)
    })

    it("should return the record if it exists", () => {
        const record = {
            name: "new_tab",
            balances: { user1: 20, user2: 40 },
        }

        const repo = repoFromJSON({ id: record })

        expect(repo.getTab("id")).toStrictEqual(
            new TabDTO(record.name, record.balances),
        )
    })
})

describe("TabRepository.newTab", () => {
    it("should create a new tab with random id and return the id", () => {
        const repo = repoFromJSON({})

        const record = {
            name: "new_tab",
            balances: { user1: 20, user2: 40 },
        }

        const id = repo.newTab(new TabDTO(record.name, record.balances))

        expect(repo["db"].get(id)).toStrictEqual(record)
    })
})

describe("TabRepository.deleteTab", () => {
    it("should delete a tab if one exists with that id", () => {
        const record = {
            name: "new_tab",
            balances: { user1: 20, user2: 40 },
        }

        const repo = repoFromJSON({ id: record })

        repo.deleteTab("id")

        expect(repo["db"].get("id")).toStrictEqual(undefined)
    })

    it("should do nothing if no tab exists with that id", () => {
        const repo = repoFromJSON({})

        repo.deleteTab("id")

        expect(repo["db"].get("id")).toStrictEqual(undefined)
    })
})

function repoFromJSON(json: object): TabRepository {
    const vol = Volume.fromJSON({
        "/file.db": JSON.stringify(json),
    })
    const db = fileDatabaseFactory<TabData>("/file.db", vol)
    const repo = new TabRepository(db)

    return repo
}
