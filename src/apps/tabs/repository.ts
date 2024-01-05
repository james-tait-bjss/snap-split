import { DatabaseService } from "../db"
import { randomUUID } from "crypto"

export class TabRepository {
    constructor(private readonly db: DatabaseService) { }

    getTabs() { }

    getTab(id: string): object | undefined {
        const tab = this.db.get(id)

        return tab
    }


    newTab(name: string, balances: object): string {
        const tabID = randomUUID()

        this.db.create(
            tabID,
            {
                "name": name,
                "balances": balances
            }
        )

        return tabID
    }
}