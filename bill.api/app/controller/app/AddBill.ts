import BaseController from "../../BaseController";

export default class extends BaseController {
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
