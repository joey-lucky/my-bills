import {BaseService} from "./BaseService";
import {RestFullService} from "../typings/rest";
import {BcBillType, BdBill, BdStatBillMView, find, findOne} from "../database";
import {Between, FindConditions, getConnection, In, Like} from "typeorm";
import Assert from "../utils/Assert";
import moment = require("moment");

interface QueryParams{
    dateTime?: string[];
    cardId?: string;
    userId?: string;
    billTypeId?: string
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

export default abstract class StatBillM extends BaseService implements RestFullService {
    public async destroy(id: string): Promise<any> {
        return null;
    }

    public async show(id: string): Promise<any> {
        return null;
    }

    public async create(data: any): Promise<any> {
        return null;
    }

    public async update(id: string, data): Promise<any> {
        return null;
    }

    public async index(params: any): Promise<any[]> {
        return null;
    }

    public async getGroupByMonthList(params): Promise<GroupByMonthView[]> {
        let where = this.parseToWhereString(params);
        //language=MySQL
        let sql = "select date_format(t.dateTime, '%Y-%m-%d %H:%i:%s') as dateTime,\n" +
            "       sum(t.outgoing) as outgoing,\n" +
            "       sum(t.income) as income,\n" +
            "       sum(t.surplus) as surplus\n" +
            "from bd_stat_bill_m_view t\n " +
            where +
            "group by t.dateTime\n" +
            "order by t.dateTime desc";
        let data = await getConnection().query(sql);
        for (let item of data) {
            item.outgoing = formatPointValue(item.outgoing);
            item.income = formatPointValue(item.income);
            item.surplus = formatPointValue(item.surplus);
        }
        return data;
    }

    public async getSumData(params): Promise<GroupByMonthView[]> {
        let where = this.parseToWhereString(params);
        //language=MySQL
        let sql = "select  sum(t.outgoing) as outgoing,\n" +
            "       sum(t.income) as income,\n" +
            "       sum(t.surplus) as surplus\n" +
            "from bd_stat_bill_m_view t\n " + where;
        let data = await getConnection().query(sql);
        for (let item of data) {
            item.outgoing = formatPointValue(item.outgoing);
            item.income = formatPointValue(item.income);
            item.surplus = formatPointValue(item.surplus);
        }
        return data;
    }

    private parseToWhereString(params:QueryParams={}){
        let where = "where 1 = 1 ";
        const {dateTime,cardId,billTypeId,userId} = params;
        if (dateTime) {
            let [start, end] = dateTime;
            if (start) {
                where += ` and t.dateTime >= str_to_date('${start}','%Y-%m-%d %H:%i:%s')`;
            }
            if (end) {
                where += ` and t.dateTime <= str_to_date('${end}','%Y-%m-%d %H:%i:%s')`;
            }
        }
        if (cardId) {
            where += ` and t.cardId = '${cardId}'`;
        }
        if (billTypeId) {
            where += ` and t.billTypeId = '${billTypeId}'`;
        }
        if (userId) {
            where += ` and t.userId = '${userId}'`;
        }
        return where;
    }
}
