import {Application} from "egg";

export default (app: Application) => {
    app.once("server", async (server) => {
        app.loggers.logger.info("[app-recycle]", "once");
    });

    app.on("error", (err, ctx) => {
        app.loggers.logger.info("[app-recycle]", "on error");
    });

    app.on("request", (ctx) => {
        app.loggers.logger.info("[app-recycle]", "on request");
    });

    app.on("response", (ctx) => {
        app.loggers.logger.info("[app-recycle]", "on response");
    });
};
