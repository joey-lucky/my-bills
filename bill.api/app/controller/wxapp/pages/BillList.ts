import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../../database/repositories/BdStatBillMRepo";
import {BcUser} from "../../../database/entity/BcUser";

export default class extends Controller {
    //获取账单月统计列表
    public async getMonthStatList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdStatBillMRepo).getGroupByMonthData(params);
    }

    //获取账单月统计列表
    public async getSumStatList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdStatBillMRepo).getSumData(params);
    }

    //获取账单列表
    public async getBillList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data =  await this.ctx.service.table.bdBillService.getList(params);
    }

    //获取账单列表
    public async getUserList() {
        this.ctx.body.data = await BcUser.find();
    }
}
