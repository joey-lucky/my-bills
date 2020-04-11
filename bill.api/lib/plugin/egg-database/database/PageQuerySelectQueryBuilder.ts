import {SelectQueryBuilder} from "typeorm";
import {PageInfo} from "../../egg-db/lib/Db";

export default interface PageQuerySelectQueryBuilder<Entity> extends SelectQueryBuilder<Entity> {
    getPageData(pageInfo: PageInfo): Promise<{ data: Entity[], pageInfo: PageInfo }>;
}