import {Context} from "egg";
import TokenError from "./error/TokenError";
import EncryptUtils from "../utils/EncryptUtils";
import {BcUser, findOne} from "../database";

export default function (options) {
    return async (ctx: Context, next) => {
        if (ctx.request.url.indexOf("/safe/login") === -1) {
            const token = ctx.request.queryParams["_token"];
            TokenError.hasText(token);
            const tokenObj = EncryptUtils.decryptToken(token);
            TokenError.available(tokenObj.expires);
            ctx.user= await findOne(BcUser,tokenObj.userId);
        }
        await next();
    };
};