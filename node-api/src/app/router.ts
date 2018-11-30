import * as Router from "koa-router";
import UserController from "./controller/UserController";
import SafeController from "./controller/SafeController";

export default (router:Router) => {
    new UserController().registerRouter(router);
    new SafeController().registerRouter(router);
}
