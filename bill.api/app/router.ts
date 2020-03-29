import {Application} from "egg";

const REST_FUNC = ["create", "destroy", "update", "index", "show"];

interface ControllerRouter {
    name: string;
    fatherPath:string;
    func();
}

function getAllRouters(controller, fatherPath): ControllerRouter[] {
    let routers: ControllerRouter[] = [];
    for (const key of Object.keys(controller)) {
        const value = controller[key];
        const path = fatherPath + "/" + key.replace(/[A-Z]/g, (item) => "-" + item.toLowerCase());
        if (typeof value === "function") {
            routers.push({
                name: key.replace(/[A-Z]/g, (item) => "-" + item.toLowerCase()),
                fatherPath:fatherPath,
                func: value,
            });
        } else if (typeof value === "object") {
            routers = [...routers, ...getAllRouters(value, path)];
        }
    }
    return routers;
}

export default (app: Application) => {
    const {controller, router} = app;
    const allRoutes = getAllRouters(controller, "");
    const restRoutePathSet = new Set();
    router.prefix("/api");
    for (const route of allRoutes) {
        if (REST_FUNC.includes(route.name)) {
            if (!restRoutePathSet.has(route.fatherPath)) {
                router.resources(route.fatherPath, route.fatherPath, route.func);
                app.loggers.logger.info("[register-router]","REST "+ route.fatherPath);
                restRoutePathSet.add(route.fatherPath);
            }
        } else {
            let path = route.fatherPath + "/" + route.name;
            router.get(path,route.fatherPath+"/"+path, route.func)
            app.loggers.logger.info("[register-router]","GET "+ path);
        }
    }
};
