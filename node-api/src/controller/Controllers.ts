import * as Router from "koa-router";
import UserController from "./UserController";
import SafeController from "./SafeController";
import TableController from "./TableController";

export default class Controllers {
    public static init() {
        const router = new Router();
        new UserController().registerRouter(router);
        new SafeController().registerRouter(router);
        new TableController().registerRouter(router);
        return router;
    }
}
