import {Application} from 'egg';

export default (app: Application) => {
    const {controller, router} = app;
    router.prefix("/bill/api");
    Object.keys(controller).forEach((controllerName) => {
        let itemController = controller[controllerName];
        Object.keys(itemController)
            .forEach((methodName) => {
                let path = '/' + controllerName + "/" + methodName;
                router.all(path,itemController[methodName]);
            });
    });
    // router.get('/', controller.home.index);
};
