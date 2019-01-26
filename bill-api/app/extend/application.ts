import TokenCrypto from "./TokenCrypto";
import {SqlExecutor} from "./database/SqlExecutor";
import {TableRowUtils} from "./database/TableRowUtils";

let app: any = {
    get tokenCrypto():TokenCrypto{
        let cache = "token_crypto";
        if (!this[cache]) {
            this[cache] = new TokenCrypto("joey huang");
        }
        return this[cache];
    },
    get sqlExecutor():SqlExecutor{
        let cache = "sql_executor";
        if (!this[cache]) {
            this[cache] = new SqlExecutor(this);
        }
        return this[cache];
    },
    get tableRowUtils():SqlExecutor{
        let cache = "table_row_utils";
        if (!this[cache]) {
            this[cache] = new TableRowUtils();
        }
        return this[cache];
    }
};

module.exports = app;