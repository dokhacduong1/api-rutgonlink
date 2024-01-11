import {Router } from "express";
import * as controller from "../controller/home.controller";

const router : Router = Router();
router.get("/",controller.index)

export const homeRoutes : Router  = router