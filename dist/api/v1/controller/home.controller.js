"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homePost = exports.index = void 0;
const encryptedData_1 = require("../../../helpers/encryptedData");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ip = req.headers["x-forwarded-for"];
            res.render("pages/home/index", {
                pageTitle: "home",
                ip: (0, encryptedData_1.encryptedDataString)(ip),
            });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.render("pages/errors/404", {
                pageTitle: "404 Not Found",
            });
        }
    });
};
exports.index = index;
const homePost = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipLocal = req.body.namiv1;
            const ipCookie = req.body.namiv2;
            if (ipLocal && ipCookie) {
                res.status(200).json({ gege: ipLocal });
                return;
            }
            const ip = req.headers["x-forwarded-for"];
            console.log("mama2", ip);
            res.status(200).json({ gege: (0, encryptedData_1.encryptedDataString)(ip) });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.render("pages/errors/404", {
                pageTitle: "404 Not Found",
            });
        }
    });
};
exports.homePost = homePost;
