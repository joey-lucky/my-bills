
function getResult(data: any[] = [], message: string = "", code: "1" | "0" = "1") {
    return {
        data,message,code
    }
}

export default function (options) {
    return async function gzip(ctx, next) {
        await next();
        let {body} = ctx;
        if (body) {
            if (Array.isArray(body)) {
                if (body.length === 0) {
                    ctx.body = getResult(body,"数据为空");
                }else {
                    ctx.body = getResult(body);
                }
            } else {
                ctx.body = getResult([body]);
            }
        } else{
            ctx.body = getResult([], "数据异常", "0");
        }
    };
};