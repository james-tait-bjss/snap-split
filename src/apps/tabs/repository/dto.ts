export class TabDTO {
    constructor(
        public readonly name: string,
        public readonly users: string[],
        public readonly transactions: TransactionDTO[],
    ) {}
}

export class TransactionDTO {
    constructor(
        public readonly paidBy: string,
        public readonly amount: number,
        public readonly owedBy: { [userID: string]: number },
    ) {}
}
