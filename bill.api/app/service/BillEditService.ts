import {Service} from "egg";
import {DeepPartial, getManager} from "typeorm";
import {BdBill} from "../database/entity/BdBill";
import {BdBillTransfer} from "../database/entity/BdBillTransfer";

export default class BillEditService extends Service {

    public async createBill(params: DeepPartial<BdBill>):Promise<BdBill> {
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
        return bill;
    }
}
