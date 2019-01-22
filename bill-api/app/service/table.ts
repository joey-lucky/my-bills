import {Service} from 'egg';
import * as UUID from "node-uuid";
import * as assert from "assert";
import {Context} from "vm";

export default class extends Service {
    public async list(params) {
        const {app, ctx} = this;
        let tableName = params["tableName"];
        let rows = await app.sqlExecutor.select(tableName);
        rows = await ctx.service.translateTable.translate(rows);
        return rows;
    }

    public async create(params) {
        const {app, ctx} = this;
        let tableName = params["tableName"];
        assert.ok(tableName, "表名为空");
        let data = JSON.parse(params["data"]) || [];
        assert.ok(data, "数据不能为空");
        let transaction = await app.sqlExecutor.beginTransaction();
        try{
            if (Array.isArray(data)) {
                for (let item of data) {
                    item.id = "";
                    await transaction.insert(tableName, item);
                }
            }else {
                await transaction.insert(tableName, data);
            }
            await transaction.commit();
            return "保存成功"
        }catch (e) {
            console.log(e);
            await  transaction.rollback();
            throw new Error("数据库插入异常");
        }
    }

    public async update(params) {

    }

    public async delete(params) {

    }
}

