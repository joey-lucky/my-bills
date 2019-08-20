import {Controller} from "egg";
import {DeepPartial, getCustomRepository} from "typeorm";
import {BdBillTemplate} from "../../database/entity/BdBillTemplate";
import BcBillTypeRepo from "../../database/repositories/BcBillTypeRepo";
import BcCardRepo from "../../database/repositories/BcCardRepo";
import {BcUser} from "../../database/entity/BcUser";

export default class extends Controller {
    //获取模板列表
    public async getBillTemplateList(){
        this.ctx.body.data = await BdBillTemplate.getViewList({userId: this.ctx.user.id})
    }

    //保存模板
    public async createBillTemplate() {
        let params: DeepPartial<BdBillTemplate> = this.ctx.request.queryObjects["data"][0];
        params.userId = this.ctx.user.id;
        let entity = BdBillTemplate.create(params);
        await entity.save();
        this.ctx.body.message = "保存成功";
    }

    //保存模板
    public async updateBillTemplate() {
        let params: DeepPartial<BdBillTemplate> = this.ctx.request.queryObjects["data"][0];
        params.userId = (await BcUser.getAdminUser()).id;
        let entity = BdBillTemplate.create(params);
        await entity.save();
        this.ctx.body.message = "保存成功";
    }

    //保存账单
    public async createBill() {
        await this.ctx.service.table.bdBillService.create();
    }

    public async getConsumerList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getConsumerList();
    }

    public async getCardList() {
        this.ctx.body.data = await getCustomRepository(BcCardRepo).getGroupByUserViewList();
    }

    public async getBillTypeList() {
        this.ctx.body.data = await getCustomRepository(BcBillTypeRepo).getGroupByTypeList();
    }

}
