import {Column, Entity} from "typeorm";
import BaseEntity from "../BaseEntity";

@Entity()
export class BdBillTemplate extends BaseEntity {
    @Column({name: "bill_desc"})
    billDesc: string;

    @Column({name: "bill_type_id", length: 36})
    billTypeId: string | null;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_id", length: 36})
    cardId: string | null;
}
