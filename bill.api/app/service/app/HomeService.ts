import {Service} from "egg";
import * as moment from "moment";

export default class HomeService extends Service {
    public async getCurrTotal(): Promise<any[]> {
        const result = {
            today: await this.getCurrTotalItemData(this.getTodayRange()),
            toWeek: await this.getCurrTotalItemData(this.getToWeekRange()),
            toMonth: await this.getCurrTotalItemData(this.getToMonthRange()),
            preMonth: await this.getCurrTotalItemData(this.getPreMonthRange()),
        };
        return [result];
    }

    private async getCurrTotalItemData(dateRange = []) {
        const sql = "select t2.type,\n" +
            "       round(sum(t.money), 2) as money\n" +
            "from bd_bill t\n" +
            "       left join bc_bill_type t2 on t.bill_type_id = t2.id\n" +
            "where t.date_time >= str_to_date(?,'%Y-%m-%d %H:%i:%s')\n" +
            " and t.date_time <= str_to_date(?,'%Y-%m-%d %H:%i:%s')\n" +
            "group by t2.type\n";
        const data = (await this.app.database.query(sql, dateRange)) || [];
        const result: any = {
            startDate: dateRange[0],
            endDate: dateRange[1],

        };
        data.forEach((item) => {
            if (item.type === "1") {
                result.income = item.money;
            } else if (item.type === "-1") {
                result.outgoing = item.money;
            }
        });
        return result;
    }

    private getTodayRange() {
        const today = moment();
        return [today.format("YYYY-MM-DD 00:00:00"), today.format("YYYY-MM-DD 23:59:59")];
    }

    private getToWeekRange() {
        const weekOfDay = Number.parseInt(moment("2018-10-29", "YYYY-MM-DD").format("E")); //计算指定日期是这周第几天
        const start = moment().subtract(weekOfDay - 1, "days"); //周一日期
        const end = moment().add(7 - weekOfDay, "days"); //周日日期
        return [start.format("YYYY-MM-DD 00:00:00"), end.format("YYYY-MM-DD 23:59:59")];
    }

    private getToMonthRange() {
        const month = moment();
        return [month.format("YYYY-MM-01 00:00:00"), month.endOf("month").format("YYYY-MM-DD 23:59:59")];
    }

    private getPreMonthRange() {
        const month = moment().add(-1, "month");
        return [month.format("YYYY-MM-01 00:00:00"), month.endOf("month").format("YYYY-MM-DD 23:59:59")];
    }

}
