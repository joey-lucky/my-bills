import {EntityRepository, getConnection, getCustomRepository} from "typeorm";
import BaseRepository from "../BaseRepository";
import {BdStatBillM} from "../entity/BdStatBillM";
import * as moment from "moment";
import {BcUser} from "../entity/BcUser";

function formatPointValue(value: number) {
    return Math.round(value * 100) / 100;
}

@EntityRepository(BdStatBillM)
export default class BdStatBillMRepo extends BaseRepository<BdStatBillM> {
    public async getGroupByMonthData(params: { dateTime: string[] }): Promise<GroupByMonthView[]> {
        let where = "where 1 = 1 ";
        if (params.dateTime) {
            let [start, end] = params.dateTime;
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

    public async generateOneMonth(datetime){
        let mom = moment(datetime);
        let start = mom.format("YYYY-MM-01 00:00:00");
        let end = mom.add(1, "M").add(1, "s").format("YYYY-MM-DD HH:mm:ss");
        await getCustomRepository(BdStatBillMRepo).generate([start,end]);
    }

    public async generate(dateTime?: [string, string]) {
        let where = "";
        let deleteWhere = "";
        if (dateTime) {
            let [start, end] = dateTime;
            if (start) {
                where += ` and t.date_time >= str_to_date('${start}','%Y-%m-%d %H:%i:%s')`;
                deleteWhere += ` and date_time >= str_to_date('${start}','%Y-%m-%d %H:%i:%s')`;
            }
            if (end) {
                where += ` and t.date_time <= str_to_date('${end}','%Y-%m-%d %H:%i:%s')`;
                deleteWhere += ` and date_time <= str_to_date('${end}','%Y-%m-%d %H:%i:%s')`;
            }
        }

        //language=MySQL
        let sql = "select ROUND(sum(t.money), 2)                                            as surplus,\n" +
            "       round(sum(case when t.money >= 0 then t.money else 0 end), 2)     as income,\n" +
            "       round(sum(case when t.money < 0 then abs(t.money) else 0 end), 2) as outgoing,\n" +
            "       DATE_FORMAT(t.date_time, '%Y-%m')                                 as date_time,\n" +
            "       t.user_id\n" +
            "from bd_bill t\n" +
            "       left join bc_bill_type t1 on t1.id = t.bill_type_id\n" +
            "where 1 = 1\n" +
            "  and t1.type <> '0'\n" + where +
            "group by DATE_FORMAT(t.date_time, '%Y-%m'), t.user_id\n";
        let data = await getConnection().query(sql);
        let adminUser = await BcUser.getAdminUser();
        let entities = [];
        for (let item of data) {
            let dateTime = item["date_time"] + "-01 00:00:00";
            let entity = new BdStatBillM();
            entity.createBy = adminUser.id;
            entity.dateTime = dateTime;
            entity.income = item["income"];
            entity.outgoing = item["outgoing"];
            entity.surplus = item["surplus"];
            entity.userId = item["user_id"];
            entities.push(entity);
        }
        let deleteSql = "delete from bd_stat_bill_m  where 1=1 " + deleteWhere;
        await BdStatBillM.query(deleteSql);
        await BdStatBillM.save(entities);
    }
}

interface GroupByMonthView {
    outgoing: number;
    income: number;
    surplus: number;
    dateTime: string;
}