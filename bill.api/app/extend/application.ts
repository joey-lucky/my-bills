import {AppCache, createAppCache} from "../typings/AppCache";
import CalculateBalance from "./application/CalculateBalance";
import DataBaseObserverFactory from "./application/DataBaseObserverFactory";
import {SqlExecutor} from "./application/SqlExecutor";
import TableRowHelper from "./application/TableRowHelper";
import TokenCrypto from "./application/TokenCrypto";

const cacheSymbol = Symbol("Application#cache");
const tableRowHelperSymbol = Symbol("Application#TableRowHelper");
const sqlExecutorSymbol = Symbol("Application#SqlExecutor");
const tokenCryptoSymbol = Symbol("Application#TokenCrypto");
const dataBaseObserverFactorySymbol = Symbol("Application#DataBaseObserverFactory");
const calculateBalanceSymbol = Symbol("Application#CalculateBalance");

export interface ExtendApplication {
    tokenCrypto: TokenCrypto;
    sqlExecutor: SqlExecutor;
    tableRowHelper: TableRowHelper;
    dataBaseObserver: DataBaseObserverFactory;
    calculateBalance: CalculateBalance;
    mCache: AppCache;
}

const extend: ExtendApplication = {
    get tokenCrypto(): TokenCrypto {
        if (!this[tokenCryptoSymbol]) {
            this[tokenCryptoSymbol] = new TokenCrypto("joey");
        }
        return this[tokenCryptoSymbol];
    },

    get sqlExecutor(): SqlExecutor {
        const app: any = this;
        if (!this[sqlExecutorSymbol]) {
            this[sqlExecutorSymbol] = new SqlExecutor(app);
        }
        return this[sqlExecutorSymbol];
    },

    get tableRowHelper(): TableRowHelper {
        if (!this[tableRowHelperSymbol]) {
            const app: any = this;
            this[tableRowHelperSymbol] = new TableRowHelper(app);
        }
        return this[tableRowHelperSymbol];
    },

    get calculateBalance(): CalculateBalance {
        if (!this[calculateBalanceSymbol]) {
            const app: any = this;
            this[calculateBalanceSymbol] = new CalculateBalance(app);
        }
        return this[calculateBalanceSymbol];
    },

    get dataBaseObserver(): DataBaseObserverFactory {
        if (!this[dataBaseObserverFactorySymbol]) {
            this[dataBaseObserverFactorySymbol] = new DataBaseObserverFactory();
        }
        return this[dataBaseObserverFactorySymbol];
    },

    get mCache(): AppCache {
        if (!this[cacheSymbol]) {
            this[cacheSymbol] = createAppCache();
        }
        return this[cacheSymbol];
    },
};

export default extend;