import {Context} from "egg";
import * as jwt from "jsonwebtoken";
import {BcUser, findOneWithCache} from "../database";
import {TokenPlayLoad} from "../typings/token";
import Assert from "../utils/Assert";

export default function (options) {
    return async (ctx: Context, next) => {
        if (ctx.request.url.indexOf("/safe/login") === -1) {
            const authorization: string = ctx.request.header.authorization;
            Assert.hasText(authorization, "header authorization is null");
            const token = authorization.replace("Bearer ", "");
            const secret = ctx.app.config.secret;
            // @ts-ignore
            const playLoad: TokenPlayLoad = jwt.verify(token, secret);
            ctx.user = await findOneWithCache(BcUser, playLoad.userId);
        }
        await next();
    };
};
