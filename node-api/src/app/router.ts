import UserController from "./controller/UserController";
import * as Router from "koa-router";

export default (router:Router) => {
    new UserController().registerRouter(router);
}
