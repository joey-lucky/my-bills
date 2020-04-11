import {Application} from "egg";
import {createOneClient} from "./database";

export default (app: Application) => {
    if (app.config.database.app) {
        app.addSingleton('database', createOneClient);
    }
};
