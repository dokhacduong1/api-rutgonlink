"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkValidate = void 0;
const getLinkValidate = (req, res, next) => {
    const key = req.body.key;
    const hwid = req.body.hwid;
    const time = req.body.time;
    if (!key || !hwid || !time) {
        res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
        return;
    }
    next();
};
exports.getLinkValidate = getLinkValidate;
