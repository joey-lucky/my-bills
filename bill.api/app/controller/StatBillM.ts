import BaseRestFullController from "./BaseRestFullController";
import {RestFullService} from "../typings/rest";
import Assert from "../utils/Assert";

export default class StatBillM extends BaseRestFullController {
    protected getService(): RestFullService {
        return this.service.statBillM;
    }

    public async destroy() {
        throw new Error("not support del");
    }

    public async show() {
        throw new Error("not support getOne");
    }

    public async update() {
        throw new Error("not support put");
    }

    public async create() {
        throw new Error("not support post");
    }

    //获取账单月统计列表
    public async getGroupByMonthList() {
        let params = this.ctx.request.queryObjects;
        let data = await this.ctx.service.statBillM.getGroupByMonthList(params);
        this.successData(data);
    }

    public async getStatData() {
        let params = this.ctx.request.queryObjects;
        let data = await this.ctx.service.statBillM.getSumData(params);
        this.successData(data);
    }
}