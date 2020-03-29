import BaseController from "../../BaseController";

export default class extends BaseController {
    public async list() {
        this.ctx.body.data = await this.ctx.service.table.bcCardService.getAssetList();
    }

    public async groupByTypeList() {
        this.ctx.body.data = await this.ctx.service.table.bcCardService.groupByType();
    }
}
