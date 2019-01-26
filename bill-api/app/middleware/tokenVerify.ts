import {Context} from "egg";
import * as assert from "assert";
import TokenError from "./error/TokenError";

export default function (options) {
    return async (ctx:Context, next)=>{
        if (ctx.request.url.indexOf("/safe/login") === -1) {
            let {app: {sqlExecutor, tokenCrypto}} = ctx;
            let token = ctx.query["_token"];
            if (!token) {
                throw new TokenError();
            }
            let [userId, expires] = tokenCrypto.parseToken(token);
            assert.ok(Date.now() < expires, "token expire");
            ctx.userInfo = await sqlExecutor.get("bc_user", {id: userId});
        }
        await next();
    };
};