import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import BaseEntity from "../BaseEntity";
import {BdBill} from "./BdBill";
import {BcCard} from "./BcCard";

@Entity()
export class BdBillTransfer extends BaseEntity {
    @Column({name: "bill_id",length:36})
    billId: string;

    @Column({name: "target_card_id",length:36})
    targetCardId: string;

    @OneToOne(type => BdBill, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn({name: "bill_id"})
    bill: BdBill;

    @ManyToOne(type => BcCard)
    @JoinColumn({name: "target_card_id",referencedColumnName:"id"})
    targetCard: BcCard;
}
