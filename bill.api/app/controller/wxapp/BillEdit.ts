import {Controller} from "egg";
import {DeepPartial, getCustomRepository} from "typeorm";
import BcCardRepo from "../../database/repositories/BcCardRepo";
import BcBillTypeRepo from "../../database/repositories/BcBillTypeRepo";
import {BdBill} from "../../database/entity/BdBill";
import RequestError from "../../model/RequestError";

export default class extends Controller {
    public async getConsumerList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getConsumerList();
    }

    public async createBill() {
        try {
            let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["bd_bill"][0];
            await this.ctx.service.billEditService.createBill(params);
            this.ctx.body.message = "账单创建成功";
        } catch (e) {
            throw new RequestError("账单创建失败", e);
        }
    }

    public async getCardList() {
        this.ctx.body.data = await getCustomRepository(BcCardRepo).getGroupByUserViewList();
    }

    public async getBillTypeList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getGroupByTypeList();
    }

}
