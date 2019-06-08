import {Context} from "egg";

export default function (options) {
    return async (ctx: Context, next) => {
        const startTime = Date.now();
        await next();
        const delay = Date.now() - startTime;
        const {body} = ctx;
        ctx.logger.info(
            "[request]",
            ctx.originalUrl,
            "result-size=" + body.data.length, "(" + delay + "ms)",
            ctx.status,
        );
    };
};
