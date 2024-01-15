import { DatabaseService } from "../../db"
import { TabDTO } from "./dto"

export interface TabData {
    name: string
    balances: object
}

export class TabRepository {
    constructor(private readonly db: DatabaseService<string, TabData>) {}

    async getTab(id: string): Promise<TabDTO | null> {
        const tab: TabData | null = await this.db.get(id)

        if (tab === null) {
            return null
        }

        return new TabDTO(tab.name, tab.balances)
    }

    async newTab(dto: TabDTO): Promise<string> {
        const id = await this.db.create({
            name: dto.name,
            balances: dto.balances,
        })

        return id
    }

    async deleteTab(id: string) {
        this.db.delete(id)
    }

    async updateTab(id: string, dto: TabDTO) {
        this.db.update(id, {
            name: dto.name,
            balances: dto.balances,
        })
    }
}
