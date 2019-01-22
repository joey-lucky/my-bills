export default function (options) {
    return async (ctx, next)=>{
        let result: any = {
            data: [],
            message: "",
            code: "1"
        };
        await next();
        let {body} = ctx;
        if (body) {
            if (Array.isArray(body)) {
                result.data = body;
                if (body.length === 0) {
                    result.message = "数据为空";
                }
            } else if (typeof body=='string') {
                result.message = body;
                result.data = [];
            } else {
                result.data = [body];
            }
        } else {
            result.code = "0";
            result.message = "数据异常";
        }

        try {

        } catch (e) {
            result.message = e.message;
            result.code = "0"
        }
        ctx.body = result;
    };
};