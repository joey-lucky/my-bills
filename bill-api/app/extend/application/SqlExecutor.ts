import * as assert from "assert";
import {Application, MySql, PageInfo} from "egg";
import {TransactionExecutor} from "./TransactionExecutor";
import TableRowHelper from "./TableRowHelper";

export class SqlExecutor {
    readonly mysql: MySql;
    readonly tableRowHelper: TableRowHelper;

    constructor(app: Application) {
        this.mysql = app.mysql;
        this.tableRowHelper = new TableRowHelper(app);
    }

    public async query(sql: string, values?: any[]): Promise<any[]> {
        let rows = (await this.mysql.query(sql, values)) || [];
        return rows;
    }

    public async queryPage(sql: string, values: any[] = [], pageInfo: PageInfo): Promise<{pageInfo:PageInfo,rows:any[]}> {
        let pageSize = pageInfo.pageSize || 15;
        let pageIndex = pageInfo.pageIndex || 1;
        let rowCount = await this.getRowsCount(sql, values);
        let pageCount = (rowCount + pageSize - 1) / pageSize;
        let data:any[] = [];
        if (pageIndex <= pageCount) {
            let start = (pageSize * (pageIndex - 1));
            let limitSql = `${sql} limit ${start},${pageInfo.pageSize}`;
            data = await this.mysql.query(limitSql, values);
        }
        return {
            pageInfo: {
                pageSize,
                pageIndex,
                rowCount,
                pageCount
            },
            rows: data,
        }
    }

    //查询总行数
    private async getRowsCount(sql: string, values: any[] = []) {
        let countSql = `select count(*) count from (${sql}) t`;
        let rows = await this.query(countSql, values);
        assert.ok(rows && rows.length === 1, "获取总数异常");
        return Number.parseInt(rows[0].count);
    }

    public async get(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        let row = (await this.mysql.get(tableName, find)) || [];
        await this.tableRowHelper.translateId(row);
        await this.tableRowHelper.translateDateTime(tableName, row);
        return row;
    }

    public async select(tableName: string, find?: {}): Promise<any[]> {
        assert.ok(tableName, "tableName is null");
        let rows = (await this.mysql.select(tableName, {where: find})) || [];
        for (let row of rows) {
            await this.tableRowHelper.translateId(row);
            await this.tableRowHelper.translateDateTime(tableName, row);
        }
        return rows;
    }

    public async delete(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        return await this.mysql.delete(tableName, find);
    }

    public async insert(tableName: string, values?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        assert.ok(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName, values);
        await this.tableRowHelper.deleteUselessFields(tableName, values);
        return await this.mysql.insert(tableName, values);
    }

    public async update(tableName: string, values?: {}, options?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        assert.ok(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName, values);
        await this.tableRowHelper.deleteUselessFields(tableName, values);
        return await this.mysql.update(tableName, values, options);
    }

    public async beginTransaction(): Promise<TransactionExecutor> {
        let transaction = await this.mysql.beginTransaction();
        return new TransactionExecutor(transaction, this.tableRowHelper);
    }
}
