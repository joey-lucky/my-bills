import {Controller} from "egg";

export default class extends Controller {
    //获取账单列表
    public async getList() {
        this.ctx.body.data = await await this.ctx.service.table.bcBillTypeService.getList();
    }
}
