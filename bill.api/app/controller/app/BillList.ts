import BaseController from "../BaseController";

export default class extends BaseController {
    //获取账单月统计列表
    public async getMonthStatList() {
       let data = await this.ctx.service.table.bdStatBillMViewService.getGroupByMonthData();
        this.successData(data);
    }

    //获取账单月统计列表
    public async getSumStatList() {
       let data = await this.ctx.service.table.bdStatBillMViewService.getSumData();
        this.successData(data);
    }

    //获取账单列表
    public async getBillList() {
        let data = await this.ctx.service.table.bdBillService.getList();
        this.successData(data);
    }

    //获取用户列表
    public async getUserList() {
        let data =  await this.ctx.service.table.bcUserService.getList();
        this.successData(data);
    }
}
