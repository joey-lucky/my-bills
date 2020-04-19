import {Connection, createConnection,} from 'typeorm';
import {Application} from 'egg';
import * as assert from "assert";
import {DataBase, DataBaseLogger} from "./index";

let count = 0;

export default async function createOneClient(config, app:Application) {
    const start = Date.now();
    const needParams = config.host && config.port && config.user && config.database && config.type;
    const needParamsStr = `'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`;
    const jdbc = `${config.type}://${config.host}:${config.port}/${config.database}`;
    assert(needParams, needParamsStr);
    app.loggers.logger.info('[egg-database] connecting ', jdbc);
    const connectConfig: any = {
        ...config,
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        database: config.database,
        synchronize: !!config.synchronize,
    };
    const connection: Connection = await createConnection({
        ...connectConfig,
        logger: new DataBaseLogger(app),
    });
    const index = count++;
    await app.loggers.logger.info(`[egg-database] ${jdbc} instance[${index}] connect success(${Date.now() - start}ms)`);
    app.beforeClose(()=>{
        connection.close();
    })
    return new DataBase(app, connection.manager);
}
