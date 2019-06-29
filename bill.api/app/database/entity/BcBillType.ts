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
    //
    // @ManyToOne(type => BcBillType, category => category.children)
    // @JoinColumn({name: "parent_id"})
    // parent: BcBillType;
    //
    // @OneToMany(type => BcBillType, category => category.parent)
    // children: BcBillType[];
}
