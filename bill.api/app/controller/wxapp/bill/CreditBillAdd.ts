import {Application, Context, Controller} from "egg";
import RequestError from "../../../model/RequestError";

/**
 * 信用卡账单
 */
export default class CreditBillAdd extends Controller {
    /**
     * 添加转账账单
     */
    public async createBill(){
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        const queryParams = this.ctx.request.queryObjects;
        const bdBills = queryParams["bd_bill"] || [];
        const bdTransfers = queryParams["bd_bill_transfer"] || [];
        const userInfo = await ctx.getUserInfo();
        const conn = await app.sqlExecutor.beginTransaction();
        try{
            for (const bdBill of bdBills) {
                bdBill["user_id"] = userInfo["id"];
                await app.tableRowHelper.completeInsertTableRow(bdBill, ctx);
                await conn.insert("bd_bill", bdBill);
            }
            for (const bdTransfer of bdTransfers) {
                await app.tableRowHelper.completeInsertTableRow(bdTransfer, ctx);
                await conn.insert("bd_bill_transfer", bdTransfer);
            }
            await conn.commit();
        }catch (e) {
            await conn.rollback();
            throw new RequestError("账单创建失败", e);
        }
        ctx.body.message = "账单创建成功";
    }

    /**
     * 添加转账账单
     */
    public async updateBill(){
        const app: Application = this.app;
        const ctx: Context = this.ctx;
        const queryParams = this.ctx.request.queryObjects;
        const bdBills = queryParams["bd_bill"] || [];
        const bdTransfers = queryParams["bd_bill_transfer"] || [];
        const conn = await app.sqlExecutor.beginTransaction();
        try{
            for (const bdBill of bdBills) {
                await app.tableRowHelper.completeUpdateTableRow(bdBill, ctx);
                await conn.update("bd_bill", bdBill);
            }
            for (const bdTransfer of bdTransfers) {
                await app.tableRowHelper.completeUpdateTableRow(bdTransfer, ctx);
                await conn.update("bd_bill_transfer", bdTransfer);
            }
            await conn.commit();
        }catch (e) {
            await conn.rollback();
            throw new RequestError("账单更新失败", e);
        }
        ctx.body.message = "账单更新成功";
    }

    /**
     * 获取信用卡列表
     */
    public async getCreditCardList() {
        const ctx = this.ctx;
        const bcCardService = ctx.service.table.bcCard;
        ctx.body.data = await bcCardService.getListByCardTypeId("ee48fce0-2c74-11e9-ad9d-8b0a6420bc1c");
    }

    /**
     * 获取现金银行卡（只包含银行卡和金融储蓄）
     */
    public async getCashCardList() {
        const ctx = this.ctx;
        const bcCardService = ctx.service.table.bcCard;
        ctx.body.data = await bcCardService.getListByCardTypeId(["eb7a9aa0-2c74-11e9-ad9d-8b0a6420bc1c", "e448b730-2c74-11e9-ad9d-8b0a6420bc1c"]);
    }
}
