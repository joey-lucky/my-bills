import {EggAppConfig, EggAppInfo, PowerPartial} from 'egg';

const mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: '112.74.165.42',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '@huang@520',
        // 数据库名
        database: 'bill',
    },
    app: true,
    agent: false,
};

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_18576651723';
    // add your egg config in here
    config.middleware = ["requestLogger", "requestParser"];
    // add your special config in here

    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
        mysql: mysql,
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
                path: '',
                port: 3000,
                hostname: '0.0.0.0',
            }
        }
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
