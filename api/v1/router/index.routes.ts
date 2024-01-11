
import { Express } from "express";
import { getLinkRoutes } from "./get-link.routes";

const routesVersion1 = (app: Express): void => {
    const version = "/api/v1/";
    app.use(version + "get-link", getLinkRoutes);
}
export default routesVersion1