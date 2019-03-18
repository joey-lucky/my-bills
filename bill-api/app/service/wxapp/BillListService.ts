import {Application, Service} from 'egg';
import Assert from "../../utils/Assert";
import StringUtils from "../../utils/StringUtils";
import PageResult from "../../typings/PageResult";
import TranslateConfig from "../../typings/TranslateConfig";

export default class BillListService extends Service {
    /**
     * 获取分页账单信息
     */
    public async getBillPageData(): Promise<PageResult> {
        let ctx = this.ctx;
        let app: Application = this.app;
        let params = this.ctx.request.queryObjects;
        let userId = params["user_id"];
        let pageInfo = params["pageInfo"];
        Assert.notNull(pageInfo, "page info is null");
        // language=MySQL
        let sql = "select t.*,\n" +
            "       t1.pic,\n" +
            "       t3.name                                       as cardUserName,\n" +
            "       t4.type                                       as bill_type_type,\n" +
            "       case\n" +
            "         when to_days(t.date_time) = to_days(now()) then '今天'\n" +
            "         when to_days(t.date_time) = to_days(now()) - 1 then '昨天'\n" +
            "         when yearweek(t.date_time) = yearweek(now()) then '本周'\n" +
            "         when DATE_FORMAT(t.date_time, '%Y%m') = DATE_FORMAT(now(), '%Y%m') then '本月'\n" +
            "         else date_format(t.date_time, '%Y年%m月') end as timeDesc\n" +
            "from bd_bill t\n" +
            "       left join bc_user t1 on t1.id = t.user_id\n" +
            "       left join bc_card t2 on t2.id = t.card_id\n" +
            "       left join bc_user t3 on t3.id = t2.user_id\n" +
            "       left join bc_bill_type t4 on t4.id = t.bill_type_id\n" +
            "where 1 = 1\n";
        let queryParams: any[] = [];
        if (StringUtils.hasText(userId)) {
            sql += "  and t.user_id = ?\n";
            queryParams.push(userId);
        }
        sql += "order by t.date_time desc";
        let result = await app.sqlExecutor.queryPage(sql, queryParams, params.pageInfo);
        for (let row of result.rows) {
            await app.tableRowHelper.translateId(row);
            await app.tableRowHelper.translateDateTime("bd_bill", row);
            await this.completeDetail(row);
        }
        return result;
    }

    private async completeDetail(row: any): Promise<void> {
        let app: Application = this.app;
        if (row["bill_type_type"] === "0") {
            let billId = row.id;
            let sql = "select *\n" +
                "from bd_bill_transfer t\n" +
                "where t.bill_id = ?";
            let rows = await app.sqlExecutor.query(sql, [billId]);
            let translateConfig: TranslateConfig = {foreignName:"target_card_name",foreignKey:"target_card_id",aliasForeignKeyAlias:"card_id"};
            for (let itemRow of rows) {
                await app.tableRowHelper.translateId(itemRow,[translateConfig]);
            }
            let children = row.children || {};
            children["bd_bill_transfer"] = rows;
            row.children = children;
        }
    }
}
