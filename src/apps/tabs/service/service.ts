import { TabDTO, TransactionDTO } from "../repository/dto"
import { tabNotExistError } from "./errors"
import { Tab } from "./tab"

export interface TabRepository {
    newTab(dto: TabDTO): Promise<string>
    getTab(id: string): Promise<TabDTO | null>
    deleteTab(id: string): void
    updateTab(id: string, dto: TabDTO): void
}

export interface TabFactory {
    createTab(name: string, users: string[]): Tab
}

export type AddTransactionArgs = {
    paidBy: string
    amount: number
    owedBy: { [userID: string]: number }
}

export class TabService {
    constructor(
        private readonly tabRepository: TabRepository,
        private readonly tabFactory: TabFactory,
    ) {}

    async newTab(name: string, users: string[]): Promise<string> {
        const tab = this.tabFactory.createTab(name, users)
        const tabDTO = this.toDTO(tab)

        return await this.tabRepository.newTab(tabDTO)
    }

    async getTab(id: string): Promise<object> {
        const tabDTO = await this.tabRepository.getTab(id)

        if (tabDTO === null) {
            throw tabNotExistError(id)
        }

        const tab = this.fromDTO(tabDTO)

        // TODO: Extract this logic for unit testing
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

        const tab = this.fromDTO(tabDTO)

        tab.addTransaction({
            paidBy: transaction.paidBy,
            amount: transaction.amount,
            owedBy: new Map(Object.entries(transaction.owedBy)),
        })

        const updatedTabDTO = this.toDTO(tab)
        
        this.tabRepository.updateTab(id, updatedTabDTO)
    }

    private fromDTO(tabDTO: TabDTO): Tab {
        const tab = this.tabFactory.createTab(tabDTO.name, tabDTO.users)

        for (const transactionDTO of tabDTO.transactions) {
            tab.addTransaction({
                paidBy: transactionDTO.paidBy,
                amount: transactionDTO.amount,
                owedBy: new Map<string, number>(
                    Object.entries(transactionDTO.owedBy),
                ),
            })
        }

        return tab
    }

    private toDTO(tab: Tab): TabDTO {
        const transactionDTOs = tab.getTransactions().map((transaction) => {
            return new TransactionDTO(
                transaction.paidBy,
                transaction.amount,
                Object.fromEntries(transaction.owedBy),
            )
        })

        return new TabDTO(tab.name, tab.getUserIDs(), transactionDTOs)
    }
}
