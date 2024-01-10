import { TabDTO } from "../repository/dto"
import { TabConverter } from "./converter"
import { tabNotExistError } from "./errors"

export interface TabRepository {
    newTab(dto: TabDTO): string
    getTab(id: string): TabDTO | undefined
    deleteTab(id: string): void
    updateTab(id: string, dto: TabDTO): void
}

export class TabService {
    constructor(private readonly tabRepository: TabRepository) {}

    newTab(name: string, users: string[]): string {
        const tab = new Tab(name, users)

        return this.tabRepository.newTab(TabConverter.toDTO(tab))
    }

    getTab(id: string): object {
        const tab = this.tabRepository.getTab(id)

        if (tab === undefined) {
            throw tabNotExistError(id)
        }

        return tab
    }

    deleteTab(id: string) {
        const tab = this.tabRepository.getTab(id)

        if (tab === undefined) {
            throw tabNotExistError(id)
        }

        this.tabRepository.deleteTab(id)
    }

    addTransaction(id: string, amount: number, involvedUsers: string[]) {
        const tabDTO = this.tabRepository.getTab(id)

        if (tabDTO === undefined) {
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
