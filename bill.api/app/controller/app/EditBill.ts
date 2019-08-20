import {Controller} from "egg";

export default class extends Controller {
    //获取账单列表
    public async getBillList() {
        const params: any = this.ctx.request.queryObjects;
        this.ctx.body.data = await this.ctx.service.table.bdBillService.getList(params);
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
