import {getConnection} from "typeorm";
import {BaseService} from "../base.service";

interface QueryParams{
    dateTime?: string[];
    cardId?: string;
    userId?: string;
    billTypeId?: string;
}

interface GroupByMonthView {
    outgoing: number;
    income: number;
    surplus: number;
    dateTime: string;
}

function formatPointValue(value: number) {
    return Math.round(value * 100) / 100;
}

export  class StatBillMService extends BaseService  {
    public async getGroupByMonthList(params): Promise<GroupByMonthView[]> {
        const where = this.parseToWhereString(params);
        //language=MySQL
        const sql = "select date_format(t.date_time, '%Y-%m-%d %H:%i:%s') as dateTime,\n" +
            "       sum(t.outgoing) as outgoing,\n" +
            "       sum(t.income) as income,\n" +
            "       sum(t.surplus) as surplus\n" +
            "from bd_stat_bill_m_view t\n " +
            where +
            "group by t.date_time\n" +
            "order by t.date_time desc";
        const data = await getConnection().query(sql);
        for (const item of data) {
            item.outgoing = formatPointValue(item.outgoing);
            item.income = formatPointValue(item.income);
            item.surplus = formatPointValue(item.surplus);
        }
        return data;
    }

    public async getSumData(params): Promise<GroupByMonthView[]> {
        const where = this.parseToWhereString(params);
        //language=MySQL
        const sql = "select  sum(t.outgoing) as outgoing,\n" +
            "       sum(t.income) as income,\n" +
            "       sum(t.surplus) as surplus\n" +
            "from bd_stat_bill_m_view t\n " + where;
        const data = await getConnection().query(sql);
        for (const item of data) {
            item.outgoing = formatPointValue(item.outgoing);
            item.income = formatPointValue(item.income);
            item.surplus = formatPointValue(item.surplus);
        }
        return data;
    }

    private parseToWhereString(params: QueryParams= {}){
        let where = "where 1 = 1 ";
        const {dateTime, cardId, billTypeId, userId} = params;
        if (dateTime) {
            const [start, end] = dateTime;
            if (start) {
                where += ` and t.date_time >= str_to_date('${start}','%Y-%m-%d %H:%i:%s')`;
            }
            if (end) {
                where += ` and t.date_time <= str_to_date('${end}','%Y-%m-%d %H:%i:%s')`;
            }
        }
        if (cardId) {
            where += ` and t.card_id = '${cardId}'`;
        }
        if (billTypeId) {
            where += ` and t.bill_type_id = '${billTypeId}'`;
        }
        if (userId) {
            where += ` and t.user_id = '${userId}'`;
        }
        return where;
    }
}
