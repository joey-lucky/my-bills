import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BcBillTemplate extends BaseEntity {
    @Column({name: "name", length: 255})
    name: string;

    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;

    @Column({name: "target_card_id", length: 36, nullable: true})
    targetCardId: string | null;
}