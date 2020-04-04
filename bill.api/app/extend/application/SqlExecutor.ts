import {Application} from "egg";

export class SqlExecutor {
    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

}
