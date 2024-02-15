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
exports.homePost = exports.indexTest = exports.index = void 0;
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
const indexTest = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ip = req.headers["x-forwarded-for"];
            res.render("pages/test/index", {
                pageTitle: "home",
                ip: (0, encryptedData_1.encryptedDataString)(ip),
                ipno: ip,
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
exports.indexTest = indexTest;
const homePost = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipLocal = req.body.namiv1;
            const ipCookie = req.body.namiv2;
            if (ipLocal) {
                const decData = (0, encryptedData_1.decDataString)(ipLocal);
                const ipOk = (0, encryptedData_1.encryptedDataString)(decData);
                res.status(200).json({ gege: ipOk });
                return;
            }
            if (ipCookie) {
                const decData = (0, encryptedData_1.decDataString)(ipCookie);
                const ipOk = (0, encryptedData_1.encryptedDataString)(decData);
                res.status(200).json({ gege: ipOk });
                return;
            }
            const ip = req.headers["x-forwarded-for"];
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
