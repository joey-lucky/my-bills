import {
    Column,
    Entity,
    FindConditions,
    FindOperator,
    getRepository,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne
} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcBillType} from "./BcBillType";
import {BcCard} from "./BcCard";
import {BdBillTransfer} from "./BdBillTransfer";
import * as moment from "moment";

@Entity()
export class BdBill extends BaseEntity {
    @Column({name: "card_id"})
    cardId: string;

    @Column({name: "user_id"})
    userId: string;

    @Column({name: "bill_type_id"})
    billTypeId: string;

    @Column({name: "money",type:"double",scale:2})
    money: number;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({
        name: "date_time",
        type:"datetime",
        transformer: {
            from: (date: Date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string) => moment(date).toDate(),
        }
    })
    dateTime: string;

    @ManyToOne(type => BcCard)
    @JoinColumn({name: "card_id"})
    card: BcCard;

    @ManyToOne(() => BcUser)
    @JoinColumn({
        name: "user_id"
    })
    user: BcUser;

    @ManyToOne(type => BcBillType)
    @JoinColumn({name: "bill_type_id"})
    billType: BcBillType;

    @OneToOne(type => BdBillTransfer, (transfer) => transfer.bill)
    billTransfer: BdBillTransfer | null;
}
