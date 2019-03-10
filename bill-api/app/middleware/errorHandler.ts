import TokenError from "./error/TokenError";
import {Context, RequestResult,PageInfo} from "egg";
import * as assert from "assert";

export default function (options) {
    return async (ctx: Context, next) => {
        let objects = ctx.request.queryObjects;
        let pageInfo:PageInfo= objects.pageInfo||{};
        let defResult:RequestResult = {
            pageInfo: pageInfo,
            code: "1",
            message: "",
            data: [],
            status: "200"
        };
        ctx.body = defResult;
        try {
            await next();
            if (ctx.body) {
                let data = ctx.body.data;
                assert.ok(Array.isArray(data),"ctx.body.data must be array")
            }else {
                ctx.body = {
                    ...defResult,
                    message: "数据异常",
                    code: "0"
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
            }
            ctx.logger.info("[errorHandler]", e);
        }
    };
};