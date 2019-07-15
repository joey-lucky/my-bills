import {Controller} from "egg";

export default class extends Controller {
    //获取账单列表
    public async getBillPageData() {
        await this.ctx.service.table.bdBillService.getPageData();
    }
}
