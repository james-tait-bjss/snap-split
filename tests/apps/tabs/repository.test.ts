import { Volume } from "memfs"
import { TabRepository } from "../../../src/apps/tabs/repository"
import fileDatabaseFactory from "../../../src/libraries/db/file"

describe("TabRepository.getTab", () => {
    it("should return undefined if record does not exist", () => {
        const repo = repoFromJSON({})
        
        expect(repo.getTab("id")).toStrictEqual(undefined) 
    })

    it("should return the record if it exists", () => {
        const record = {
            "name": "new_tab",
            "balances": {"user1": 20, "user2": 40}
        }

        const repo = repoFromJSON({"id": record})
        
        expect(repo.getTab("id")).toStrictEqual(record) 
    })
})

describe("TabRepository.newTab", () => {
    it("should create a new tab with random id and return the id", () => {
        const repo = repoFromJSON({})

        const record = {
            "name": "new_tab",
            "balances": {"user1": 20, "user2": 40}
        }

        const id = repo.newTab(record["name"], record["balances"])

        expect(repo["db"].get(id)).toStrictEqual(record)
    })
})

function repoFromJSON(json: object): TabRepository {
        const vol = Volume.fromJSON({
            "/file.db": JSON.stringify(json)
        })
        const db = fileDatabaseFactory("/file.db", vol)
        const repo = new TabRepository(db)

        return repo
}