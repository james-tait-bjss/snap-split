import { TabDTO, TransactionDTO } from "../repository/dto"
import { Tab } from "./tab"
import { User } from "./user"

interface UserFactory {
    createUser(id: string): User
}

export class TabConverter {
    static fromDTO(tabDTO: TabDTO, userFactory :  UserFactory): Tab {
        const tab = new Tab(tabDTO.name, tabDTO.users, userFactory)

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

    static toDTO(tab: Tab): TabDTO {
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
