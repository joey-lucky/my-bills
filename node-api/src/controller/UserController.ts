import Controller from "./Controller";
import * as Router from "koa-router";
import DBManager from "../database/DBManager";

export default class UserController extends Controller {
    constructor() {
        super("/user");
    }

    list = async (ctx: Router.IRouterContext, next: any) => {
        let data = await DBManager.query("select * from BC_USER");
        return Promise.resolve(data);
    };

    data = async (ctx: Router.IRouterContext, next: any) => {
        return Promise.resolve(["xxx"]);
    }
}
