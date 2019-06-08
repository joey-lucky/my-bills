import * as orm from "typeorm";
import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export default class BaseEntity extends orm.BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({name:"create_time"})
    createTime: Date;

    @UpdateDateColumn({name:"update_time",nullable: true})
    updateTime: Date | null;

    @Column({name:"create_by"})
    createBy: string;

    @Column({name:"update_by",nullable: true})
    updateBy: string | null;
}
