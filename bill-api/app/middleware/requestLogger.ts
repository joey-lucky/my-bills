export default function(options) {
    return async (ctx, next)=> {
        let startTime = Date.now();
        await next();
        let delay = Date.now() - startTime;
        let {body} = ctx;
        ctx.app.mLoggers.request.info(ctx.originalUrl, "result-size=" + body.data.length,"(" + delay + "ms)");
    };
};
