import { Transaction } from "./transaction"
import { User } from "./user"

export interface UserFactory {
    createUser(id: string): User
}

export class TabFactory {
    constructor(private readonly userFactory: UserFactory) {}

    createTab(name: string, users: string[]): Tab {
        return new Tab(name, users, this.userFactory)
    }
}

export class Tab {
    private users: Map<string, User>
    private transactions: Transaction[]

    constructor(
        public name: string,
        users: string[],
        private readonly userFactory: UserFactory,
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

    public getUsers(): Map<string, User> {
        return this.users
    }

    public getUserIDs(): string[] {
        return Array.from(this.users.keys())
    }

    public getBalances(): Map<string, number> {
        const balances = new Map<string, number>()

        for (const [userID, user] of this.users) {
            balances.set(userID, user.calculateBalance())
        }

        return balances
    }

    public addTransaction(transaction: Transaction) {
        const payingUser = this.users.get(transaction.paidBy)
        if (payingUser === undefined) {
            throw new Error("user not found")
        }

        for (const [userID, amountOwed] of transaction.owedBy.entries()) {
            if (!this.users.has(userID)) {
                throw new Error("user not found")
            }

            const owingUser = this.users.get(userID)

            payingUser.shouldBePaidBy(userID, amountOwed)
            owingUser?.shouldPay(payingUser.id, amountOwed)
        }

        this.transactions.push(transaction)
    }

    addUser(id: string) {
        if (this.users.has(id)) {
            throw new Error("user already exists")
        }

        const newUser = this.userFactory.createUser(id)
        this.users.set(newUser.id, newUser)
    }
}
