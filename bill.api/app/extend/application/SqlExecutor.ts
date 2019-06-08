import * as assert from "assert";
import {Application, PageInfo} from "egg";
import PageResult from "../../typings/PageResult";
import Assert from "../../utils/Assert";
import {TransactionExecutor} from "./TransactionExecutor";

export class SqlExecutor {
    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async query(sql: string, values?: any[]): Promise<any[]> {
        const rows = (await this.app.mysql.query(sql, values)) || [];
        return rows;
    }

    public async queryPage(sql: string, values: any[] = [], pageInfo: PageInfo): Promise<PageResult> {
        const pageSize = pageInfo.pageSize || 15;
        const pageIndex = pageInfo.pageIndex || 1;
        const rowCount = await this.getRowsCount(sql, values);
        const pageCount = (rowCount + pageSize - 1) / pageSize;
        let data: any[] = [];
        if (pageIndex <= pageCount) {
            const start = (pageSize * (pageIndex - 1));
            const limitSql = `${sql} limit ${start},${pageInfo.pageSize}`;
            data = await this.app.mysql.query(limitSql, values);
        }
        return {
            pageInfo: {
                pageSize,
                pageIndex,
                rowCount,
                pageCount,
            },
            rows: data,
        };
    }

    //查询总行数
    private async getRowsCount(sql: string, values: any[] = []) {
        const countSql = `select count(*) count from (${sql}) t`;
        const rows = await this.query(countSql, values);
        assert.ok(rows && rows.length === 1, "获取总数异常");
        return Number.parseInt(rows[0].count);
    }

    public async get(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        const row = (await this.app.mysql.get(tableName, find)) || [];
        await this.app.tableRowHelper.translateId(row);
        await this.app.tableRowHelper.translateDateTime(tableName, row);
        return row;
    }

    public async select(tableName: string, find?: {}): Promise<any[]> {
        assert.ok(tableName, "tableName is null");
        const rows = (await this.app.mysql.select(tableName, {where: find})) || [];
        for (const row of rows) {
            await this.app.tableRowHelper.translateId(row);
            await this.app.tableRowHelper.translateDateTime(tableName, row);
        }
        return rows;
    }

    public async delete(tableName: string, id: string): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.hasText(id, "id is null");
        const result = await this.app.mysql.delete(tableName, {id});
        setTimeout(async () => {
           await this.app.dataBaseObserver.onDeleted(tableName, id);
        }, 100);
        return result;
    }

    public async insert(tableName: string, values?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "insert values is null");
        await this.app.tableRowHelper.translateDateTime(tableName, values);
        await this.app.tableRowHelper.deleteUselessFields(tableName, values);
        const result = await this.app.mysql.insert(tableName, values);
        setTimeout(async () => {
            await this.app.dataBaseObserver.onInserted(tableName, values);
        }, 100);
        return result;
    }

    public async update(tableName: string, values?: {}, options?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "update values is null");
        await this.app.tableRowHelper.translateDateTime(tableName, values);
        await this.app.tableRowHelper.deleteUselessFields(tableName, values);
        const result = await this.app.mysql.update(tableName, values, options);
        setTimeout(async () => {
           await this.app.dataBaseObserver.onUpdated(tableName, values);
        }, 100);
        return result;
    }

    public async beginTransaction(): Promise<TransactionExecutor> {
        const transaction = await this.app.mysql.beginTransaction();
        return new TransactionExecutor(transaction, this.app);
    }
}
