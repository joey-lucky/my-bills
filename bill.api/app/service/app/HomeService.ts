import {Service} from "egg";
import {getConnection} from "typeorm";
import moment = require("moment");

export default class HomeService extends Service {
    public async getCurrTotal(): Promise<any[]> {
        async function getCurrTotalItemData(dateRange = []) {
            let sql = "select t2.type,\n" +
                "       round(sum(t.money), 2) as money\n" +
                "from bd_bill t\n" +
                "       left join bc_bill_type t2 on t.bill_type_id = t2.id\n" +
                "where t.date_time >= str_to_date(?,'%Y-%m-%d %H:%i:%s')\n" +
                " and t.date_time <= str_to_date(?,'%Y-%m-%d %H:%i:%s')\n" +
                "group by t2.type\n";
            let data = (await getConnection().query(sql, dateRange)) || [];
            let result: any = {
                startDate: dateRange[0],
                endDate: dateRange[1],

            };
            data.forEach(item => {
                if (item.type === "1") {
                    result.income = item.money;
                } else if (item.type === "-1") {
                    result.outgoing = item.money;
                }
            });
            return result;
        }

        let result = {
            today: await getCurrTotalItemData(this.getTodayRange()),
            toWeek: await getCurrTotalItemData(this.getToWeekRange()),
            toMonth: await getCurrTotalItemData(this.getToMonthRange()),
            preMonth: await getCurrTotalItemData(this.getPreMonthRange()),
        };
        return [result];
    }


    private getTodayRange() {
        let today = moment();
        return [today.format("YYYY-MM-DD 00:00:00"), today.format("YYYY-MM-DD 23:59:59")];
    }

    private getToWeekRange() {
        let weekOfDay = Number.parseInt(moment("2018-10-29", 'YYYY-MM-DD').format('E'));//计算指定日期是这周第几天
        let start = moment().subtract(weekOfDay - 1, 'days');//周一日期
        let end = moment().add(7 - weekOfDay, 'days');//周日日期
        return [start.format("YYYY-MM-DD 00:00:00"), end.format("YYYY-MM-DD 23:59:59")];
    }

    private getToMonthRange() {
        let month = moment();
        return [month.format("YYYY-MM-01 00:00:00"), month.endOf("month").format("YYYY-MM-DD 23:59:59")];
    }

    private getPreMonthRange() {
        let month = moment().add(-1, "month");
        return [month.format("YYYY-MM-01 00:00:00"), month.endOf("month").format("YYYY-MM-DD 23:59:59")];
    }

}
