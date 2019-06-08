import {Column, Entity} from "typeorm";
import BaseEntity from "../BaseEntity";


@Entity()
export class BcBillType extends BaseEntity {
    @Column({name:"name"})
    name: string;

    @Column({name:"sort"})
    sort: number;

    @Column({name:"type"})
    type: string;
}
