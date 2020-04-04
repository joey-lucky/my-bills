import {AppCache, createAppCache} from "../typings/AppCache";
import DataBaseObserverFactory from "./application/DataBaseObserverFactory";
import {SqlExecutor} from "./application/SqlExecutor";
import TableRowHelper from "./application/TableRowHelper";

const cacheSymbol = Symbol("Application#cache");
const tableRowHelperSymbol = Symbol("Application#TableRowHelper");
const sqlExecutorSymbol = Symbol("Application#SqlExecutor");
const dataBaseObserverFactorySymbol = Symbol("Application#DataBaseObserverFactory");

export interface ExtendApplication {
    sqlExecutor: SqlExecutor;
    tableRowHelper: TableRowHelper;
    dataBaseObserver: DataBaseObserverFactory;
    mCache: AppCache;
}

const extend: ExtendApplication = {
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