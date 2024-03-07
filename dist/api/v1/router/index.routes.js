"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_link_routes_1 = require("./get-link.routes");
const home_routes_1 = require("./home.routes");
const routesVersion1 = (app) => {
    const version = "/rutgonlink/api/v1/";
    app.use(version + "get-link", get_link_routes_1.getLinkRoutes);
    app.use("/rutgonlink/", home_routes_1.homeRoutes);
};
exports.default = routesVersion1;
