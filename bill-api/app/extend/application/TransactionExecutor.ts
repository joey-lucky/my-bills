import {Application, Transaction} from "egg";
import Assert from "../../utils/Assert";


export class TransactionExecutor {
    readonly transaction: Transaction;
    readonly app: Application;

    constructor(transaction: Transaction, app: Application) {
        this.transaction = transaction;
        this.app = app;
    }


    public async delete(tableName: string, id: string): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.hasText(id, "id is null");
        let result = await this.transaction.delete(tableName, {id: id});
        setTimeout(async () => {
            await this.app.dataBaseObserver.onDeleted(tableName, id)
        }, 100);
        return result;
    }

    public async insert(tableName: string, values?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "insert values is null");
        await this.app.tableRowHelper.translateDateTime(tableName, values);
        await this.app.tableRowHelper.deleteUselessFields(tableName, values);
        let result = await this.transaction.insert(tableName, values);
        setTimeout(async () => {
            await this.app.dataBaseObserver.onInserted(tableName, values)
        }, 100);
        return result;
    }

    public async update(tableName: string, values?: {}, options?: {}): Promise<any> {
        Assert.hasText(tableName, "tableName is null");
        Assert.notNull(values, "update values is null");
        await this.app.tableRowHelper.translateDateTime(tableName, values);
        await this.app.tableRowHelper.deleteUselessFields(tableName, values);
        let result = await this.transaction.update(tableName, values, options);
        setTimeout(async () => {
            await this.app.dataBaseObserver.onUpdated(tableName, values)
        }, 100);
        return result;
    }

    public commit(): Promise<void> {
        return this.transaction.commit();
    }

    public rollback(): Promise<void> {
        return this.transaction.rollback();
    }
}
