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

    get typeName(){
        if (this.type === "-1") {
            return "支出";
        } else if (this.type === "1") {
            return "收入";
        } else {
            return "其它";
        }
    }

    static getTypeByTypeName(name){
        if ("支出" === name) {
            return "-1";
        }else if("收入" === name){
            return "1";
        }else {
            return "0";
        }
    }
}
