import * as orm from "typeorm";
import {CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import * as moment from "moment";
import {Context} from "egg";
import {BcUser} from "./entity/BcUser";

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

    @JoinColumn({name: "create_by"})
    createBy: string;

    @JoinColumn({name: "update_by"})
    updateBy: string | null;

    @ManyToOne(() => BcUser, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "create_by"})
    createByUser: BcUser|null;

    @ManyToOne(() => BcUser, {onDelete: "SET NULL", onUpdate: "CASCADE"})
    @JoinColumn({name: "update_by"})
    updateByUser: BcUser|null;
}
