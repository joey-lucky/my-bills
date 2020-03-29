import BaseController from "../../BaseController";

export default class StatBillM extends BaseController {
    //获取账单月统计列表
    public async getGroupByMonthList() {
        const params = this.ctx.request.queryObjects;
        const data = await this.ctx.service.statBillM.getGroupByMonthList(params);
        this.successData(data);
    }

    public async getStatData() {
        const params = this.ctx.request.queryObjects;
        const data = await this.ctx.service.statBillM.getSumData(params);
        this.successData(data);
    }
}