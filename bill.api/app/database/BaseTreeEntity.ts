import {BeforeInsert, BeforeUpdate} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {Column} from "./decorator";
import Assert from "../utils/Assert";

export class BaseTreeEntity extends BaseEntity {
    @Column({nullable:true})
    parentId: string;

    @BeforeInsert()
    @BeforeUpdate()
    verifyParentId(){
        if (this.id && this.parentId) {
            Assert.isTrue(this.id !== this.parentId,"id不能等于parentId");
        }
    }
}
