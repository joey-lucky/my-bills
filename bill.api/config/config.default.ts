import {EggAppConfig, EggAppInfo, PowerPartial} from "egg";

const middleware = ["errorHandler", "requestLogger", "tokenVerify"];
const typeorm = {
    client: {
        "type": "mysql",
        "name": "default",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "bill",
        "synchronize": true,
        "cache": false,
        "logging": [
            // "query",
            "error",
            // "warn",
            // "info",
            // "log"
        ],
        "entityPrefix": "",
        "dateStrings": false,
        "connectTimeout": 10000,
        "acquireTimeout": 10000,
        "maxQueryExecutionTime": 10000,
        "debug": false,
        "entities": [
            "app/database/entity/*.ts",
            "app/database/view/*.ts"
        ],
        "subscribers": [
            "app/database/subscriber/*.ts"
        ],
        "migrations": [
            "app/database/migration/*.ts"
        ],
        "cli": {
            "entitiesDir": "app/database/entity",
            "migrationsDir": "app/database/migration",
            "subscribersDir": "app/database/subscriber"
        }
    },
    app: true,
    agent: false,
};

const redis = {
    client: {
        port: 6379,          // Redis port
        host: '127.0.0.1',   // Redis host
        password: '',
        db: 0
    },
    app:true,
};

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + "_18576651723";
    // add your egg config in here
    config.middleware = middleware;
    config.typeorm = typeorm;
    // add your special config in here
    // the return config will combines to EggAppConfig
    config.redis = redis;
    return {
        ...config,
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
        // 私钥
        secret: "hjoey",
        secretVersion: 1,
        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: false,
            },
        },
        cluster: {
            listen: {
                path: "",
                port: 3000,
                hostname: "localhost",
            },
        },
    };
};
