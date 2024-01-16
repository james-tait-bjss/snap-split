import { TabDTO } from "../repository/dto"
import { TabConverter } from "./converter"
import { tabNotExistError } from "./errors"
import { Transaction } from "./transaction"
import { User } from "./user"

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

    async addTransaction(id: string, transaction: Transaction) {
        const tabDTO = await this.tabRepository.getTab(id)

        if (tabDTO === null) {
            throw tabNotExistError(id)
        }

        const tab = TabConverter.fromDTO(tabDTO)

        transaction.owedBy = new Map(Object.entries(transaction.owedBy))

        tab.addTransaction(transaction)
        this.tabRepository.updateTab(id, TabConverter.toDTO(tab))
    }
}

export class Tab {
    private users: Map<string, User>
    private transactions: Transaction[]

    constructor(
        public name: string,
        users: string[],
    ) {
        this.transactions = []
        this.users = new Map<string, User>()
        for (const name of users) {
            this.addUser(name)
        }
    }

    public getTransactions(): Transaction[] {
        return this.transactions
    }

    public getBalances(): Map<string, number> {
        const balances = new Map<string, number>()

        for (const [userID, user] of this.users) {
            balances.set(userID, user.calculateBalance())
        }

        return balances
    }

    public getUserIDs(): string[] {
        return Array.from(this.users.keys())
    }

    public addUser(id: string) {
        if (this.users.has(id)) {
            throw new Error("user already exists")
        }

        const newUser = new User(id)
        this.users.set(newUser.id, newUser)
    }

    public addTransaction(transaction: Transaction) {
        const payingUser = this.users.get(transaction.paidBy)
        if (payingUser === undefined) {
            throw new Error("user not found")
        }

        for (const [userID, amountOwed] of transaction.owedBy.entries()) {
            if (!this.users.has(userID)) {
                this.addUser(userID)
            }

            const owingUser = this.users.get(userID)

            payingUser.shouldBePaidBy(userID, amountOwed)
            owingUser?.shouldPay(payingUser.id, amountOwed)
        }

        this.users.set(payingUser.id, payingUser)
        this.transactions.push(transaction)
    }
}
