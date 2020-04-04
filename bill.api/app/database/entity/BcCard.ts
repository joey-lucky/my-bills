import {Column, Entity} from "typeorm";
import {BaseEntity} from "../BaseEntity";

@Entity()
export class BcCard extends BaseEntity {
    @Column({name: "name"})
    name: string;

    @Column({name: "balance", type: "double"})
    balance: number;

    @Column({name: "user_id", length: 36})
    userId: string | null;

    @Column({name: "card_type_id", length: 36})
    cardTypeId: string | null;
}
