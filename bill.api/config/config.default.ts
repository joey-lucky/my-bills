import {EggAppConfig, EggAppInfo, PowerPartial} from "egg";

const middleware = ["errorHandler", "requestLogger", "tokenVerify"];

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
