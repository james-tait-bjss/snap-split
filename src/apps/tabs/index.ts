import express from "express"
import { MongoDatabaseService } from "../../libraries/db/mongo"
import { RequestLogger } from "../../libraries/middleware/requestLogger"
import { TabController } from "./controller"
import { TabData, TabRepository } from "./repository/repository"
import { TabRouteHandler } from "./routes"
import { TabService } from "./service/service"
import { TabFactory } from "./service/tab"
import { UserFactory } from "./service/user"
import fileDatabaseFactory from "../../libraries/db/file"
import fs from "fs"

// const dbConnectionString = process.env.MONGODB_CONNECTION_STRING
// if (dbConnectionString === undefined) {
//     console.log("No database connection string defined")
//     process.exit(1)
// }

// const databaseService = new MongoDatabaseService<TabData>(
//     dbConnectionString,
//     "tabs",
//     "tabData",
// )

const databaseService = fileDatabaseFactory<TabData>("/Users/James.Tait/Documents/projects/snap-split/src/apps/tabs/.db/db", fs)

const tabRepository = new TabRepository(databaseService)
const userFactory = new UserFactory()
const tabFactory = new TabFactory(userFactory)
const tabService = new TabService(tabRepository, tabFactory)
const controller = new TabController(tabService)

const routeHandler = new TabRouteHandler(
    express.Router(),
    controller,
    new RequestLogger(),
)

export const tabs = express()
tabs.use(express.json()).use("/", routeHandler.router)
