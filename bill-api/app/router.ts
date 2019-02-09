import {Application} from 'egg';
import {EggLogger} from 'egg-logger';

interface ControllerRouter {
    path:string,
    func(),
}

function getAllRouters(controller, fatherPath): ControllerRouter[] {
    let routers: ControllerRouter[] = [];
    for (let key of Object.keys(controller)) {
        let value = controller[key];
        let path = fatherPath + "/" + key.replace(/[A-Z]/g,(value)=>"-"+value.toLowerCase());;
        if (typeof value === "function") {
            routers.push({
                path:path,
                func:value
            })
        } else if (typeof value === "object") {
            routers = [...routers, ...getAllRouters(value, path)];
        }
    }
    return routers;
}


export default (app: Application) => {
    const {controller, router} = app;
    const allRoutes = getAllRouters(controller, "");

    router.prefix("/bill/api");
    for (let route of allRoutes) {
        router.all(route.path, route.func);
        if (app.mLoggers && app.mLoggers.initialize) {
            app.mLoggers.initialize.info("[register-router]",route.path);
        }
    }
};
