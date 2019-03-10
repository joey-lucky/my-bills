import {Application, Context, Controller,Service} from 'egg';
import * as assert from "assert";
import Assert from "../../utils/Assert";

export default class extends Service {
    public async list(params) {
        let app: Application = this.app;
        let {tableName,data} = params;
        Assert.hasText(tableName, "表名为空");
        let rows: any[] = await app.sqlExecutor.select(tableName,  data);
        if ("bc_user" === tableName) {
            for (let item of rows) {
                item["login_name"] = "";
                item["login_password"] = "";
            }
        }
        return rows;
    }

    public async create(params) {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let {tableName,data} = params;
        Assert.hasText(tableName, "表名为空");
        Assert.notNull(data, "数据不能为空");
        let transaction = await app.sqlExecutor.beginTransaction();
        try {
            if (Array.isArray(data)) {
                for (let row of data) {
                    await app.tableRowHelper.completeInsertTableRow(row, ctx);
                    await transaction.insert(tableName, row);
                }
            } else {
                await app.tableRowHelper.completeInsertTableRow(data, ctx);
                await transaction.insert(tableName, data);
            }
            await transaction.commit();
            return "保存成功"
        } catch (e) {
            await transaction.rollback();
            throw new Error("数据库插入异常");
        }
    }

    public async update(params) {

    }

    public async delete(params) {

    }
}

