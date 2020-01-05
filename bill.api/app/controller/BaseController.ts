import {Controller} from "egg";
import * as moment from "moment";

export default class BaseController extends Controller {
    protected successData(data = []) {
        this.ctx.body.data = this.parseResultData(data);
    }

    protected  successPageData(data = [], pageInfo) {
        this.ctx.body.data = this.parseResultData(data);
        this.ctx.body.pageInfo = pageInfo;
    }

    //处理数据格式
    private parseResultData(data = []): any[] {
        let result = [];
        for (let item of data) {
            let keys = Object.keys(item);
            for (let key of keys) {
                let value = item[key];
                if (value instanceof Date) {
                    value = moment(value).format("YYYY-MM-DD HH:mm:ss");
                } else if (Array.isArray(value)) {
                    value = this.parseResultData(value);
                }
                item[key] = value;
            }
            result.push(item);
        }
        return result;
    }
}