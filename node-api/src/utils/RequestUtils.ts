import * as Router from "koa-router";

export default class RequestUtils {
    static getBodyParams(ctx: Router.IRouterContext): any {
        console.log("ctx.request.body " + JSON.stringify(ctx.request.body));
        return ctx.request.body;
    }
}
