export default function(options) {
    return async (ctx, next)=> {
        let startTime = Date.now();
        await next();
        let delay = Date.now() - startTime;
        let {body} = ctx;
        ctx.logger.info("(" + delay + "ms)", "length=" + body.data.length);
    };
};
