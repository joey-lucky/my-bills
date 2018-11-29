import * as Router from "koa-router";

export default class Controller {
    path = "";

    constructor(path = "") {
        this.path = path;
    }

    public registerRouter(router:Router){
        let methodNames = Object.keys(this)
            .filter((methodName) => {
                return true;
            })
            .map((methodName) => {
                return methodName.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
            });
        methodNames.forEach((value, index, array) => {
            let urlName = value.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
            let childObject :any = this;
            router.all(this.path + "/" + urlName, childObject[value]);
        })
    }
}
