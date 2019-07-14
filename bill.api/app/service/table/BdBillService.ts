import {Service} from "egg";
import {DeepPartial, getCustomRepository, getManager} from "typeorm";
import BdBillRepo from "../../database/repositories/BdBillRepo";
import {BdBill} from "../../database/entity/BdBill";
import BdStatBillMRepo from "../../database/repositories/BdStatBillMRepo";
import {BdBillTransfer} from "../../database/entity/BdBillTransfer";
import Assert from "../../utils/Assert";

export default class BdBillService extends Service {
    async create() {
        let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["data"][0];
        let userId = this.ctx.user.id;
        let targetCardId = params["targetCardId"];
        let bill: BdBill = BdBill.create(params);
        let billTransfer: BdBillTransfer;
        bill.userId = userId;
        bill.createBy = userId;
        if (targetCardId) {
            billTransfer = new BdBillTransfer();
            billTransfer.targetCardId = targetCardId;
            billTransfer.createBy = userId;
        }
        await getManager().transaction(async manager => {
            await manager.save(bill, {reload: true});
            if (billTransfer) {
                billTransfer.billId = bill.id;
                await manager.save(billTransfer);
            }
        });
        await getCustomRepository(BdStatBillMRepo).generateOneMonth(bill.dateTime);
        this.ctx.body.message = "创建成功";
    }

    async update() {
        let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["data"][0];
        let userId = this.ctx.user.id;
        let bill: BdBill = BdBill.create(params);
        bill.userId = userId;
        bill.updateBy = userId;
        let billId = bill.id;
        let billTransfer: BdBillTransfer = await BdBillTransfer.findOne({where: {billId: billId}});
        if (billTransfer) {
            billTransfer.targetCardId = params["targetCardId"];
            billTransfer.updateBy = userId;
        }
        await getManager().transaction(async manager => {
            await manager.save(bill, {reload: true});
            if (billTransfer) {
                await manager.save(billTransfer);
            }
        });
        await getCustomRepository(BdStatBillMRepo).generateOneMonth(bill.dateTime);
        this.ctx.body.message = "更新成功";
    }

    async delete() {
        const params: any = this.ctx.request.queryObjects;
        let entity = await getCustomRepository(BdBillRepo).findOne(params.id);
        Assert.notNull(entity, "账单不存在");
        await BdBill.delete({id: params.id});
        await BdBillTransfer.delete({billId: params.id});
        await getCustomRepository(BdStatBillMRepo).generateOneMonth(entity.dateTime);
        this.ctx.body.message = "删除成功";
    }

    async getList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await getCustomRepository(BdBillRepo).getViewList(params);
    }
}
