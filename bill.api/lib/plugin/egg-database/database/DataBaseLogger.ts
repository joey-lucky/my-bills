import {Logger, QueryRunner} from "typeorm";
import {Application} from "egg";

export default class DataBaseLogger implements Logger {
    readonly logger;

    constructor(logger) {
        this.logger = logger;
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        this.logger && this.logger[level]("[egg-database]", message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.logger && this.logger.info("[egg-database]", message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.logger && this.logger.info("[egg-database]", "query" + ": " + sql);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.logger && this.logger.error("[egg-database]", "query failed: " + sql);
        this.logger && this.logger.error("[egg-database]", `error:`, error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.logger && this.logger.warn("[egg-database]", `query is slow: ` + sql);
        this.logger && this.logger.warn("[egg-database]", `execution time: ` + time);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.logger && this.logger.info("[egg-database]", message);
    }

    protected stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) { // most probably circular objects in parameters
            return parameters;
        }
    }
}
