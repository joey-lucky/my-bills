import {EggAppConfig, EggAppInfo, PowerPartial} from "egg";

const middleware = ["errorHandler", "requestLogger", "tokenVerify"];
export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + "_18576651723";
    // add your egg config in here
    config.middleware = middleware;
    // add your special config in here
    // the return config will combines to EggAppConfig
    return {
        ...config,
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: true,
                cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
                sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
                headerName: 'x-csrf-token',
                ignore: (ctx) => {
                    let url = ctx.request.url;
                    let ignoreUrls = ["/api/safe/login"];
                    if (ignoreUrls.includes(url)) {
                        return true;
                    }
                    return false;
                }
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
