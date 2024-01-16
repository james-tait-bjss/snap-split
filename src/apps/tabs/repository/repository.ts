import { DatabaseService } from "../../db"
import { TabDTO, TransactionDTO } from "./dto"

export interface TabData {
    name: string
    users: string[]
    transactions: TransactionData[]
}

export interface TransactionData {
    paidBy: string
    amount: number
    owedBy: { [userID: string]: number }
}

export class TabRepository {
    constructor(private readonly db: DatabaseService<string, TabData>) {}

    async getTab(id: string): Promise<TabDTO | null> {
        const tab: TabData | null = await this.db.get(id)

        if (tab === null) {
            return null
        }

        const transactionDTOs = tab.transactions.map((transactionData) => {
            return new TransactionDTO(
                transactionData.paidBy,
                transactionData.amount,
                transactionData.owedBy,
            )
        })

        return new TabDTO(tab.name, tab.users, transactionDTOs)
    }

    async newTab(dto: TabDTO): Promise<string> {
        const id = await this.db.create({
            name: dto.name,
            users: dto.users,
            transactions: dto.transactions,
        })

        return id
    }

    async deleteTab(id: string) {
        this.db.delete(id)
    }

    async updateTab(id: string, dto: TabDTO) {
        this.db.update(id, {
            name: dto.name,
            users: dto.users,
            transactions: dto.transactions,
        })
    }
}
