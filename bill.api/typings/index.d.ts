import 'egg';
import {ExtendApplication} from "../app/extend/application";
import {ExtendRequest} from "../app/extend/request";
import {BcUser} from "../app/database/entity/BcUser";

declare module 'egg' {
    interface Request extends ExtendRequest {

    }

    interface Context{
        body: RequestResult;
        user: BcUser;
    }

    interface Application extends ExtendApplication {
        mysql: MySql
    }

    interface PageInfo {
        pageSize?: number;
        pageIndex?: number;
        pageCount?: number;
        rowCount?: number;
    }

    interface RequestResult {
        status?: string;
        message: string;
        code: "0" | "1";
        pageInfo:PageInfo,
        data: any[]
    }

    interface RequestUtils {

        getPageInfo(ctx: Context): PageInfo;

        getQueryParams(ctx: Context): { [key: string]: string };
    }

    interface MySqlExecutor {
        query(sql: String, values?: any[]): Promise<any>

        get(tableName: String, find?: {}): Promise<any>

        select(tableName: String, find?: {}): Promise<any[]>

        delete(tableName: String, find?: {}): Promise<any>

        insert(tableName: String, values?: {}): Promise<any>

        update(tableName: String, values?: {}, options?: {}): Promise<any>
    }

    interface Transaction extends MySqlExecutor {
        commit(): Promise<void>;

        rollback(): Promise<void>;
    }

    interface MySql extends MySqlExecutor {
        beginTransaction(): MySqlExecutor & Transaction
    }

    interface PageResult {
        pageInfo:PageInfo,
        rows:any[],
    }
}
