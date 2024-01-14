import {Router } from "express";
import * as controller from "../controller/home.controller";

const router : Router = Router();
router.get("/",controller.index)
router.post("/t",controller.homePost)
export const homeRoutes : Router  = router