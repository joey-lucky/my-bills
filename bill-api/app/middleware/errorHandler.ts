import TokenError from "./error/TokenError";

export default function (options) {
    return async (ctx, next)=>{
        try {
            await next();
            ctx.body.status = "200";
        } catch (e) {
            ctx.body = {
                data: [],
                message: e.message,
                code: "0"
            };
            if (e instanceof TokenError) {
                ctx.body.status ="403";
            }
        }
    };
};