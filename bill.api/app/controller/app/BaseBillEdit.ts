import {Controller} from "egg";

export default class extends Controller {
    public async getCardList() {
        this.ctx.body.data = await await this.ctx.service.table.bcCardService.groupByUser();
    }
    public async getBillTypeList() {
        this.ctx.body.data = await await this.ctx.service.table.bcBillTypeService.groupByType();
    }
}
