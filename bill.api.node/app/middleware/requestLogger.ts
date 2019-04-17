import {Context} from "egg";

export default function (options) {
    return async (ctx: Context, next) => {
        let startTime = Date.now();
        await next();
        let delay = Date.now() - startTime;
        let {body} = ctx;
        ctx.logger.info(
            "[request]",
            ctx.originalUrl,
            "result-size=" + body.data.length, "(" + delay + "ms)",
            ctx.status
        );
    };
};
