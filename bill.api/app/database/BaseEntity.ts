import * as orm from "typeorm";
import {
    AfterInsert,
    BeforeInsert, BeforeUpdate,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import * as moment from "moment";
import {Context} from "egg";
import {BcUser} from "./entity/BcUser";
import {Column} from "typeorm";
import {InsertEvent} from "typeorm";

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

    @Column({name: "create_by",length:36})
    createBy: string;

    @Column({name: "update_by",length:36,nullable:true})
    updateBy: string | null;

    @ManyToOne(() => BcUser, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "create_by"})
    createByUser: BcUser|null;

    @ManyToOne(() => BcUser, {onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({name: "update_by"})
    updateByUser: BcUser|null;

    @BeforeInsert()
    async completeCreateBy() {
        if (!this.createBy) {
            this.createBy = (await BcUser.getAdminUser()).id;
        }
        return this;
    }

    @BeforeUpdate()
    async completeUpdateBy() {
        if (!this.updateBy) {
            this.updateBy = (await BcUser.getAdminUser()).id;
        }
    }
}
