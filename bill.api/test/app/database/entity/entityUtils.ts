import {BaseEntity, ObjectType} from "typeorm";
import {app, assert} from "egg-mock/bootstrap";

export async function assertCreate(entityClass: ObjectType<BaseEntity>, model: any) {
    let entity = await app.database.save(entityClass, {...model});
    assert.ok(!!entity);
}

export async function assertFindOne(entityClass: ObjectType<BaseEntity>, id: string, expect: any) {
    const entity = await app.database.findOne(entityClass, id);
    assert.deepEqual(entity, expect);
}

export async function assertFind(entityClass: ObjectType<BaseEntity>, findOptions: any, expect: any[]) {
    const data = await app.database.find(entityClass, {where:findOptions});
    assert.deepEqual(data, expect);
}

export async function assertUpdate(entityClass: ObjectType<BaseEntity>, updateModel:any, expect: any) {
    await app.database.save(entityClass, {...updateModel});
    const entity = await app.database.findOne(entityClass, updateModel.id);
    assert.deepEqual(entity, expect);
}

export async function assertDelete(entityClass: ObjectType<BaseEntity>,id:string) {
    await app.database.delete(entityClass, id);
    const entity = await app.database.findOne(entityClass, id);
    assert.ok(!entity);
}
