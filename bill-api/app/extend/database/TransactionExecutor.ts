import {Transaction} from "../../../typings";
import TableComplete from "./TableComplete";
import * as assert from "assert";

export default class TransactionExecutor  {
    readonly tableComplete = new TableComplete();
    readonly transaction:Transaction;

    constructor(transaction: Transaction) {
        this.transaction = transaction;
    }

    query(sql: String, values?: any[]): Promise<any>{
        return this.transaction.query(sql,values)
    }

    get(tableName: String, find?: {}): Promise<any>{
        return this.transaction.get(tableName, find);
    }

    select(tableName: String, find?: {}): Promise<any[]>{
        return this.transaction.select(tableName, find);
    }

    delete(tableName: String, find?: {}): Promise<any>{
        return this.transaction.delete(tableName, find);
    }

    insert(tableName: String, values?: {}): Promise<any>{
        assert.ok(values, "insert values is null");
        let data: any = this.tableComplete.completeInsertTableData(values || {});
        return this.transaction.insert(tableName, data);
    }

    update(tableName: String, values?: {}): Promise<any>{
        assert.ok(values, "insert values is null");
        let data: any = this.tableComplete.completeUpdateTableData(values || {});
        return this.transaction.update(tableName, data);
    }

    commit(): Promise<void>{
        return this.transaction.commit();
    }

    rollback(): Promise<void>{
        return this.transaction.rollback();
    }
}

