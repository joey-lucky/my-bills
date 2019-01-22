export default function (options) {
    return async (ctx, next)=>{
        if (ctx.request.method === "GET") {
            ctx.query = ctx.request.query;
        } else {
            ctx.query = ctx.request.body;
        }
        await next();
    };
};
