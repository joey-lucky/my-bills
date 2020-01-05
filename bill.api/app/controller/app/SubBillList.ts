import {Controller} from "egg";

export default class extends Controller {
    //获取账单列表
    public async getBillPageData() {
        let result = await this.service.table.bdBillService.getPageData();
        this.ctx.body.data = result[0];
        this.ctx.body.pageInfo = result[1];
    }
}
