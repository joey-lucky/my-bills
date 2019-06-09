import * as orm from "typeorm";
import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import * as moment from "moment";
import {Application, Context} from "egg";

export default class BaseEntity extends orm.BaseEntity {
    public ctx?: Context | undefined;

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({
        name: "create_time",
        transformer: {
            from: (date: Date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string) => moment(date).toDate(),
        }
    })
    createTime: string;

    @UpdateDateColumn({
        name: "update_time",
        nullable: true,
        transformer: {
            from: (date: Date) => date && moment(date).format("YYYY-MM-DD HH:mm:ss"),
            to: (date: string) => date && moment(date).toDate(),
        }
    })
    updateTime: string | null;

    @Column({name: "create_by"})
    createBy: string;

    @Column({name: "update_by", nullable: true})
    updateBy: string | null;
}
