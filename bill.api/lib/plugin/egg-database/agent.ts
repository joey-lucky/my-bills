import {Application} from "egg";
import {createOneClient} from "./database";

export default (app: Application) => {
    if (app.config.database.agent) {
        app.addSingleton('database', createOneClient);
    }
};
