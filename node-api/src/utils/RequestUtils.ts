import * as Router from "koa-router";

export default class RequestUtils {
    static getBodyParams(ctx: Router.IRouterContext): any {
        if (ctx.request.method === "GET") {
            return ctx.request.query;
        }else{
            return ctx.request.body;
        }
    }
}
