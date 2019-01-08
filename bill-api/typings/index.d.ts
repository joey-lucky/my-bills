import 'egg';

declare module 'egg' {
    interface Application {
        mysql: MySql & MySqlExecutor;
        cache:{
            bcTableCache: TableCache
        }
    }
}

interface MySqlExecutor {
    query(sql: String, values?: any[]): Promise<any>

    get(tableName: String, find?: {}): Promise<any>

    select(tableName: String, find?: {}): Promise<any[]>

    delete(tableName: String, find?: {}): Promise<any>

    insert(tableName: String, values?: {}): Promise<any>

    update(tableName: String, values?: {}): Promise<any>
}

interface MySql {
    beginTransaction(): MySqlExecutor & Transaction
}

interface Transaction {
    commit(): Promise<void>;

    rollback(): Promise<void>;
}

interface TableCache {
    [key: string]: {
        [key: string]: any
    }
}