import {SqlExecutor} from "./application/SqlExecutor";
import TableRowHelper from "./application/TableRowHelper";
import TokenCrypto from "./application/TokenCrypto";

export interface ExtendApplication {
    tokenCrypto: TokenCrypto,
    sqlExecutor: SqlExecutor,
    tableRowHelper: TableRowHelper,
    mCache: Map<string, any>,
}

const extend: ExtendApplication = {
    get tokenCrypto(): TokenCrypto {
        let cache = "TOKEN_CRYPTO";
        if (!this[cache]) {
            this[cache] = new TokenCrypto("joey");
        }
        return this[cache];
    },

    get sqlExecutor(): SqlExecutor {
        let app: any = this;
        let cache = "SQL_EXECUTOR";
        if (!this[cache]) {
            this[cache] = new SqlExecutor(app);
        }
        return this[cache];
    },

    get tableRowHelper(): TableRowHelper {
        let cache = "TABLEROWHELPER";
        if (!this[cache]) {
            let app: any = this;
            this[cache] = new TableRowHelper(app);
        }
        return this[cache];
    },

    get mCache(): Map<string, any> {
        let cache = "CACHE";
        if (!this[cache]) {
            this[cache] = new Map();
        }
        return this[cache];
    },
};

export default extend;