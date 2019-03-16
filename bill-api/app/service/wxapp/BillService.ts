import {Service} from 'egg';
import Assert from "../../utils/Assert";

export default class BillService extends Service {

    public async createCreditBill(): Promise<void> {
        let bdBill = this.ctx.service.table.bdBill;
        let params = this.ctx.request.queryObjects;
        let billList: any[] = params["bd_bill"];
        let transferList: any[] = params["bd_bill_transfer_detail"];
        Assert.isTrue(Array.isArray(billList), "bd_bill is not array");
        Assert.isTrue(Array.isArray(transferList), "bd_bill_transfer_detail is not array");
        Assert.isTrue(billList.length === 1, "bill data length is not 1");
        Assert.isTrue(transferList.length === 1, "bill data length is not 1");
        let billData = billList[0];
        billList[0] = {
            ...billData,
            "bill_type_id": "ee48fce0-2c74-11e9-ad9d-8b0a6420bc1c",
        };
        await bdBill.createTransferBill(params);
    }

}
