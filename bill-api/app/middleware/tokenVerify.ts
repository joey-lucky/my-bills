import {Context} from "egg";
import * as assert from "assert";

export default function (options) {
    return async (ctx:Context, next)=>{
        let {app} = ctx;
        let token = ctx.query["_token"];
        assert.ok(token, "token is null");
        let [userId,expires] = app.tokenCrypto.parseToken(token);
        assert.ok(Date.now() < expires, "token expire");
        ctx.userInfo = await app.sqlExecutor.get("bc_user", {id:userId});
        await next();
    };
};