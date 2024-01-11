import { Request, Response, Router } from "express"
import { ExpressRoutesFunc } from "../expressRouter"

export interface TabController {
    getTab: ExpressRoutesFunc
    newTab: ExpressRoutesFunc
    deleteTab: ExpressRoutesFunc
    postTransaction: ExpressRoutesFunc
}

export interface RequestLogger {
    logRequest(req: Request): void
}

export class TabRouteHandler {
    constructor(
        public router: Router,
        private tabController: TabController,
        private requestLogger: RequestLogger,
    ) {
        this.router.post("/", this.postTab)
        this.router.get("/:id", this.getTab)
        this.router.delete("/:id", this.deleteTab)
        this.router.post("/:id/transaction", this.postTransaction)

        console.log(requestLogger)
        console.log(tabController)
    }

    private getTab = (req: Request, res: Response) => {
        this.requestLogger.logRequest(req)
        this.tabController.getTab(req, res)
    }

    private postTab = (req: Request, res: Response) => {
        this.requestLogger.logRequest(req)
        this.tabController.newTab(req, res)
    }

    private deleteTab = (req: Request, res: Response) => {
        this.requestLogger.logRequest(req)
        this.tabController.deleteTab(req, res)
    }

    private postTransaction = (req: Request, res: Response) => {
        this.requestLogger.logRequest(req)
        this.tabController.postTransaction(req, res)
    }
}
