import {BaseEntity} from "../BaseEntity";
import {setForeignKeyEntity} from "./TranslateConfig";

export function TranslateSource(bindForeignKey: string) {
    return function (Entity: typeof BaseEntity){
        setForeignKeyEntity(bindForeignKey, Entity);
    };
}