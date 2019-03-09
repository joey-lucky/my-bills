import {Context, PageInfo} from "egg";

export default class RequestUtils {
    public getPageInfo(ctx: Context): PageInfo {
        let query = this.getQueryObject(ctx) || {};
        let pageInfo = query.pageInfo || {};
        return {
            pageIndex: pageInfo.pageIndex,
            pageSize: pageInfo.pageSize,
            pageCount: 0,
            rowCount: 0,
        }
    };

    public getQueryParams(ctx: Context): { [key: string]: string } {
        return ctx.query;
    };

    public getQueryObject(ctx: Context): { [key: string]: any } {
        let params = this.getQueryParams(ctx);
        let newParams: { [key: string]: any } = {};
        Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value) {
                let parse: string | object = JSON.parse(value);
                if (typeof parse === "object") {
                    newParams[key] = parse;
                } else {
                    newParams[key] = value;
                }
            }
        });
        return newParams;
    };
};
