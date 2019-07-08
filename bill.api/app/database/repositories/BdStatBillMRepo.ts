import {EntityRepository, getConnection, getCustomRepository} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BdStatBillM} from "../entity/BdStatBillM";
import BcUserRepo from "./BcUserRepo";
import moment = require("moment");

function formatPointValue(value: number) {
    return Math.round(value * 100) / 100;
}

@EntityRepository(BdStatBillM)
export default class BdStatBillMRepo extends BaseRepository<BdStatBillM> {
    public async getGroupByMonthData(params: { dateTime: string[] }): Promise<GroupByMonthView[]> {
        let where = "where 1 = 1 ";
        if (params.dateTime) {
            let [start,end] = params.dateTime;
            if (start) {
                where += ` and t.date_time >= str_to_date('${start}','%Y-%m-%d %H:%i:%s')`;
            }
            if (end) {
                where += ` and t.date_time <= str_to_date('${end}','%Y-%m-%d %H:%i:%s')`;
            }
        }
        //language=MySQL
        let sql = "select date_format(t.date_time, '%Y-%m-%d %H:%i:%s') as dateTime,\n" +
            "       sum(t.outgoing) as outgoing,\n" +
            "       sum(t.income) as income,\n" +
            "       sum(t.surplus) as surplus\n" +
            "from bd_stat_bill_m t\n " + where +
            "group by t.date_time\n" +
            "order by t.date_time desc";
        let data = await getConnection().query(sql);
        for (let item of data) {
            item.outgoing = formatPointValue(item.outgoing);
            item.income = formatPointValue(item.income);
            item.surplus = formatPointValue(item.surplus);
        }
        return data;
    }

    public async generate() {
        let dateList = await getDateList();
        let userList = await getCustomRepository(BcUserRepo).find();
        let adminUser = await getCustomRepository(BcUserRepo).getAdminUser();
        let groupByDateMap: Map<string, BdStatBillM> = new Map();
        for (let date of dateList) {
            let datetime = moment(date).format("YYYY-MM-DD HH:mm:ss");
            for (let user of userList) {
                let key = user.id + datetime;
                let entity = new BdStatBillM();
                entity.surplus = 0;
                entity.income = 0;
                entity.outgoing = 0;
                entity.userId = user.id;
                entity.createBy = adminUser.id;
                entity.dateTime = datetime;
                groupByDateMap.set(key, entity);
            }
        }
        //language=MySQL
        let sql = "select ROUND(sum(t.money), 2) as money,\n" +
            "       DATE_FORMAT(t.date_time, '%Y-%m') as date_time,\n" +
            "       t.user_id\n" +
            "from bd_bill t\n" +
            "       left join bc_bill_type t1 on t1.id = t.bill_type_id\n" +
            "where 1 = 1\n" +
            "  and t1.type <> '0'\n" +
            "group by DATE_FORMAT(t.date_time, '%Y-%m'), t.money >= 0, t.user_id\n" +
            "order by DATE_FORMAT(t.date_time, '%Y-%m') asc";
        let data = await getConnection().query(sql);
        for (let item of data) {
            let {money, date_time: datetime, user_id: userId} = item;
            datetime += "-01 00:00:00";
            let key = userId + datetime;
            let entity = groupByDateMap.get(key);
            if (money >= 0) {
                entity.income = formatPointValue(money);
            } else {
                entity.outgoing = formatPointValue(Math.abs(money));
            }
            entity.surplus = formatPointValue(entity.income - entity.outgoing);
        }
        let entities = [...groupByDateMap.values()];
        await this.delete({});
        await this.save(entities);

        async function getDateList(): Promise<Date[]> {
            //language=MySQL
            let sql = "select max(bd_bill.date_time) as max_date,\n" +
                "       min(bd_bill.date_time) as min_date\n" +
                "from bd_bill\n";
            let data = await getConnection().query(sql);
            if (data[0]) {
                let result = [];
                let {max_date: maxDate, min_date: minDate} = data[0];
                let maxMonth = moment(moment(maxDate).format("YYYY-MM"));
                let currMonth = moment(moment(minDate).format("YYYY-MM"));
                let unix = maxMonth.unix();
                while (currMonth.unix() <= unix) {
                    let date = currMonth.toDate();
                    result.push(date);
                    currMonth = currMonth.add(1, "M");
                }
                return result;
            } else {
                return [];
            }
        }
    }
}

interface GroupByMonthView {
    outgoing: number;
    income: number;
    surplus: number;
    dateTime: string;
}