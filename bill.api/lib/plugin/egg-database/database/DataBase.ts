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
import PageQuerySelectQueryBuilder from "./PageQuerySelectQueryBuilder";
import PageInfo from "./PageInfo";

export default class DataBase {
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
        const manager = this;
        builder.getPageData = async function (pageInfo: PageInfo) {
            const {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
            const offset = (pageSize * (pageIndex - 1));
            const [data, count] = await this.limit(pageSize).offset(offset).getManyAndCount();
            const pageCount = Math.floor(count / pageSize);
            return {
                data: data,
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
        let data = await this.manager.find(entityClass, options);
        return data;
    }

    buildTrees(data = [], treeId: string = "parentId"): any[] {
        let parentMap: Map<string, any[]> = new Map<string, any[]>();
        for (let entity of data) {
            let parentId = entity[treeId]||"";
            if (!parentMap.has(parentId)) {
                parentMap.set(parentId, []);
            }
            parentMap.get(parentId).push(entity);
        }
        function completeChildren(data= []){
            for (let entity of data) {
                let id =  entity.id;
                let list = parentMap.get(id)||[];
                entity.children = completeChildren(list);
            }
            return data;
        }
        let rootData = parentMap.get("")||[];
        return completeChildren(rootData);
    }

    async findPage<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, pageInfo: PageInfo, options: FindManyOptions<Entity> = {}): Promise<{ data: Entity[], pageInfo: PageInfo }> {
        const {pageIndex = 1, pageSize = Number.MAX_SAFE_INTEGER} = pageInfo;
        const start = (pageSize * (pageIndex - 1));
        options.take = pageSize;
        options.skip = start;
        const [data, count] = await this.manager.findAndCount(entityClass, options);
        return {
            data: data,
            pageInfo: {
                pageIndex,
                pageSize,
                count,
                pageCount: Math.ceil(count / pageSize),
            }
        };
    }

    async findOne<T extends BaseEntity>(entityClass: ObjectType<T>, id: string): Promise<T> {
        let entity = await this.manager.findOne(entityClass, id);
        return entity;
    }

    async findAndCount<Entity extends BaseEntity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
        const [data, count] = await this.manager.findAndCount(entityClass, options);
        return [data, count];
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