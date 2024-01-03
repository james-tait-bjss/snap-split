import User from "./user"

export default class Tab {
    balances: Map<string, number>;

    constructor(
        public name: string,
        users: User[]
    ) {
        this.balances = new Map<string, number>

        for (const user of users) {
            this.balances.set(user.id, 0)
        }
    }

    addTransactionWithEqualSplit(amount: number, involvedUsers: string[]) {
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Transaction amount should be a valid number greater than zero")
        }
    

        if (involvedUsers.length === 0) {
            throw new Error("Must have at least one involved user");
        }

        const remainder = amount % involvedUsers.length
        const equalSplit = Math.floor(amount / involvedUsers.length)

        let numIncreases = 0
        const newBalances = this.balances
        for (const userID of involvedUsers) {
            const currBalance = this.balances.get(userID)
            if (currBalance == undefined) {
                throw new Error("User was not found in tab")
            }

            if (numIncreases < remainder) {
                newBalances.set(userID, currBalance + equalSplit + 1)
                numIncreases++
            } else {
                newBalances.set(userID, currBalance + equalSplit)
            }
        }

        this.balances = newBalances
    }
}


