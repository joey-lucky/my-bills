import * as Router from "koa-router";
import UserController from "./UserController";
import SafeController from "./SafeController";
import TableController from "./TableController";
import * as Koa from "koa";
import Log from "../utils/Log";

export default class Controllers {
    public static generateControllers() {
        let controllers = new Controllers(new Router());
        controllers._registerRouter("/api/safe", new SafeController());
        controllers._registerRouter("/api/user", new UserController());
        controllers._registerRouter("/api/table", new TableController());
        return controllers;
    }

    readonly _router: Router;

    constructor(router: Router) {
        this._router = router;
    }

    public routes(): Koa.Middleware {
        return this._router.routes();
    }

    private _registerRouter(path: string, controller: any) {
        let methodNames = this._getMethodNames(controller);
        methodNames.forEach((value, index, array) => {
            let urlName = value.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
            let completeUrl = path + "/" + urlName;
            Log.info("register", completeUrl);
            this._router.all(completeUrl, async (ctx: Router.IRouterContext, next: any) => {
                let method = controller[value];
                try {
                    let resultData = await method(ctx, next);
                    ctx.body = {
                        code: "1",
                        message: "",
                        data: resultData || []
                    }
                } catch (e) {
                    ctx.body = {
                        code: "0",
                        message: e.message,
                        data: []
                    };
                    new Error();
                }
            })
        });
    }

    private _getMethodNames(controller: any) {
        return Object.keys(controller)
            .filter((methodName) => {
                return true;
            })
            .map((methodName) => {
                return methodName.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
            });
    }
}
