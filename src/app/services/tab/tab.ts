import User from "./user"

export default class Tab {
    private balances: Map<string, number>;

    constructor(
        public name: string,
        users: User[]
    ) {
        this.balances = new Map<string, number>();

        for (const user of users) {
            this.balances.set(user.id, 0)
        }
    }

    getBalances(): Map<string, number> {
        return new Map(this.balances);
    }

    addTransactionWithEqualSplit(amount: number, involvedUsers: string[]) {
        this.validateTransactionInput(amount, involvedUsers)

        const remainder = amount % involvedUsers.length
        const equalSplit = Math.floor(amount / involvedUsers.length)

        let numIncreases = 0
        const newBalances = new Map<string, number>(this.balances);

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
            throw new Error("Transaction amount should be a valid number greater than zero");
        }

        if (involvedUsers.length === 0) {
            throw new Error("Must have at least one involved user");
        }
    }

    private getBalance(userID: string): number {
        const balance = this.balances.get(userID);
        if (balance === undefined) {
            throw new Error("User not found in tab");
        }
        return balance;
    } 
}


