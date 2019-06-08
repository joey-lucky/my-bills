import {Context} from "egg";
import TokenError from "./error/TokenError";

export default function (options) {
    return async (ctx: Context, next) => {
        if (ctx.request.url.indexOf("/safe/login") === -1) {
            const token = ctx.request.queryParams["_token"];
            const {app: {tokenCrypto}} = ctx;
            TokenError.hasText(token);
            const tokenObj = tokenCrypto.parseToken(token);
            TokenError.available(tokenObj.expires);
        }
        await next();
    };
};