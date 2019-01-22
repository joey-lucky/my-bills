import 'egg';
import TokenCrypto from "../app/extend/token/TokenCrypto";

declare module 'egg' {
    import SqlExecutor from "../app/extend/database/SqlExecutor";

    interface Application {
        mysql:MySql;
        sqlExecutor:SqlExecutor,
        tokenCrypto:TokenCrypto
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

export interface Transaction extends MySqlExecutor{
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

export interface MySql extends MySqlExecutor{
    beginTransaction(): MySqlExecutor & Transaction
}

interface TableCache {
    [key: string]: {
        [key: string]: any
    }
}