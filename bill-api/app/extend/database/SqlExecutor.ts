import * as assert from "assert";
import {Application} from "egg";
import {MySql} from "../../../typings";
import {TransactionExecutor} from "./TransactionExecutor";
import TableRowHelper from "./TableRowHelper";

export class SqlExecutor {
    readonly mysql: MySql;
    readonly tableRowHelper:TableRowHelper;

    constructor(app: Application) {
        this.mysql = app.mysql;
        this.tableRowHelper = new TableRowHelper(app);
    }

    async query(sql: string, values?: any[]): Promise<any[]> {
        let rows = (await this.mysql.query(sql, values)) || [];
        return rows;
    }

    async queryPage(sql: string, values: any[]=[],pageInfo:PageInfo): Promise<any[]> {
        let countSql = `select count(*) count from (${sql}) t`;
        let rows = await this.query(countSql, values);
        assert.ok(rows && rows.length === 1, "获取总数异常");
        let count = Number.parseInt(rows[0].count);
        let start = (pageInfo.pageSize * (pageInfo.pageIndex - 1));
        let limitSql = `${sql} limit ${start},${pageInfo.pageSize}`;
        let rows = (await this.mysql.query(sql, values)) || [];
        return rows;
    }

    async get(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        let row = (await this.mysql.get(tableName, find)) || [];
        await this.tableRowHelper.translateId(row);
        await this.tableRowHelper.translateDateTime(tableName,row);
        return row;
    }

    async select(tableName: string, find?: {}): Promise<any[]> {
        assert.ok(tableName, "tableName is null");
        let rows = (await this.mysql.select(tableName, {where:find})) || [];
        for (let row of rows) {
            await this.tableRowHelper.translateId(row);
            await this.tableRowHelper.translateDateTime(tableName,row);
        }
        return rows;
    }

    async delete(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        return await this.mysql.delete(tableName, find);
    }

    async insert(tableName: string, values?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        assert.ok(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName,values);
        await this.tableRowHelper.deleteUselessFields(tableName,values);
        return await this.mysql.insert(tableName, values);
    }

    async update(tableName: string, values?: {},options?:{}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        assert.ok(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName,values);
        await this.tableRowHelper.deleteUselessFields(tableName,values);
        return await this.mysql.update(tableName, values,options);
    }

    async beginTransaction(): Promise<TransactionExecutor> {
        let transaction = await this.mysql.beginTransaction();
        return new TransactionExecutor(transaction,this.tableRowHelper);
    }
}
