import * as assert from "assert";
import {Application, Context, Controller, Service} from "egg";
import Assert from "../../utils/Assert";

export default class extends Service {
    public async list(params) {
        const app: Application = this.app;
        const {tableName, data} = params;
        Assert.hasText(tableName, "表名为空");
        const rows: any[] = await app.sqlExecutor.select(tableName,  data);
        if ("bc_user" === tableName) {
            for (const item of rows) {
                item["login_name"] = "";
                item["login_password"] = "";
            }
        }
        return rows;
    }

    public async create(params: any) {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        const {tableName, data} = params;
        Assert.hasText(tableName, "表名为空");
        Assert.notNull(data, "数据不能为空");
        const transaction = await app.sqlExecutor.beginTransaction();
        try {
            if (Array.isArray(data)) {
                for (const row of data) {
                    await app.tableRowHelper.completeInsertTableRow(row, ctx);
                    await transaction.insert(tableName, row);
                }
            } else {
                await app.tableRowHelper.completeInsertTableRow(data, ctx);
                await transaction.insert(tableName, data);
            }
            await transaction.commit();
            return "保存成功";
        } catch (e) {
            await transaction.rollback();
            throw new Error("数据库插入异常");
        }
    }

    public async update(params: any|any[]) {
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        await app.tableRowHelper.completeInsertTableRow(params, ctx);
    }

    public async delete(params) {

    }
}
