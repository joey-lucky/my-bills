import {EggAppConfig, EggAppInfo, PowerPartial} from "egg";

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    //plugin
    config.database = {
        client: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '123456',
            database: 'bill_test',
            synchronize: true,
        },
        app: true,
        agent: false,
    };
    return config;
};
