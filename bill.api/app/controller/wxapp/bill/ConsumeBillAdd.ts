import {Controller} from "egg";
import RequestError from "../../../model/RequestError";
import {DeepPartial, getCustomRepository} from "typeorm";
import BcBillTypeRepo from "../../../database/repositories/BcBillTypeRepo";
import BcCardRepo from "../../../database/repositories/BcCardRepo";
import {BdBill} from "../../../database/entity/BdBill";
import BdBillRepo from "../../../database/repositories/BdBillRepo";

/**
 * 信用卡账单
 */
export default class IncomeBillAdd extends Controller {
    public async createBill() {
        try {
            let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["bd_bill"][0];
            let entity: BdBill = getCustomRepository(BdBillRepo).create(params);
            await getCustomRepository(BdBillRepo).save(entity);
        } catch (e) {
            throw new RequestError("账单创建失败", e);
        }
        this.ctx.body.message = "账单创建成功";
    }

    public async updateBill() {
        try {
            let params: DeepPartial<BdBill> = this.ctx.request.queryObjects["bd_bill"][0];
            let entity: BdBill = getCustomRepository(BdBillRepo).create(params);
            await getCustomRepository(BdBillRepo).save(entity);
        } catch (e) {
            throw new RequestError("账单更新失败", e);
        }
        this.ctx.body.message = "账单更新成功";
    }

    public async getCardList() {
        this.ctx.body.data = await getCustomRepository(BcCardRepo).getViewList();
    }

    public async getBillTypeList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getConsumerList();
    }
}
