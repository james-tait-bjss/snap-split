export class User {
    private owedBy: Map<string, number>

    constructor(public id: string) {
        this.owedBy = new Map<string, number>()
    }

    public shouldPay(user: string, amount: number) {
        const currAmount = this.owedBy.get(user) ?? 0
        this.owedBy.set(user, currAmount - amount)
    }

    public shouldBePaidBy(user: string, amount: number) {
        const currAmount = this.owedBy.get(user) ?? 0
        this.owedBy.set(user, currAmount + amount)
    }

    public calculateBalance(): number {
        return Array.from(this.owedBy.values()).reduce(
            (acc, nextAmountOwed) => acc + nextAmountOwed,
            0,
        )
    }
}
