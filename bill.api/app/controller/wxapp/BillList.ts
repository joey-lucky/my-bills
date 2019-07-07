import {Controller} from "egg";
import {getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../database/repositories/BdStatBillMRepo";
import BdBillRepo from "../../database/repositories/BdBillRepo";

export default class extends Controller {
    //添加账单
    public async getMonthStatList() {
        this.ctx.body.data = await getCustomRepository(BdStatBillMRepo).getGroupByMonthData();
    }

    //添加账单
    public async getBillList() {
        const params = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdBillRepo).getViewList(params);
    }
}
