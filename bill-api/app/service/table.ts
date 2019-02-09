import {Service} from 'egg';
import * as assert from "assert";

export default class extends Service {
    public async list(params) {
        this.validTableName(params);
        const {app: {sqlExecutor}, ctx} = this;
        let tableName = params["tableName"];
        return await sqlExecutor.select(tableName);
    }

    public async create(params) {
        this.validTableName(params);
        const {app: {sqlExecutor, tableRowHelper}, ctx} = this;
        let tableName = params["tableName"];
        assert.ok(params["data"], "数据不能为空");
        let data = JSON.parse(params["data"] || "{}");
        let transaction = await sqlExecutor.beginTransaction();
        try {
            if (Array.isArray(data)) {
                for (let row of data) {
                    await tableRowHelper.completeInsertTableRow(row, ctx);
                    await transaction.insert(tableName, row);
                }
            } else {
                await tableRowHelper.completeInsertTableRow(data, ctx);
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

    private validTableName(params) {
        let tableName = params["tableName"];
        assert.ok(tableName, "表名为空");
    }
}

