import {MySql} from "../../../typings";
import TableComplete from "./TableComplete";
import * as assert from "assert";
import TransactionExecutor from "./TransactionExecutor";

export default class SqlExecutor {
    readonly tableComplete = new TableComplete();
    readonly mysql: MySql;

    constructor(mysql: MySql) {
        this.mysql = mysql;
    }

    query(sql: String, values?: any[]): Promise<any> {
        return this.mysql.query(sql, values)
    }

    get(tableName: String, find?: {}): Promise<any> {
        return this.mysql.get(tableName, find);
    }

    select(tableName: String, find?: {}): Promise<any[]> {
        return this.mysql.select(tableName, find);
    }

    delete(tableName: String, find?: {}): Promise<any> {
        return this.mysql.delete(tableName, find);
    }

    insert(tableName: String, values?: {}): Promise<any> {
        assert.ok(values, "insert values is null");
        let data: any = this.tableComplete.completeInsertTableData(values || {});
        return this.mysql.insert(tableName, data);
    }

    update(tableName: String, values?: {}): Promise<any> {
        assert.ok(values, "insert values is null");
        let data: any = this.tableComplete.completeUpdateTableData(values || {});
        return this.mysql.update(tableName, data);
    }

    async beginTransaction(): Promise<TransactionExecutor> {
        let transaction = await this.mysql.beginTransaction();
        return new TransactionExecutor(transaction);
    }
}

