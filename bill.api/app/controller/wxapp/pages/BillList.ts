import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../../database/repositories/BdStatBillMRepo";

export default class extends Controller {
    //获取账单月统计列表
    public async getMonthStatList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdStatBillMRepo).getGroupByMonthData(params);
    }

    //获取账单列表
    public async getBillList() {
        await this.ctx.service.table.bdBillService.getList();
    }
}
