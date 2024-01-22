import { TabDTO } from "../repository/dto"
import { TabConverter } from "./converter"
import { tabNotExistError } from "./errors"
import { TabFactory } from "./tab"
import { UserFactory } from "./user"

interface TabRepository {
    newTab(dto: TabDTO): Promise<string>
    getTab(id: string): Promise<TabDTO | null>
    deleteTab(id: string): void
    updateTab(id: string, dto: TabDTO): void
}

export type AddTransactionArgs = {
    paidBy: string
    amount: number
    owedBy: { [userID: string]: number }
}

export class TabService {
    private readonly tabFactory: TabFactory

    constructor(private readonly tabRepository: TabRepository) {
        this.tabFactory = new TabFactory(new UserFactory())
    }

    async newTab(name: string, users: string[]): Promise<string> {
        const tab = this.tabFactory.createTab(name, users)

        return await this.tabRepository.newTab(TabConverter.toDTO(tab))
    }

    async getTab(id: string): Promise<object> {
        const tabDTO = await this.tabRepository.getTab(id)

        if (tabDTO === null) {
            throw tabNotExistError(id)
        }

        const tab = TabConverter.fromDTO(tabDTO, this.tabFactory)

        const usersObject: {
            [userID: string]: {
                balance: number
                owedBy: { [userID: string]: number }
            }
        } = {}

        for (const [userID, user] of tab.getUsers().entries()) {
            usersObject[userID] = {
                balance: user.calculateBalance(),
                owedBy: Object.fromEntries(user.getOwedBy()),
            }
        }

        return {
            name: tab.name,
            users: usersObject,
        }
    }

    async deleteTab(id: string) {
        const tab = await this.tabRepository.getTab(id)

        if (tab === null) {
            throw tabNotExistError(id)
        }

        this.tabRepository.deleteTab(id)
    }

    async addTransaction(id: string, transaction: AddTransactionArgs) {
        const tabDTO = await this.tabRepository.getTab(id)

        if (tabDTO === null) {
            throw tabNotExistError(id)
        }

        const tab = TabConverter.fromDTO(tabDTO, this.tabFactory)

        tab.addTransaction({
            paidBy: transaction.paidBy,
            amount: transaction.amount,
            owedBy: new Map(Object.entries(transaction.owedBy)),
        })
        this.tabRepository.updateTab(id, TabConverter.toDTO(tab))
    }
}
