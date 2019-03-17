import * as assert from "assert";
import {Application, PageInfo} from "egg";
import {TransactionExecutor} from "./TransactionExecutor";
import PageResult from "../../typings/PageResult";
import Assert from "../../utils/Assert";

export class SqlExecutor {
    readonly app:Application;

    constructor(app: Application) {
        this.app = app;
    }

    public async query(sql: string, values?: any[]): Promise<any[]> {
        let rows = (await this.app.mysql.query(sql, values)) || [];
        return rows;
    }

    public async queryPage(sql: string, values: any[] = [], pageInfo: PageInfo): Promise<PageResult> {
        let pageSize = pageInfo.pageSize || 15;
        let pageIndex = pageInfo.pageIndex || 1;
        let rowCount = await this.getRowsCount(sql, values);
        let pageCount = (rowCount + pageSize - 1) / pageSize;
        let data:any[] = [];
        if (pageIndex <= pageCount) {
            let start = (pageSize * (pageIndex - 1));
            let limitSql = `${sql} limit ${start},${pageInfo.pageSize}`;
            data = await this.app.mysql.query(limitSql, values);
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
        let row = (await this.app.mysql.get(tableName, find)) || [];
        await this.app.tableRowHelper.translateId(row);
        await this.app.tableRowHelper.translateDateTime(tableName, row);
        return row;
    }

    public async select(tableName: string, find?: {}): Promise<any[]> {
        assert.ok(tableName, "tableName is null");
        let rows = (await this.app.mysql.select(tableName, {where: find})) || [];
        for (let row of rows) {
            await this.app.tableRowHelper.translateId(row);
            await this.app.tableRowHelper.translateDateTime(tableName, row);
        }
        return rows;
    }

    public async delete(tableName: string, id:string): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.hasText(id, "id is null");
        let result = await this.app.mysql.delete(tableName, {id: id});
        setTimeout(async () => {
           await this.app.dataBaseObserver.onDeleted(tableName,id)
        }, 100);
        return result;
    }

    public async insert(tableName: string, values?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "insert values is null");
        await this.app.tableRowHelper.translateDateTime(tableName, values);
        await this.app.tableRowHelper.deleteUselessFields(tableName, values);
        let result = await this.app.mysql.insert(tableName, values);
        setTimeout(async () => {
            await this.app.dataBaseObserver.onInserted(tableName,values)
        }, 100);
        return result;
    }

    public async update(tableName: string, values?: {}, options?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "update values is null");
        await this.app.tableRowHelper.translateDateTime(tableName, values);
        await this.app.tableRowHelper.deleteUselessFields(tableName, values);
        let result = await this.app.mysql.update(tableName, values, options);
        setTimeout(async () => {
           await this.app.dataBaseObserver.onUpdated(tableName,values)
        }, 100);
        return result;
    }

    public async beginTransaction(): Promise<TransactionExecutor> {
        let transaction = await this.app.mysql.beginTransaction();
        return new TransactionExecutor(transaction, this.app);
    }
}
