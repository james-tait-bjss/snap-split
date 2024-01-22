import express from "express"
import { MongoDatabaseService } from "../../libraries/db/mongo"
import { RequestLogger } from "../../libraries/middleware/requestLogger"
import { TabController } from "./controller"
import { TabData, TabRepository } from "./repository/repository"
import { TabRouteHandler } from "./routes"
import { TabService } from "./service/service"

const dbConnectionString = process.env.MONGODB_CONNECTION_STRING
if (dbConnectionString === undefined) {
    console.log("No database connection string defined")
    process.exit(1)
}

const databaseService = new MongoDatabaseService<TabData>(
    dbConnectionString,
    "tabs",
    "tabData",
)
const tabRepository = new TabRepository(databaseService)
const tabService = new TabService(tabRepository)
const controller = new TabController(tabService)

const routeHandler = new TabRouteHandler(
    express.Router(),
    controller,
    new RequestLogger(),
)

export const tabs = express()
tabs.use("/", routeHandler.router)
