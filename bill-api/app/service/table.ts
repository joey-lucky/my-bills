import {Service} from 'egg';
import * as assert from "assert";

export default class extends Service {
    public async list(params) {
        const {app, ctx} = this;
        let tableName = params["tableName"];
        let rows = await app.mysql.select(tableName);
        rows = await ctx.service.translateTable.translate(rows);
        return rows;
    }

    public async create(params) {
        const {app, ctx} = this;
        let tableName = params["tableName"];
        assert.ok(tableName, "表名为空");
        let data = params["data"] || [];
        assert.ok(data.length === 0, "数据不能为空");
        let transaction = await app.mysql.beginTransaction();
        try{
            for (let item of data) {
                await transaction.insert(tableName, item);
            }
            await transaction.commit();
        }catch (e) {
            await  transaction.rollback();
            throw new Error("数据库插入异常");
        }
    }

    public async update(params) {

    }

    public async delete(params) {

    }
}

