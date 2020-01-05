import {setForeignKeyEntity} from "./TranslateConfig";
import {BaseEntity} from "../BaseEntity";

export function TranslateSource(bindForeignKey:string) {
    return function (Entity:typeof BaseEntity){
        setForeignKeyEntity(bindForeignKey, Entity);
    };
}