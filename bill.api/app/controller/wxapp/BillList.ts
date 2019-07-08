import {Controller} from "egg";
import {DeepPartial, getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../database/repositories/BdStatBillMRepo";
import BdBillRepo from "../../database/repositories/BdBillRepo";
import {BdBill} from "../../database/entity/BdBill";

export default class extends Controller {
    //添加账单
    public async getMonthStatList() {
        const params:any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdStatBillMRepo).getGroupByMonthData(params);
    }

    //添加账单
    public async getBillList() {
        const params:any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdBillRepo).getViewList(params);
    }

    //添加账单
    public async deleteBill() {
        const params:any = this.ctx.request.queryObjects;
        await getCustomRepository(BdBillRepo).delete({id: params.id});
        this.ctx.body.message = "删除成功";
    }

    //添加账单
    public async updateBill() {
        let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["bd_bill"][0];
        let entity: BdBill = getCustomRepository(BdBillRepo).create(params);
        entity.updateBy = this.ctx.user.id;
        await getCustomRepository(BdBillRepo).save(entity);
        this.ctx.body.message = "更改成功";
    }
}
