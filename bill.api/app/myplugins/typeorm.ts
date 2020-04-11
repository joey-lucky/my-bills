import {Application} from 'egg';
import {createConnection, Logger as TypeOrmLogger, QueryRunner,} from 'typeorm';
import {DbManager} from "../database";
import  * as assert from "assert";

let count = 0;

class Logger implements TypeOrmLogger {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        this.app.loggers.logger[level]("[database]", message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.app.loggers.logger.info("[database]", message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger.info("[database]", "query" + ": " + sql);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger.error("[database]", "query failed: " + sql);
        this.app.loggers.logger.error("[database]", `error:`, error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.app.loggers.logger.warn("[database]", `query is slow: ` + sql);
        this.app.loggers.logger.warn("[database]", `execution time: ` + time);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.app.loggers.logger.info("[database]", message);
    }

    protected stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) { // most probably circular objects in parameters
            return parameters;
        }
    }
}

async function createOneClient(config, app) {
    assert(config.host && config.port && config.user && config.database,
        `[egg-typeorm] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);

    app.coreLogger.info('[egg-typeorm] connecting %s@%s:%s/%s',
        config.user, config.host, config.port, config.database);
    if (!config) {
        throw new Error('please config typeorm in config file');
    }
    const connectConfig:any = {
        type: 'mysql',
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        database: config.database,
        synchronize: !!config.synchronize,
    };
    if (config.entities) {
        connectConfig.entities = config.entities;
    }
    if (config.subscribers) {
        connectConfig.subscribers = config.subscribers;
    }
    app.beforeStart(function* () {
        const connection = yield createConnection({
            ...config,
            logger: new Logger(app),
        });
        const rows = yield connection.manager.query('select 1 as column1;');
        const index = count++;
        const manager = connection.manager;
        const dbManager = new DbManager(app,manager);
        app.coreLogger.info(`[egg-typeorm] instance[${index}] status OK, rds currentTime: ${rows[0].currentTime}`);
        app.dbManager = dbManager;
    });
    return createConnection;
}

export default function typeOrm(app) {
    app.addSingleton('dbManager', createOneClient);
}

export async function beforeStart(app: Application) {
    const config = app.config.typeorm.client;
    if (!config) {
        throw new Error('please config typeorm in config file');
    }
    const connection = await createConnection({
        ...config,
        logger: new Logger(app),
    });
    const manager = connection.manager;
    const dbManager = new DbManager(app,manager);
    app.db = connection;
    app.dbManager = dbManager;
    app.context.db = connection;
    app.context.dbManager = dbManager;
}