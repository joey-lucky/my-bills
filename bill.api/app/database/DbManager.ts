import {
    BaseEntity,
    DeepPartial,
    DeleteResult,
    EntityManager,
    EntitySchema,
    FindManyOptions,
    ObjectID,
    ObjectType,
    SaveOptions
} from "typeorm";
import {Application} from "egg";

export interface PageInfo {
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;
    count?: number;
}

interface ColumnOption {
    alias?:string;
    ignore?: string[];
}

export class DbManager {
    private manager: EntityManager;
    private app: Application;

    constructor(app: Application, manager: EntityManager) {
        this.manager = manager;
        this.app = app;
    }

    //转成驼峰
    public async getCamelColumnSql(tableName: string, options:ColumnOption = {}): Promise<string> {
        const alias = options.alias || tableName;
        const ignore = options.ignore || ["create_time", "update_time", "create_by", "update_by"];
        const ignoreSql = ignore.map(item => "'" + item + "'").join(",");
        let columnSql = `select t.COLUMN_NAME as column_name from information_schema.columns t
         where t.table_name = @tableName
          and t.COLUMN_NAME not in ( ${ignoreSql} ) `;
        let columnData = await this.query(columnSql, {tableName});
        let sql = " ";
        for (let item of columnData) {
            let name = item["column_name"] || "";
            let targetName = name.replace(/_[0-9a-zA-Z]/g, (text) => text.substr(1).toUpperCase());
            sql += `${alias}.${name} as ${targetName},`;
        }
        return sql.substr(0, sql.length - 1);
    }

    public async getSelectSql(tableName: string, options:ColumnOption = {}): Promise<string> {
        const alias = options.alias || tableName;
        let columnSql = await this.getCamelColumnSql("bc_card_view",options);
        return `select ${columnSql} from ${tableName} ${alias} `;
    }

    async queryPage(sql: string, params: any = {}, pageInfo: PageInfo = {}): Promise<{ data: any[], pageInfo: PageInfo }> {
        const {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
        const offset = (pageSize * (pageIndex - 1));
        const queryParams = [];
        const replaceSql = sql.replace(/@[a-zA-Z0-9]+/g, (text) => {
            let key = text.substr(1);
            queryParams.push(params[key] || "");
            return "?";
        });
        const pageSql = `select t.* from (${replaceSql}) t LIMIT ${pageSize} OFFSET ${offset}`;
        const countSql = `select count(*) as cnt from (${replaceSql}) t`;
        let countData: any[] = await this.manager.query(countSql, queryParams);
        let data: any[] = await this.manager.query(pageSql, queryParams);
        const count = countData[0].cnt || 0;
        const pageCount = Math.floor(count / pageSize);
        return {
            data,
            pageInfo: {
                pageIndex, pageSize, count, pageCount
            }
        };
    }

    async query(sql: string, params: any = {}): Promise<any[]> {
        const queryParams = [];
        const replaceSql = sql.replace(/@[a-zA-Z0-9]+/g, (text) => {
            let key = text.substr(1);
            let value = params[key] || "";
            if (typeof value === "string") {
                queryParams.push(value);
            } else {
                queryParams.push(params[key] || "");
            }
            return "?";
        });
        return await this.manager.query(replaceSql, queryParams);
    }

    async find<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<Entity[]> {
        return await this.manager.find(entityClass, options);
    }

    async findPage<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, pageInfo: PageInfo, options: FindManyOptions<Entity> = {}): Promise<{ data: Entity[], pageInfo: PageInfo }> {
        const {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
        const start = (pageSize * (pageIndex - 1));
        options.take = pageSize;
        options.skip = start;
        const [data, count] = await this.manager.findAndCount(entityClass, options);
        return {
            data,
            pageInfo: {
                pageIndex,
                pageSize,
                count,
                pageCount: Math.ceil(count / pageSize),
            }
        };
    }

    async findOne<T extends BaseEntity>(entityClass: ObjectType<T>, id: string): Promise<T> {
        return await this.manager.findOne(entityClass, id);
    }

    async findAndCount<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
        return await this.manager.findAndCount(entityClass, options);
    }

    create<Entity>(entityClass: ObjectType<Entity>, plainObject?: DeepPartial<Entity>): Entity {
        return this.manager.create(entityClass, plainObject);
    }

    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: ObjectType<Entity> | EntitySchema<Entity>, entity: T, options?: SaveOptions): Promise<T> {
        return this.manager.save(targetOrEntity, entity, options);
    }

    delete<Entity>(targetOrEntity: ObjectType<Entity> | EntitySchema<Entity> | string, criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {
        return this.manager.delete(targetOrEntity, criteria);
    }
}