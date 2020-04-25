import {Column, Entity} from "../decorator";
import {BaseTreeEntity} from "../BaseTreeEntity";
import {Unique} from "typeorm";

@Entity()
@Unique(["typeCode","code"])
export class BcDictData extends BaseTreeEntity {
    @Column()
    code: string;

    @Column()
    value: string;

    @Column()
    order: number;

    @Column()
    typeCode: string;
}
