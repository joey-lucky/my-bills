import {Context} from "egg";
import TokenError from "./error/TokenError";

export default function (options) {
    return async (ctx:Context, next)=>{
        if (ctx.request.url.indexOf("/safe/login") === -1) {
            let token = ctx.request.queryParams["_token"];
            let {app: {tokenCrypto}} = ctx;
            TokenError.hasText(token);
            let tokenObj = tokenCrypto.parseToken(token);
            TokenError.available(tokenObj.expires);
        }
        await next();
    };
};