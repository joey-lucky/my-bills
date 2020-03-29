import BaseController from "../../BaseController";

export default class extends BaseController {
    //获取模板列表
    public async getBillTemplateList() {
        const data = await this.ctx.service.table.bdBillTemplateService.findByCtxUser();
        this.successData(data);
    }

    //保存模板
    public async createBillTemplate() {
        await this.ctx.service.table.bdBillTemplateService.create();
        this.successData();
    }

    //更改模板
    public async updateBillTemplate() {
        await this.ctx.service.table.bdBillTemplateService.update();
        this.successData();
    }

    //保存账单
    public async createBill() {
        await this.ctx.service.table.bdBillService.create();
        this.successData();
    }

    public async getConsumerList() {
        const data = await await this.ctx.service.table.bcBillTypeService.getConsumerList();
        this.successData(data);
    }

    public async getCardList() {
        const data  = await await this.ctx.service.table.bcCardService.groupByUser();
        this.successData(data);
    }

    public async getBillTypeList() {
        const data  = await await this.ctx.service.table.bcBillTypeService.groupByType();
        this.successData(data);
    }
}
