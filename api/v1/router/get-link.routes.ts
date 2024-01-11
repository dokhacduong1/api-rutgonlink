import {Router } from "express";
import * as controller from "../controller/get-link.controller";

const router : Router = Router();
router.post("/",controller.getLink)
router.get("/success",controller.success)
export const getLinkRoutes : Router  = router