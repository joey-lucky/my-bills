import * as orm from "typeorm";
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

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

    @BeforeInsert()
    completeCreateInfo(){
        if (!this.createTime) {
            this.createTime = new Date();
        }
        if (!this.createBy) {
            this.createBy = "admin";
        }
    }

    @BeforeUpdate()
    completeUpdateInfo(){
        if (!this.updateTime) {
            this.updateTime = new Date();
        }
        if (!this.updateBy) {
            this.updateBy = "admin";
        }
    }

    @AfterLoad()
    deleteUselessColumn(){
        delete this.createBy;
        delete this.updateBy;
        delete this.createTime;
        delete this.updateTime;
    }
}
