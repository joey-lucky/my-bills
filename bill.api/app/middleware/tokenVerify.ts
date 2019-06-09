import {Context} from "egg";
import TokenError from "./error/TokenError";
import EncryptUtils from "../utils/EncryptUtils";
import {getCustomRepository} from "typeorm";
import BcUserRepo from "../database/repositories/BcUserRepo";

export default function (options) {
    return async (ctx: Context, next) => {
        if (ctx.request.url.indexOf("/safe/login") === -1) {
            const token = ctx.request.queryParams["_token"];
            TokenError.hasText(token);
            const tokenObj = EncryptUtils.decryptToken(token);
            TokenError.available(tokenObj.expires);
            ctx.user= await getCustomRepository(BcUserRepo).findOne(tokenObj.userId);
        }
        await next();
    };
};