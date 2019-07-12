import {Controller} from "egg";
import {DeepPartial, getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../database/repositories/BdStatBillMRepo";
import BdBillRepo from "../../database/repositories/BdBillRepo";
import {BdBill} from "../../database/entity/BdBill";
import {BdBillTemplate} from "../../database/entity/BdBillTemplate";

export default class extends Controller {
    //获取账单月统计列表
    public async getMonthStatList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdStatBillMRepo).getGroupByMonthData(params);
    }

    //获取账单列表
    public async getBillList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdBillRepo).getViewList(params);
    }

    //删除账单
    public async deleteBill() {
        const params: any = this.ctx.request.queryObjects;
        let entity = await getCustomRepository(BdBillRepo).findOne(params.id);
        await getCustomRepository(BdBillRepo).delete({id: params.id});
        await getCustomRepository(BdStatBillMRepo).generateOneMonth(entity.dateTime);
        this.ctx.body.message = "删除成功";
    }

    //更改账单
    public async updateBill() {
        let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["bd_bill"][0];
        let entity: BdBill = getCustomRepository(BdBillRepo).create(params);
        entity.updateBy = this.ctx.user.id;
        await getCustomRepository(BdBillRepo).save(entity);
        await getCustomRepository(BdStatBillMRepo).generateOneMonth(entity.dateTime);
        this.ctx.body.message = "更改成功";
    }


}
