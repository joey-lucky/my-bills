import * as orm from "typeorm";
import {AfterLoad, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {translate} from "./translate";

export class BaseEntity extends orm.BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({name: "create_time", nullable: true, type: "datetime"})
    createTime: Date;

    @UpdateDateColumn({name: "update_time", nullable: true, type: "datetime"})
    updateTime: Date;

    @Column({name: "create_by", length: 36, nullable: true})
    createBy: string;

    @Column({name: "update_by", length: 36, nullable: true})
    updateBy: string | null;

    @AfterLoad()
    async deleteUselessColumn(){
        delete this.createBy;
        delete this.updateBy;
        delete this.createTime;
        delete this.updateTime;
    }

    @AfterLoad()
    async translateColumn(){
        await translate(this)
    }
}
