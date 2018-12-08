export default class Table {
    readonly tableName: string;
    primaryKeyAliasName?: string="";
    primaryNameAliasName?: string="";
    fields: Field[]=[];
    foreignKeys: string[]=[];

    constructor(tableName: string) {
        this.tableName = tableName;
    }
}

export class Field {
    name: string;
    isPrimary: boolean;
    dataType:string;
}

export class DataType {
    private static VARCHAR = "varchar";
    private static DATE = "date";

    static isVarchar(fieldName:string){
        return this.VARCHAR = fieldName;
    }

    static isDate(fieldName:string){
        return this.DATE = fieldName;
    }

}