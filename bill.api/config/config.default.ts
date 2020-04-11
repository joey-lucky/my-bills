import {EggAppConfig, EggAppInfo, PowerPartial} from "egg";

const middleware = ["errorHandler", "requestLogger", "tokenVerify"];

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + "_18576651723";
    // add your egg config in here
    config.middleware = middleware;
    //plugin
    config.database = {
        default: {
            "type": "mysql",
            "cache": false,
            "logging": [
                "query",
                "error",
                "warn",
                "info",
                "log"
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
        },
    }
    // the return config will combines to EggAppConfig
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
