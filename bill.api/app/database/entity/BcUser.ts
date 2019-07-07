import {Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import * as moment from "moment";
import * as orm from "typeorm";
import Assert from "../../utils/Assert";

@Entity()
export class BcUser extends orm.BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name:"name"})
    name: string;

    @Column({name:"login_name"})
    loginName: string;

    @Column({name:"login_password"})
    loginPassword: string;

    @Column({name:"pic"})
    pic: string;

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


}
