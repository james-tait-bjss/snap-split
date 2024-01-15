import { TabDTO } from "../repository/dto"
import { TabConverter } from "./converter"
import { tabNotExistError } from "./errors"

export interface TabRepository {
    newTab(dto: TabDTO): Promise<string>
    getTab(id: string): Promise<TabDTO | null>
    deleteTab(id: string): void
    updateTab(id: string, dto: TabDTO): void
}

export class TabService {
    constructor(private readonly tabRepository: TabRepository) {}

    async newTab(name: string, users: string[]): Promise<string> {
        const tab = new Tab(name, users)

        return await this.tabRepository.newTab(TabConverter.toDTO(tab))
    }

    async getTab(id: string): Promise<object> {
        const tab = await this.tabRepository.getTab(id)

        if (tab === null) {
            throw tabNotExistError(id)
        }

        return tab
    }

    async deleteTab(id: string) {
        const tab = await this.tabRepository.getTab(id)

        if (tab === null) {
            throw tabNotExistError(id)
        }

        this.tabRepository.deleteTab(id)
    }

    async addTransaction(id: string, amount: number, involvedUsers: string[]) {
        const tabDTO = await this.tabRepository.getTab(id)

        if (tabDTO === null) {
            throw tabNotExistError(id)
        }

        const tab = TabConverter.fromDTO(tabDTO)
        tab.addTransactionWithEqualSplit(amount, involvedUsers)
        this.tabRepository.updateTab(id, TabConverter.toDTO(tab))
    }
}

export class Tab {
    private balances: Map<string, number>

    constructor(
        public name: string,
        users: string[],
    ) {
        this.balances = new Map<string, number>()

        for (const user of users) {
            this.balances.set(user, 0)
        }
    }

    public static fromBalances(
        name: string,
        balances: Map<string, number>,
    ): Tab {
        const tab = new Tab(name, [])

        for (const [userID, balance] of balances) {
            tab.balances.set(userID, balance)
        }

        return tab
    }

    getBalances(): Map<string, number> {
        return new Map(this.balances)
    }

    addUser(userID: string) {
        this.balances.set(userID, 0)
    }

    addTransactionWithEqualSplit(amount: number, involvedUsers: string[]) {
        this.validateTransactionInput(amount, involvedUsers)

        const remainder = amount % involvedUsers.length
        const equalSplit = Math.floor(amount / involvedUsers.length)

        let numIncreases = 0
        const newBalances = new Map<string, number>(this.balances)

        for (const userID of involvedUsers) {
            const currBalance = this.getBalance(userID)

            if (numIncreases < remainder) {
                newBalances.set(userID, currBalance + equalSplit + 1)
                numIncreases++
            } else {
                newBalances.set(userID, currBalance + equalSplit)
            }
        }

        this.balances = newBalances
    }

    private validateTransactionInput(amount: number, involvedUsers: string[]) {
        if (isNaN(amount) || amount <= 0) {
            throw new Error(
                "Transaction amount should be a valid number greater than zero",
            )
        }

        if (involvedUsers.length === 0) {
            throw new Error("Must have at least one involved user")
        }
    }

    private getBalance(userID: string): number {
        const balance = this.balances.get(userID)
        if (balance === undefined) {
            throw new Error("User not found in tab")
        }
        return balance
    }
}
