import {Controller} from "egg";

export default class extends Controller {
    //获取账单列表
    public async getBillList() {
        await this.ctx.service.table.bdBillService.getList();
    }

    //更改账单
    public async updateBill() {
        await this.ctx.service.table.bdBillService.update();
    }

    //删除账单
    public async deleteBill() {
        await this.ctx.service.table.bdBillService.delete();
    }
}
