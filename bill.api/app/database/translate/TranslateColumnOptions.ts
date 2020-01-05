import {BaseEntity} from "../BaseEntity";

export interface TranslateColumnOptions {
    /**
     * 外键,根据这个外键获取对应的实体
     */
    foreignKey: string,

    /**
     * 外键表实体，如果为空，会根据外键字段名进行自动获取
     */
    target?: typeof BaseEntity,

    /**
     * 获取外键表的值，默认是Name。
     */
    getSourceValue?(source:BaseEntity): any;
}