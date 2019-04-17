import Row from "./Row";
import Table from "./Table";

export interface AppCache {
    tableStructure: Map<string, Table> ;
    bcForeignKey: Map<string, Map<string, ForeignKeyData>>;
    bcTableCache: Map<string, Row[]>;
}

export interface ForeignKeyData {
    foreignKey:string,
    foreignName:string,
    foreignValue:string,
}

export function createAppCache() :AppCache{
    return {
        tableStructure: new Map<string, Table>(),
        bcForeignKey: new Map<string, Map<string, ForeignKeyData>>(),
        bcTableCache: new Map<string, Row[]>(),
    }
}
