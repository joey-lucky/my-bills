import TokenCrypto from "./TokenCrypto";
import {SqlExecutor} from "./database/SqlExecutor";
import Loggers from "./Loggers";
import TableRowHelper from "./database/TableRowHelper";

let app: any = {
    get tokenCrypto():TokenCrypto{
        let cache = "TOKEN_CRYPTO";
        if (!this[cache]) {
            this[cache] = new TokenCrypto("joey");
        }
        return this[cache];
    },
    get sqlExecutor():SqlExecutor{
        let cache = "SQL_EXECUTOR";
        if (!this[cache]) {
            this[cache] = new SqlExecutor(this);
        }
        return this[cache];
    },
    get tableRowHelper():TableRowHelper{
        let cache = "TABLEROWHELPER";
        if (!this[cache]) {
            this[cache] = new TableRowHelper(this);
        }
        return this[cache];
    },
    get mLoggers():Loggers{
        let cache = "LOGGERS";
        if (!this[cache]) {
            this[cache] = new Loggers();
        }
        return this[cache];
    },
    get mCache():Map<string,any>{
        let cache = "CACHE";
        if (!this[cache]) {
            this[cache] = new Map();
        }
        return this[cache];
    },
};

module.exports = app;