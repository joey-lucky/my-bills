import * as assert from "assert";
import {Context, PageInfo, RequestResult} from "egg";
import RequestError from "../model/RequestError";
import TokenError from "./error/TokenError";

export default function (options) {
    return async (ctx: Context, next) => {
        const objects = ctx.request.queryObjects;
        const pageInfo: PageInfo = objects.pageInfo || {};
        const defResult: RequestResult = {
            pageInfo,
            code: "1",
            message: "",
            data: [],
            status: "200",
        };
        ctx.body = defResult;
        try {
            await next();
            if (ctx.body) {
                const data = ctx.body.data;
                assert.ok(Array.isArray(data), "ctx.body.data must be array");
            }else {
                ctx.body = {
                    ...defResult,
                    message: "数据异常",
                    code: "0",
                };
            }
        } catch (e) {
            ctx.body = {
                ...defResult,
                message: e.message,
                code: "0",
            };
            if (e instanceof TokenError) {
                ctx.body.status = "403";
                ctx.logger.error("[errorHandler]", "token error", e);
            }else if (e instanceof RequestError) {
                ctx.logger.error("[errorHandler]", e);
            }else {
                ctx.logger.error("[errorHandler]", e);
            }
        }
    };
};