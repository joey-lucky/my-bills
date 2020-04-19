import {Logger, QueryRunner} from "typeorm";
import {Application} from "egg";

export default class DataBaseLogger implements Logger {
    readonly app;

    constructor(app) {
        this.app = app;
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        this.app.loggers.logger && this.app.loggers.logger[level]("[egg-database]", message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.app.loggers.logger && this.app.loggers.logger.info("[egg-database]", message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger && this.app.loggers.logger.info("[egg-database]", "query" + ": \n" + sql);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger && this.app.loggers.logger.error("[egg-database]", "query failed: " + sql);
        this.app.loggers.logger && this.app.loggers.logger.error("[egg-database]", `error:`, error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger && this.app.loggers.logger.warn("[egg-database]", `query is slow: ` + sql);
        this.app.loggers.logger && this.app.loggers.logger.warn("[egg-database]", `execution time: ` + time);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.app.loggers.logger && this.app.loggers.logger.info("[egg-database]", message);
    }

    protected stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) { // most probably circular objects in parameters
            return parameters;
        }
    }
}
