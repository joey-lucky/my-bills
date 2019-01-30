import * as assert from "assert";
import {Application} from "egg";
import {MySql} from "../../../typings";
import {TransactionExecutor} from "./TransactionExecutor";

export class SqlExecutor {
    readonly mysql: MySql;

    constructor(app:Application) {
        this.mysql = app.mysql;
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
        return this.mysql.insert(tableName, values);
    }

    update(tableName: String, values?: {}): Promise<any> {
        assert.ok(values, "insert values is null");
        return this.mysql.update(tableName, values);
    }

    async beginTransaction(): Promise<TransactionExecutor> {
        let transaction = await this.mysql.beginTransaction();
        return new TransactionExecutor(transaction);
    }
}
