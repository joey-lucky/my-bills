import {Application, Service} from "egg";
import PageResult from "../../typings/PageResult";
import TranslateConfig from "../../typings/TranslateConfig";
import Assert from "../../utils/Assert";
import StringUtils from "../../utils/StringUtils";

export default class BillListService extends Service {
    /**
     * 获取分页账单信息
     *
     * params:{user_id,date_time,bill_type_id}
     *
     */
    public async getBillPageData(): Promise<PageResult> {
        const ctx = this.ctx;
        const app: Application = this.app;
        const params = this.ctx.request.queryObjects;
        const userId = params["user_id"];
        const dateTime: string[] = params["date_time"] || [];
        const billTypeId: string = params["bill_type_id"];
        const pageInfo = params["pageInfo"];
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
        const queryParams: any[] = [];
        if (StringUtils.hasText(userId)) {
            sql += "  and t.user_id = ?\n";
            queryParams.push(userId);
        }
        if (StringUtils.hasText(billTypeId)) {
            sql += " and t.bill_type_id = ?\n";
            queryParams.push(billTypeId);
        }
        if (dateTime.length > 0) {
            const dateStr = dateTime[0];
            sql += "  and t.date_time >= str_to_date(?, '%Y-%m-%d %H:%i:%s')";
            queryParams.push(dateStr);
        }
        if (dateTime.length > 1) {
            const dateStr = dateTime[1];
            sql += "  and t.date_time <= str_to_date(?, '%Y-%m-%d %H:%i:%s')";
            queryParams.push(dateStr);
        }
        sql += "order by t.date_time desc";
        const result = await app.sqlExecutor.queryPage(sql, queryParams, params.pageInfo);
        for (const row of result.rows) {
            await app.tableRowHelper.translateId(row);
            await app.tableRowHelper.translateDateTime("bd_bill", row);
            await this.completeDetail(row);
        }
        return result;
    }

    private async completeDetail(row: any): Promise<void> {
        const app: Application = this.app;
        if (row["bill_type_type"] === "0") {
            const billId = row.id;
            const sql = "select *\n" +
                "from bd_bill_transfer t\n" +
                "where t.bill_id = ?";
            const rows = await app.sqlExecutor.query(sql, [billId]);
            const translateConfig: TranslateConfig = {foreignName: "target_card_name", foreignKey: "target_card_id", aliasForeignKeyAlias: "card_id"};
            for (const itemRow of rows) {
                await app.tableRowHelper.translateId(itemRow, [translateConfig]);
            }
            const children = row.children || {};
            children["bd_bill_transfer"] = rows;
            row.children = children;
        }
    }
}
