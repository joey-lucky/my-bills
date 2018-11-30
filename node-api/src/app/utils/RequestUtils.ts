import * as Router from "koa-router";

export default class RequestUtils {
    static getBodyParams(ctx: Router.IRouterContext): any {
        return JSON.parse(ctx.request.body);
    }
}
