async function requestHandler(ctx, next) {
    let result: any = {
        data: [],
        message: "",
        code: "1"
    };
    try {
        if (ctx.request.method === "GET") {
            ctx.query = ctx.request.query;
        } else {
            ctx.query = ctx.request.body;
        }
        await next();
        let {body} = ctx;
        if (body) {
            if (Array.isArray(body)) {
                result.data = body;
                if (body.length === 0) {
                    result.message = "数据为空";
                }
            } else {
                result.data = [body];
            }
        } else {
            result.code = "0";
            result.message = "数据异常";
        }
    } catch (e) {
        result.message = e.message;
        result.code = "0"
    }
    ctx.body = result;
}


export default function (options) {
    return requestHandler;
};
