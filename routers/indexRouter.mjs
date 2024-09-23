import { Router } from "express";
import * as indexController from "../controllers/indexController.mjs";

const indexRouter = Router();

indexRouter.get("/join-admins", indexController.joinAdminsPageGet)

indexRouter.get("/create-message", indexController.createMessagePageGet);

indexRouter.get("/log-in", indexController.loginPageGet);

indexRouter.get("/join-club", indexController.joinClubPageGet);

indexRouter.get("/sign-up", indexController.signUpFormGet);

indexRouter.get("/", indexController.indexRouteGet);

indexRouter.post("/sign-up", indexController.signUpPost);

indexRouter.post("/join-club", indexController.joinClubPost);

indexRouter.post("/log-in", indexController.loginPost);

indexRouter.post("/create-message", indexController.createMessagePost);

export default indexRouter;