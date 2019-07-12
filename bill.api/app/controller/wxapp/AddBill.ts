import {Controller} from "egg";
import {DeepPartial, getCustomRepository} from "typeorm";
import BdStatBillMRepo from "../../database/repositories/BdStatBillMRepo";
import BdBillRepo from "../../database/repositories/BdBillRepo";
import {BdBill} from "../../database/entity/BdBill";
import {BdBillTemplate} from "../../database/entity/BdBillTemplate";
import BcBillTypeRepo from "../../database/repositories/BcBillTypeRepo";
import RequestError from "../../model/RequestError";
import BcCardRepo from "../../database/repositories/BcCardRepo";

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

    //保存模板
    public async createBillTemplate() {
        let params: DeepPartial<BdBillTemplate> = this.ctx.request.queryObjects["data"][0];
        let entity = BdBillTemplate.create(params);
        await entity.save();
        this.ctx.body.message = "保存成功";
    }

    //获取模板列表
    public async getBillTemplateList(){
        this.ctx.body.data = await BdBillTemplate.getViewList({userId: this.ctx.user.id})
    }
}
