
import { Express } from "express";
import { getLinkRoutes } from "./get-link.routes";
import { homeRoutes } from "./home.routes";

const routesVersion1 = (app: Express): void => {
    const version = "/api/v1/";
    app.use(version + "get-link", getLinkRoutes);
    
    app.use("/home", homeRoutes);
}
export default routesVersion1