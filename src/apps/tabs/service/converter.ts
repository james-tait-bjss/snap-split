import { TabDTO } from "../repository/dto";
import { Tab } from "./service";

export class TabConverter {
    static fromDTO(tabDTO: TabDTO): Tab {
        const balances = new Map<string, number>(Object.entries(tabDTO.balances))
        const tab = Tab.fromBalances(tabDTO.name, balances)

        return tab
    }

    static toDTO(tab: Tab): TabDTO{
        return new TabDTO(
            tab.name,
            Object.fromEntries(tab.getBalances().entries())
        )
    }
}