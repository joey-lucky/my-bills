import {
    BaseEntity,
    DeepPartial,
    DeleteResult,
    EntityManager,
    EntitySchema,
    FindManyOptions,
    ObjectID,
    ObjectType,
    QueryRunner,
    SaveOptions,
    SelectQueryBuilder
} from "typeorm";
import {Application} from "egg";

export interface PageInfo {
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;
    count?: number;
}

interface ColumnOption {
    alias?: string;
    ignore?: string[];
}

interface PageQuerySelectQueryBuilder<Entity> extends SelectQueryBuilder<Entity> {
    getPageData(pageInfo: PageInfo): Promise<{ data: Entity[], pageInfo: PageInfo }>;
}

export class DbManager {
    private readonly manager: EntityManager;
    private app: Application;

    constructor(app: Application, manager: EntityManager) {
        this.manager = manager;
        this.app = app;
    }

    public getTypeOrmManager(): EntityManager {
        return this.manager;
    }

    public createQueryBuilder<Entity>(entityClass: ObjectType<Entity>, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity> {
        return this.manager.createQueryBuilder(entityClass, alias, queryRunner);
    }

    public createPageQueryBuilder<Entity>(entityClass: ObjectType<Entity>, alias: string, queryRunner?: QueryRunner): PageQuerySelectQueryBuilder<Entity> {
        // @ts-ignore
        let builder: PageQuerySelectQueryBuilder = this.createQueryBuilder(entityClass, alias, queryRunner);
        builder.getPageData = async function (pageInfo: PageInfo) {
            const {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
            const offset = (pageSize * (pageIndex - 1));
            const [data, count] = await this.limit(pageSize).offset(offset).getManyAndCount();
            const pageCount = Math.floor(count / pageSize);
            return {
                data,
                pageInfo: {
                    pageIndex, pageSize, count, pageCount
                }
            };
        };
        return builder;
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