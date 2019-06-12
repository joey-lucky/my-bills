import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BdBill} from "./BdBill";
import {BcCard} from "./BcCard";

@Entity()
export class BdBillTransfer extends BaseEntity {
    @JoinColumn({name: "bill_id"})
    billId: string;

    @JoinColumn({name: "target_card_id"})
    targetCardId: string;

    @OneToOne(type => BdBill, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn({name: "bill_id"})
    bill: BdBill;

    @OneToOne(type => BcCard)
    @JoinColumn({name: "target_card_id",referencedColumnName:"id"})
    targetCard: BcCard;
}
