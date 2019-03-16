import {Application, Context, PageResult, Service} from 'egg';
import Assert from "../../utils/Assert";
import StringUtils from "../../utils/StringUtils";

export default class BdBill extends Service {
    //添加普通账单
    public async createBill(params: any): Promise<void> {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userInfo = await ctx.getUserInfo();
        Assert.isTrue(params && params["bd_bill"] && params["bd_bill"].length > 0, "数据不能为空");
        let transaction = await app.sqlExecutor.beginTransaction();
        try {
            let billData: any[] = params["bd_bill"];
            for (let bill of billData) {
                bill["user_id"] = userInfo["id"];
                let billTransfers:any[] = (bill.children && bill.children["bd_bill_transfer"]) || [];
                for (let billTransfer of billTransfers) {



                }
                await app.tableRowHelper.completeInsertTableRow(billData, ctx);
                await app.sqlExecutor.insert("bd_bill", billData);

            }


            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }

        let billData = params["bd_bill"][0];
        billData["user_id"] = userInfo["id"];
        let children = billData.children || {};
        await app.tableRowHelper.completeInsertTableRow(billData, ctx);


        await app.tableRowHelper.completeInsertTableRow(billData, ctx);
        await app.sqlExecutor.insert("bd_bill", billData);
    }

    //添加普通账单
    public async createNormalBill(params: any): Promise<void> {
        Assert.isTrue(params && params["bd_bill"] && params["bd_bill"].length === 1, "数据不能为空");
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userInfo = await ctx.getUserInfo();
        let billList: any[] = params["bd_bill"];
        let billData = billList[0];
        billData["user_id"] = userInfo["id"];
        await app.tableRowHelper.completeInsertTableRow(billData, ctx);
        await app.sqlExecutor.insert("bd_bill", billData);
    }

    //修改普通账单
    public async updateNormalBill(params: any): Promise<void> {
        Assert.isTrue(params && params["bd_bill"] && params["bd_bill"].length === 1, "数据不能为空");
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userInfo = await ctx.getUserInfo();
        let billList: any[] = params["bd_bill"];
        let billData = billList[0];
        billData["user_id"] = userInfo["id"];
        await app.tableRowHelper.completeUpdateTableRow(billData, ctx);
        await app.sqlExecutor.update("bd_bill", billData);
    }

    //添加转账账单
    public async createTransferBill(params: any): Promise<void> {
        Assert.isTrue(params, "数据不能为空");
        Assert.isTrue(params["bd_bill"] && params["bd_bill"].length === 1, "数据不能为空");
        Assert.isTrue(params["bd_bill_transfer_detail"] && params["bd_bill_transfer_detail"].length === 1, "数据不能为空");

        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userInfo = await ctx.getUserInfo();
        let billList: any[] = params["bd_bill"];
        let transferList: any[] = params["bd_bill_transfer_detail"];
        let billData = billList[0];
        let transferData = transferList[0];
        billData["user_id"] = userInfo["id"];
        await app.tableRowHelper.completeInsertTableRow(billData, ctx);
        await app.tableRowHelper.completeInsertTableRow(transferData, ctx);
        let transaction = await app.sqlExecutor.beginTransaction();
        try {
            await transaction.insert("bd_bill", billData);
            await transaction.insert("bd_bill_transfer_detail", transferData);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    //修改转账账单
    public async updateTransferBill(params: any): Promise<void> {
        Assert.isTrue(params, "数据不能为空");
        Assert.isTrue(params["bd_bill"] && params["bd_bill"].length === 1, "数据不能为空");
        Assert.isTrue(params["bd_bill_transfer_detail"] && params["bd_bill_transfer_detail"].length === 1, "数据不能为空");
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userInfo = await ctx.getUserInfo();
        let billList: any[] = params["bd_bill"];
        let transferList: any[] = params["bd_bill_transfer_detail"];
        let billData = billList[0];
        let transferData = transferList[0];
        billData["user_id"] = userInfo["id"];
        await app.tableRowHelper.completeUpdateTableRow(billData, ctx);
        await app.tableRowHelper.completeUpdateTableRow(transferData, ctx);
        let transaction = await app.sqlExecutor.beginTransaction();
        try {
            await transaction.update("bd_bill", billData);
            await transaction.update("bd_bill_transfer_detail", transferData);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    //获取分页账单信息
    public async getBillPageData(params: any): Promise<PageResult> {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        let userId = params["user_id"];
        let pageInfo = params["pageInfo"];
        Assert.notNull(pageInfo, "page info is null");
        const {sqlExecutor, tableRowHelper} = app;
        // language=MySQL
        let sql = "select t.*,\n" +
            "       t1.pic,\n" +
            "       t3.name       as cardUserName,\n" +
            "       case\n" +
            "         when to_days(t.date_time) = to_days(now()) then \'今天\'\n" +
            "         when to_days(t.date_time) = to_days(now()) - 1 then \'昨天\'\n" +
            "         when yearweek(t.date_time) = yearweek(now()) then \'本周\'\n" +
            "         when DATE_FORMAT(t.date_time, \'%Y%m\') = DATE_FORMAT(now(), \'%Y%m\') then \'本月\'\n" +
            "         else date_format(t.date_time, \'%Y年%m月\') end as timeDesc\n" +
            "from bd_bill t\n" +
            "       left join bc_user t1 on t1.id = t.user_id\n" +
            "       left join bc_card t2 on t2.id = t.card_id\n" +
            "       left join bc_user t3 on t3.id = t2.user_id\n" +
            "where 1 = 1\n";
        let queryParams: any[] = [];
        if (StringUtils.hasText(userId)) {
            sql += "  and t.user_id = ?\n";
            queryParams.push(userId);
        }
        sql += "order by t.date_time desc";
        let result = await sqlExecutor.queryPage(sql, queryParams, params.pageInfo);
        for (let row of result.rows) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bd_bill", row);
        }
        return result;
    }
}
