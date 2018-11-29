import Controller from "./Controller";
import * as Router from "koa-router";
import DBManager from "../database/DBManager";

export default class UserController extends Controller {
    constructor() {
        super("/user");
    }

    list = async (ctx: Router.IRouterContext, next: any) => {
        let data = await DBManager.query("select * from bc_user");
        ctx.body = JSON.stringify(data);
    };

    data = async (ctx: Router.IRouterContext, next: any) => {
        ctx.body = ["xxx"]
    }
}
