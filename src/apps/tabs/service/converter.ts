import { TabDTO, TransactionDTO } from "../repository/dto"
import { TabFactory } from "./service"
import { Tab } from "./tab"

export class TabConverter {
    constructor(private readonly tabFactory: TabFactory) {}
    fromDTO(tabDTO: TabDTO): Tab {
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

    toDTO(tab: Tab): TabDTO {
        const transactionDTOs = tab.getTransactions().map((transaction) => {
            return new TransactionDTO(
                transaction.paidBy,
                transaction.amount,
                Object.fromEntries(transaction.owedBy),
            )
        })

        return new TabDTO(tab.name, tab.getUserIDs(), transactionDTOs)
    }

    // TODO: TO / FROM Controller DTO
}
