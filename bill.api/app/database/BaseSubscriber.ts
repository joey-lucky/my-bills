import {EntitySubscriberInterface, InsertEvent} from "typeorm";
import BaseEntity from "./BaseEntity";

export default class BaseSubscriber<Entity extends BaseEntity> implements EntitySubscriberInterface<Entity> {
    async beforeInsert(event: InsertEvent<Entity>): Promise<Entity> {
        let entity = event.entity;
        if (!entity.createBy) {
            if (entity.ctx) {
                let userInfo = entity.ctx.gegUserInfo();
                entity.createBy = userInfo.id;
            } else {
                entity.createBy = "admin";
            }
        }
        return entity;
    }

    async beforeUpdate(event: InsertEvent<Entity>): Promise<Entity> {
        let entity = event.entity;
        if (!entity.updateBy) {
            if (entity.ctx) {
                let userInfo = entity.ctx.gegUserInfo();
                entity.updateBy = userInfo.id;
            } else {
                entity.updateBy = "admin";
            }
        }
        return entity;
    }
}
