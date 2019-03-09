import * as assert from "assert";
import {Transaction} from "egg";
import TableRowHelper from "./TableRowHelper";


export class TransactionExecutor  {
    readonly transaction:Transaction;
    readonly tableRowHelper:TableRowHelper;

    constructor(transaction:Transaction,TableRowHelper) {
        this.transaction = transaction;
        this.tableRowHelper = TableRowHelper;
    }

    async query(sql: string, values?: any[]): Promise<any[]> {
        let rows = (await this.transaction.query(sql, values)) || [];
        return rows;
    }

    async get(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        let row = (await this.transaction.get(tableName, find)) || [];
        await this.tableRowHelper.translateId(row);
        await this.tableRowHelper.translateDateTime(tableName,row);
        return row;
    }

    async select(tableName: string, find?: {}): Promise<any[]> {
        assert.ok(tableName, "tableName is null");
        let rows = (await this.transaction.select(tableName, find)) || [];
        for (let row of rows) {
            await this.tableRowHelper.translateId(row);
            await this.tableRowHelper.translateDateTime(tableName,row);
        }
        return rows;
    }

    async delete(tableName: string, find?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        return await this.transaction.delete(tableName, find);
    }

    async insert(tableName: string, values?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        assert.ok(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName,values);
        return await this.transaction.insert(tableName, values);
    }

    async update(tableName: string, values?: {}): Promise<any> {
        assert.ok(tableName, "tableName is null");
        assert.ok(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName,values);
        return await this.transaction.update(tableName, values);
    }

    commit(): Promise<void>{
        return this.transaction.commit();
    }

    rollback(): Promise<void>{
        return this.transaction.rollback();
    }
}
