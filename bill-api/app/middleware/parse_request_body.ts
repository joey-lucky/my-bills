export default function(options) {
    return async function gzip(ctx, next) {
        if (ctx.request.method === "GET") {
            ctx.query = ctx.request.query;
        } else {
            ctx.query = ctx.request.body;
        }
        await next();
    };
};
