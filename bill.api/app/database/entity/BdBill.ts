import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BcUser} from "./BcUser";
import {BcBillType} from "./BcBillType";
import {BcCard} from "./BcCard";
import {BdBillTransfer} from "./BdBillTransfer";
import * as moment from "moment";

@Entity()
export class BdBill extends BaseEntity {
    @Column({name: "money", type: "double", scale: 2})
    money: number;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({
        name: "date_time",
        type: "datetime",
        transformer: {
            from: (date: Date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string) => moment(date).toDate(),
        }
    })
    dateTime: string;

    @Column({name: "bill_type_id",length:36,nullable:true})
    billTypeId: string|null;

    @Column({name: "user_id",length:36,nullable:true})
    userId: string|null;

    @Column({name: "card_id",length:36,nullable:true})
    cardId: string|null;

    @ManyToOne(() => BcBillType, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "bill_type_id"})
    billType: BcBillType;

    @ManyToOne(() => BcUser, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: BcUser;

    @ManyToOne(() => BcCard, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "card_id"})
    card: BcCard;

    @OneToOne(type => BdBillTransfer, (transfer) => transfer.bill)
    billTransfer: BdBillTransfer | null;
}
