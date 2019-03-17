import {Application, Context, Controller} from 'egg';
import RequestError from "../../../model/RequestError";

/**
 * 信用卡账单
 */
export default class CreditBillAdd extends Controller {
    /**
     * 添加转账账单
     */
    public async createBill(){
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let queryParams = this.ctx.request.queryObjects;
        let bdBills = queryParams["bd_bill"]||[];
        let bdTransfers = queryParams["bd_bill_transfer"]||[];
        let userInfo = await ctx.getUserInfo();
        let conn = await app.sqlExecutor.beginTransaction();
        try{
            for (let bdBill of bdBills) {
                bdBill["user_id"] = userInfo["id"];
                await app.tableRowHelper.completeInsertTableRow(bdBill, ctx);
                await conn.insert("bd_bill", bdBill);
            }
            for (let bdTransfer of bdTransfers) {
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
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let queryParams = this.ctx.request.queryObjects;
        let bdBills = queryParams["bd_bill"]||[];
        let bdTransfers = queryParams["bd_bill_transfer"]||[];
        let conn = await app.sqlExecutor.beginTransaction();
        try{
            for (let bdBill of bdBills) {
                await app.tableRowHelper.completeUpdateTableRow(bdBill, ctx);
                await conn.update("bd_bill", bdBill);
            }
            for (let bdTransfer of bdTransfers) {
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
        let ctx = this.ctx;
        let bcCardService = ctx.service.table.bcCard;
        ctx.body.data = await bcCardService.getListByCardTypeId("ee48fce0-2c74-11e9-ad9d-8b0a6420bc1c");
    }

    /**
     * 获取现金银行卡（只包含银行卡和金融储蓄）
     */
    public async getCashCardList() {
        let ctx = this.ctx;
        let bcCardService = ctx.service.table.bcCard;
        ctx.body.data = await bcCardService.getListByCardTypeId(['eb7a9aa0-2c74-11e9-ad9d-8b0a6420bc1c','e448b730-2c74-11e9-ad9d-8b0a6420bc1c']);
    }
}
