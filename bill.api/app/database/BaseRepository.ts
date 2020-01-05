import {Repository} from "typeorm";
import {BaseEntity} from "./BaseEntity";
import {Context} from "egg";


export default class BaseRepository<Entity extends BaseEntity> extends Repository<Entity> {
    public static async completeCreateEntity<Entity extends BaseEntity>(entity: Entity,ctx:Context) {
        entity.createBy = ctx.user.id;
    }

    public static async completeUpdateEntity<Entity extends BaseEntity>(entity: Entity,ctx:Context) {
        entity.updateBy = ctx.user.id;
    }
}