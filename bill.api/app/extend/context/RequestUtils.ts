import {Context, PageInfo} from "egg";

export default class RequestUtils {
    public getPageInfo(ctx: Context): PageInfo {
        const query = this.getQueryObject(ctx) || {};
        const pageInfo = query.pageInfo || {};
        return {
            pageIndex: pageInfo.pageIndex,
            pageSize: pageInfo.pageSize,
            pageCount: 0,
            rowCount: 0,
        };
    };

    public getQueryParams(ctx: Context): { [key: string]: string } {
        return ctx.query;
    };

    public getQueryObject(ctx: Context): { [key: string]: any } {
        const params = this.getQueryParams(ctx);
        const newParams: { [key: string]: any } = {};
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value) {
                const parse: string | object = JSON.parse(value);
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
