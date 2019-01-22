import SqlExecutor from "./database/SqlExecutor";
import TokenCrypto from "./token/TokenCrypto";

let app: any = {
    get sqlExecutor():SqlExecutor{
        if (!this["SQLEXECUTOR"]) {
            this["SQLEXECUTOR"] = new SqlExecutor(this.mysql);
        }
        return this["SQLEXECUTOR"];
    },
    get tokenCrypto():TokenCrypto{
        if (!this["TOKENCRYPTO"]) {
            this["TOKENCRYPTO"] = new TokenCrypto("joey huang");
        }
        return this["TOKENCRYPTO"];
    }

};

module.exports = app;