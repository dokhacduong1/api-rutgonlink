
import { Express } from "express";
import { getLinkRoutes } from "./get-link.routes";
import { homeRoutes } from "./home.routes";

const routesVersion1 = (app: Express): void => {
    const version = "/rutgonlink/api/v1/";

    app.use(version + "get-link", getLinkRoutes);
    
    app.use("/rutgonlink/", homeRoutes);
}
export default routesVersion1