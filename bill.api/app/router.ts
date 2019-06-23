import {Application} from "egg";

interface ControllerRouter {
    path: string;
    func();
}

function getAllRouters(controller, fatherPath): ControllerRouter[] {
    let routers: ControllerRouter[] = [];
    for (const key of Object.keys(controller)) {
        const value = controller[key];
        const path = fatherPath + "/" + key.replace(/[A-Z]/g, (item) => "-" + item.toLowerCase());
        if (typeof value === "function") {
            routers.push({
                path,
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
    router.prefix("/api");
    for (const route of allRoutes) {
        router.all(route.path, route.func);
        app.loggers.logger.info("[register-router]", route.path);
    }
};
