import {Column, ViewEntity} from "typeorm";
import {BaseView} from "../BaseView";

@ViewEntity({
    name: "bd_bill_view",
    expression: `select bill.*,
       user.name           as user_name,
       billType.name       as bill_type_name,
       billType.type       as bill_type_type,
       card.name           as card_name,
       card.user_id        as card_user_id,
       cardUser.name       as card_user_name,
       targetCard.name     as target_card_name,
       targetCard.user_id  as target_card_user_id,
       targetCardUser.name as target_card_user_name
from bd_bill bill
       left join bc_bill_type billType on billType.id = bill.bill_type_id
       left join bc_user user on user.id = bill.user_id
       left join bc_card card on card.id = bill.card_id
       left join bc_user cardUser on cardUser.id = card.id
       left join bc_card targetCard on targetCard.id = bill.target_card_id
       left join bc_user targetCardUser on targetCardUser.id = targetCard.user_id`,
})
export class BdBillView extends BaseView {
    @Column({name: "money"})
    money: number;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "date_time"})
    dateTime: Date;

    @Column({name: "bill_type_id"})
    billTypeId: string | null;

    @Column({name: "user_id"})
    userId: string | null;

    @Column({name: "card_id"})
    cardId: string | null;

    @Column({name: "target_card_id"})
    targetCardId: string;

    @Column({name: "user_name"})
    userName: string;

    @Column({name: "bill_type_name"})
    billTypeName: string;

    @Column({name: "card_name"})
    cardName: string;

    @Column({name: "card_user_id"})
    cardUserId: string;

    @Column({name: "card_user_name"})
    cardUserName: string;

    @Column({name: "target_card_name"})
    targetCardName: string;

    @Column({name: "target_card_user_id"})
    targetCardUserId: string;

    @Column({name: "target_card_user_name"})
    targetCardUserName: string;

    @Column({name: "bill_type_type"})
    billTypeType: string;
}
