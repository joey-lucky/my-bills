import {SqlExecutor} from "./application/SqlExecutor";
import TableRowHelper from "./application/TableRowHelper";
import TokenCrypto from "./application/TokenCrypto";
import {AppCache, createAppCache} from "../typings/AppCache";

const cacheSymbol = Symbol("Application#cache");
const tableRowHelperSymbol = Symbol("Application#TableRowHelper");
const sqlExecutorSymbol = Symbol("Application#SqlExecutor");
const tokenCryptoSymbol = Symbol("Application#TokenCrypto");

export interface ExtendApplication {
    tokenCrypto: TokenCrypto,
    sqlExecutor: SqlExecutor,
    tableRowHelper: TableRowHelper,
    mCache: AppCache,
}

const extend: ExtendApplication = {
    get tokenCrypto(): TokenCrypto {
        if (!this[tokenCryptoSymbol]) {
            this[tokenCryptoSymbol] = new TokenCrypto("joey");
        }
        return this[tokenCryptoSymbol];
    },

    get sqlExecutor(): SqlExecutor {
        let app: any = this;
        if (!this[sqlExecutorSymbol]) {
            this[sqlExecutorSymbol] = new SqlExecutor(app);
        }
        return this[sqlExecutorSymbol];
    },

    get tableRowHelper(): TableRowHelper {
        if (!this[tableRowHelperSymbol]) {
            let app: any = this;
            this[tableRowHelperSymbol] = new TableRowHelper(app);
        }
        return this[tableRowHelperSymbol];
    },

    get mCache(): AppCache {
        if (!this[cacheSymbol]) {
            this[cacheSymbol] = createAppCache();
        }
        return this[cacheSymbol];
    },
};

export default extend;