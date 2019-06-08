import {EntitySubscriberInterface, InsertEvent} from "typeorm";
import BaseEntity from "./BaseEntity";

export default class BaseSubscriber<Entity extends BaseEntity> implements EntitySubscriberInterface<Entity>{
    async beforeInsert(event: InsertEvent<Entity>): Promise<Entity>{
        let entity = event.entity;
        if (!entity.createBy) {
            entity.createBy = "default";
        }
        return entity;
    }

    async beforeUpdate(event: InsertEvent<Entity>): Promise<Entity>{
        let entity = event.entity;
        entity.updateTime = new Date();
        if (!entity.updateBy) {
            entity.updateBy = "default";
        }
        return entity;
    }
}