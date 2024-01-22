export interface Transaction {
    paidBy: string
    amount: number
    owedBy: Map<string, number>
}