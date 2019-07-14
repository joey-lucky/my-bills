import {Application} from "egg";
import {createConnection, getConnectionOptions, Logger as TypeOrmLogger, QueryRunner} from "typeorm";

class MyCustomLogger implements TypeOrmLogger {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        this.app.loggers.logger[level]("[database]",message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.app.loggers.logger.info("[database]",message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger.info("[database]","query" + ": " + sql);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger.error("[database]","query failed: " + sql);
        this.app.loggers.logger.error("[database]",`error:`, error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger.warn("[database]",`query is slow: ` + sql);
        this.app.loggers.logger.warn("[database]",`execution time: ` + time);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.app.loggers.logger.info("[database]",message);
    }

    protected stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);

        } catch (error) { // most probably circular objects in parameters
            return parameters;
        }
    }
}

export default (app: Application) => {
    app.once('server', async (server) => {
        let options = await getConnectionOptions();
        await createConnection({
            ...options,
            logger: new MyCustomLogger(app),
        });
        app.loggers.logger.info("[app-recycle]", "once");
    });
    app.on('error', (err, ctx) => {
        app.loggers.logger.info("[app-recycle]", "on error");
    });
    app.on('request', ctx => {
        app.loggers.logger.info("[app-recycle]", "on request");
    });
    app.on('response', ctx => {
        app.loggers.logger.info("[app-recycle]", "on response");
    });
}
