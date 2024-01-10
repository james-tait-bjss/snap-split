import express from "express"
import fileDatabaseFactory from "../../libraries/db/file"
import { RequestLogger } from "../../libraries/middleware/logRequest"
import { TabController } from "./controllers"
import { TabData, TabRepository } from "./repository/repository"
import { TabRouteHandler } from "./routes"
import { TabService } from "./service/service"

export const tabs = express()

const databaseService = fileDatabaseFactory<TabData>(__dirname + "/.db/db")
const tabRepository = new TabRepository(databaseService)
const tabService = new TabService(tabRepository)

const routeHandler = new TabRouteHandler(
    express.Router(),
    new TabController(tabService),
    new RequestLogger(),
)

tabs.use("/", routeHandler.router)
