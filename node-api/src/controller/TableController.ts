import * as Router from "koa-router";
import DBManager from "../database/DBManager";
import * as assert from "assert";
import RequestUtils from "../utils/RequestUtils";
import TableStructureCache from "../schedule/TableStructureCache";

export default class TableController  {
    list = async (ctx: Router.IRouterContext, next: any) => {
        console.log(JSON.stringify(ctx.request));
        let bodyParams = RequestUtils.getBodyParams(ctx);
        let tableName = bodyParams["table_name"];
        let params = JSON.parse(bodyParams["params"]||"{}");
        assert.ok(TableStructureCache.hasTable(tableName), "表不存在");
        let sql = `select t.* from ${tableName} t where 1=1`;
        let queryParams = [];
        Object.keys(params)
            .forEach((key) => {
                sql += `  and ${key} = ? `;
                queryParams.push(params[key]);
            });
        let data = await DBManager.query(sql,queryParams);
        return TableStructureCache.translateTableRow(data);
    };
}
