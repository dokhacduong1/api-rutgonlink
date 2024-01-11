"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_link_routes_1 = require("./get-link.routes");
const routesVersion1 = (app) => {
    const version = "/api/v1/";
    app.use(version + "get-link", get_link_routes_1.getLinkRoutes);
};
exports.default = routesVersion1;
