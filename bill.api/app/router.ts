import {Application} from "egg";
import {requestMappingSet} from "./utils/routeUtil";

const REST_FUNC = ["create", "destroy", "update", "index", "show"];
const IGNORE_FUNC = ["successData","successPageData","parseResultData","getService","getUniqueId"];

export default (app: Application) => {
    const {controller, router} = app;
    router.prefix("/bill/api");
    let routerProxy = new Proxy(router, {
        get (target,name:string,property){
            return (...args) => {
                let path = args[1];
                app.loggers.logger.info("[register-router]",name+" "+ path);
                router[name](...args);
            };
        }
    });
    routerProxy.resources("users", "/conf/users", controller.conf.users);
    routerProxy.resources("bill-types", "/conf/bill-types", controller.conf.billTypes);
    routerProxy.resources("cards", "/conf/cards", controller.conf.cards);
    routerProxy.resources("card-types", "/conf/card-types", controller.conf.cardType);
    routerProxy.resources("bill-templates", "/conf/bill-templates", controller.conf.billTemplates);
    routerProxy.resources("dict-types", "/conf/dict-types", controller.conf.dictType);
    routerProxy.resources("dict-datas", "/conf/dict-datas", controller.conf.dictData);

    routerProxy.resources("bills", "/data/bills", controller.data.bills);

    routerProxy.get("safe", "/safe/login", controller.safe.login);
};
