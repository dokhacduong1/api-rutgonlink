"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("./api/v1/router/index.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.set('trust proxy', true);
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
}));
app.use(express_1.default.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
dotenv_1.default.config();
const port = process.env.PORT || 2709;
(0, index_routes_1.default)(app);
app.get("*", (req, res) => {
    res.render("pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
