import * as Router from "koa-router";

export default class Controller {
    path = "";

    constructor(path = "") {
        this.path = "/api" + path;
    }

    public registerRouter(router: Router) {
        let methodNames = Object.keys(this)
            .filter((methodName) => {
                return true;
            })
            .map((methodName) => {
                return methodName.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
            });
        methodNames.forEach((value, index, array) => {
            let urlName = value.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
            let childObject: any = this;
            router.all(this.path + "/" + urlName, async (ctx: Router.IRouterContext, next: any) => {
                let method = childObject[value];
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
                    }
                }
            })
        });
    }


}
