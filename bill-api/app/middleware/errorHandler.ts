export default function (options) {
    return async (ctx, next)=>{
        try {
            await next();
        } catch (e) {
            ctx.body = {
                data: [],
                message: e.message,
                code: "0"
            };
            console.error(e);
        }
    };
};