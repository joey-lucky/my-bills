import {Transaction} from "egg";
import TableRowHelper from "./TableRowHelper";
import Assert from "../../utils/Assert";


export class TransactionExecutor {
    readonly transaction: Transaction;
    readonly tableRowHelper: TableRowHelper;

    constructor(transaction: Transaction, TableRowHelper) {
        this.transaction = transaction;
        this.tableRowHelper = TableRowHelper;
    }


    public async delete(tableName: string, id: string): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.hasText(id, "id is null");
        return await this.transaction.delete(tableName, {id: id});
    }

    public async insert(tableName: string, values?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "insert values is null");
        await this.tableRowHelper.translateDateTime(tableName, values);
        await this.tableRowHelper.deleteUselessFields(tableName, values);
        return await this.transaction.insert(tableName, values);
    }

    public async update(tableName: string, values?: {}, options?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "update values is null");
        await this.tableRowHelper.translateDateTime(tableName, values);
        await this.tableRowHelper.deleteUselessFields(tableName, values);
        return await this.transaction.update(tableName, values, options);
    }

    public commit(): Promise<void> {
        return this.transaction.commit();
    }

    public rollback(): Promise<void> {
        return this.transaction.rollback();
    }
}
