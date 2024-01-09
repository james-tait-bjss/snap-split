import { DatabaseService } from "../../db"
import { randomUUID } from "crypto"
import { TabDTO } from "./dto"

export interface TabData {
   name: string
   balances: object
}

export class TabRepository {
    constructor(private readonly db: DatabaseService<TabData>) { }

    getTab(id: string): TabDTO | undefined {
        const tab: TabData| undefined = this.db.get(id)

        if (tab === undefined) {
            return undefined
        }

        return new TabDTO(tab.name, tab.balances)
    }

    newTab(dto: TabDTO): string {
        const tabID = randomUUID()

        this.db.create(
            tabID,
            {
                "name": dto.name,
                "balances": dto.balances
            }
        )

        return tabID
    }

    deleteTab(id: string) {
        this.db.delete(id)
    }

    updateTab(id: string, dto: TabDTO) {
        this.db.update(
            id,
            {
                "name": dto.name,
                "balances": dto.balances
            }
        )
    }
}