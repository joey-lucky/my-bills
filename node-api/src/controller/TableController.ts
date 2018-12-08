import * as Router from "koa-router";
import DBManager from "../database/DBManager";
import RequestUtils from "../utils/RequestUtils";
import TableStructureCache from "../schedule/TableStructureCache";
import Assert from "../utils/Assert";

export default class TableController  {
    list = async (ctx: Router.IRouterContext, next: any) => {
        console.log(JSON.stringify(ctx.request));
        let bodyParams = RequestUtils.getBodyParams(ctx);
        let tableName = bodyParams["table_name"];
        let params = JSON.parse(bodyParams["params"]||"{}");
        Assert.isTrue(TableStructureCache.hasTable(tableName), "表不存在");
        let sql = `select t.* from ${tableName} t where 1=1`;
        let queryParams = [];
        Object.keys(params)
            .forEach((key) => {
                sql += `  and ${key} = ? `;
                queryParams.push(params[key]);
            });
        let rows:any[] = await DBManager.query(sql,queryParams);
        rows = TableStructureCache.translateTableRows(rows);
        return TableStructureCache.translateTablePrimaryAliasName(rows,tableName);
    };

    delete = async (ctx: Router.IRouterContext, next: any) => {
        console.log(JSON.stringify(ctx.request));
        let bodyParams = RequestUtils.getBodyParams(ctx);
        let tableName = bodyParams["table_name"];
        let id = bodyParams["id"];
        Assert.isTrue(TableStructureCache.hasTable(tableName), "表不存在");
        Assert.hasText(id, "主键不存在");
        await DBManager.delete(tableName, id);
        return [];
    };

    create = async (ctx: Router.IRouterContext, next: any) => {
        console.log(JSON.stringify(ctx.request));
        let bodyParams = RequestUtils.getBodyParams(ctx);
        let tableName = bodyParams["table_name"];
        let data = bodyParams["data"]||[];
        Assert.isTrue(TableStructureCache.hasTable(tableName), "表不存在");
        await DBManager.insert(tableName, data);
        return [];
    };

    update = async (ctx: Router.IRouterContext, next: any) => {
        console.log(JSON.stringify(ctx.request));
        let bodyParams = RequestUtils.getBodyParams(ctx);
        let tableName = bodyParams["table_name"];
        let data = bodyParams["data"]||[];
        Assert.isTrue(TableStructureCache.hasTable(tableName), "表不存在");
        await DBManager.update(tableName, data);
        return [];
    };
}
