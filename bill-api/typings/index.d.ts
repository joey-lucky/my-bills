import 'egg';

declare module 'egg' {
    interface Application {
        mysql:MySql;
        cache: {
            bcTableCache: TableCache
            tableForeignKeyMap: Map<string, string>
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

export interface MySql extends MySqlExecutor{
    beginTransaction(): MySqlExecutor & Transaction
}

export interface Transaction extends MySqlExecutor{
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

interface TableCache {
    [key: string]: {
        [key: string]: any
    }
}