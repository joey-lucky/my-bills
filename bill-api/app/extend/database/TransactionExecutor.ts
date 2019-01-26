import * as assert from "assert";
import {Transaction} from "../../../typings";


export class TransactionExecutor  {
    readonly transaction:Transaction;

    constructor(transaction:Transaction) {
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
        return this.transaction.insert(tableName, values);
    }

    update(tableName: String, values?: {}): Promise<any>{
        assert.ok(values, "insert values is null");
        return this.transaction.update(tableName, values);
    }

    commit(): Promise<void>{
        return this.transaction.commit();
    }

    rollback(): Promise<void>{
        return this.transaction.rollback();
    }
}
