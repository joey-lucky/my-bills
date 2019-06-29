import {Controller} from "egg";
import {DeepPartial, getCustomRepository} from "typeorm";
import BcCardRepo from "../../database/repositories/BcCardRepo";
import BcBillTypeRepo from "../../database/repositories/BcBillTypeRepo";
import {BdBill} from "../../database/entity/BdBill";
import BdBillRepo from "../../database/repositories/BdBillRepo";
import RequestError from "../../model/RequestError";
import {BdBillTransfer} from "../../database/entity/BdBillTransfer";
import {getRepository} from "typeorm/browser";

export default class extends Controller {
    public async getConsumerList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getConsumerList();
    }

    public async createBill() {
        try {
            let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["bd_bill"][0];
            params.userId = this.ctx.user.id;
            params.createBy = this.ctx.user.id;
            let targetCardId = params["targetCardId"];
            let entity: BdBill = getCustomRepository(BdBillRepo).create(params);
            if (targetCardId) {
                let transfer = new BdBillTransfer();
                transfer.targetCardId = targetCardId;
                transfer.bill = entity;
                await transfer.save();
            }else {
                await entity.save();
            }
        } catch (e) {
            throw new RequestError("账单创建失败", e);
        }
        this.ctx.body.message = "账单创建成功";
    }

    public async getCardList() {
        this.ctx.body.data = await getCustomRepository(BcCardRepo).getGroupByUserViewList();
    }

    public async getBillTypeList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getGroupByTypeList();
    }

}
