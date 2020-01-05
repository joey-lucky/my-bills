import {Column, ViewColumn, ViewEntity} from "typeorm";
import {BaseView} from "../BaseView";
import {TranslateColumn} from "../translate";

@ViewEntity({
    name:"bd_stat_bill_m_view",
    expression: `select surplus,
         income,
         outgoing,
         str_to_date(concat(date_time, '-01 00:00:00'), '%Y-%m-%d %H:%i:%s')as dateTime,
         bill_type_id as billTypeId,
         card_id as cardId,
         user_id as userId
  from (select ROUND(sum(t.money), 2)                                            as surplus,
               round(sum(case when t.money >= 0 then t.money else 0 end), 2)     as income,
               round(sum(case when t.money < 0 then abs(t.money) else 0 end), 2) as outgoing,
               DATE_FORMAT(t.date_time, '%Y-%m')                                 as date_time,
               t.bill_type_id,
               t.card_id,
               t.user_id
        from bd_bill t
               left join bc_bill_type t1 on t1.id = t.bill_type_id
        where 1 = 1
          and t1.type <> '0'
        group by DATE_FORMAT(t.date_time, '%Y-%m'), t.user_id, t.bill_type_id, t.card_id) t`
})
export class BdStatBillMView extends BaseView{
    @ViewColumn()
    surplus: number;

    @ViewColumn()
    income: number;

    @ViewColumn()
    outgoing: number;

    @ViewColumn()
    dateTime: Date;

    @ViewColumn()
    userId: string;

    @ViewColumn()
    cardId: string;

    @ViewColumn()
    billTypeId: string;

    @TranslateColumn({foreignKey: "billTypeId"})
    billTypeName: string;

    @TranslateColumn({foreignKey: "userId"})
    userName: string;

    @TranslateColumn({foreignKey: "cardId"})
    cardName: string;
}
