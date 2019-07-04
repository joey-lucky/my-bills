import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import BaseEntity from "../BaseEntity";

@Entity()
export class BcBillType extends BaseEntity {
    @Column({name:"name"})
    name: string;

    @Column({name:"sort"})
    sort: number;

    @Column({name:"type",comment:"-1支出 1收入 0转账"})
    type: string;
}
