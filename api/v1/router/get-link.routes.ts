import {Router } from "express";
import * as controller from "../controller/get-link.controller";
import * as validates from "../validates/get-link.validate"
import * as middleware from "../middleware/get-link.middleware"
const router : Router = Router();
router.post("/",middleware.auth,controller.getLink)
router.get("/success",controller.success)
router.post("/check",validates.getLinkValidate,controller.checkLink)
router.get("/key-validate",controller.keyValidate)
export const getLinkRoutes : Router  = router