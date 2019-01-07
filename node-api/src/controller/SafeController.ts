import * as Router from "koa-router";
import DBManager from "../database/DBManager";
import RequestUtils from "../utils/RequestUtils";
import Assert from "../utils/Assert";

export default class SafeController {
    login = async (ctx: Router.IRouterContext, next: any) => {
        let params = RequestUtils.getBodyParams(ctx);
        let loginName = params["userName"];
        let password = params["password"];
        let sql = "select t.* from BC_USER t where t.login_name = ?";
        let rows = await DBManager.query(sql, [loginName]);
        Assert.notEmpty(rows, "用户不存在");
        let row = rows[0];
        Assert.isTrue(password === row["login_password"], "密码错误");
        return [];
    };
}
