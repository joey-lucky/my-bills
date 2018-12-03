import Controller from "./Controller";
import * as Router from "koa-router";
import DBManager from "../database/DBManager";
import * as assert from "assert";
import RequestUtils from "../utils/RequestUtils";
import TableStructureCache from "../schedule/TableStructureCache";

export default class TableController extends Controller {
    constructor() {
        super("/table");
    }

    list = async (ctx: Router.IRouterContext, next: any) => {
        let params = RequestUtils.getBodyParams(ctx);
        let tableName = params["TABLE_NAME"];
        assert.ok(TableStructureCache.getInstance().hasTable(tableName), "表不存在");
        let table = TableStructureCache.getInstance().getTableStructure(tableName);
        let sql = "select t.* from ? t";
        return await DBManager.query(sql, [tableName]);
    };
}
