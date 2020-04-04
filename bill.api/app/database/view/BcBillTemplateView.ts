import {Column, ViewEntity} from "typeorm";
import {BaseView} from "../BaseView";

@ViewEntity({
    name: "bc_bill_template_view",
    expression: `select billTemplate.*,
       user.name           as user_name,
       billType.name       as bill_type_name,
       billType.type       as bill_type_type,
       card.name           as card_name,
       card.user_id        as card_user_id,
       cardUser.name       as card_user_name,
       targetCard.name     as target_card_name,
       targetCard.user_id  as target_card_user_id,
       targetCardUser.name as target_card_user_name
from bc_bill_template billTemplate
       left join bc_bill_type billType on billType.id = billTemplate.bill_type_id
       left join bc_user user on user.id = billTemplate.user_id
       left join bc_card card on card.id = billTemplate.card_id
       left join bc_user cardUser on cardUser.id = card.id
       left join bc_card targetCard on targetCard.id = billTemplate.target_card_id
       left join bc_user targetCardUser on targetCardUser.id = targetCard.user_id`,
})
export class BcBillTemplateView extends BaseView {
    @Column({name: "name"})
    name: string;

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
