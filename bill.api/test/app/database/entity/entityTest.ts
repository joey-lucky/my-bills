import {BaseEntity, ObjectType} from 'typeorm';
import {app, assert} from "egg-mock/bootstrap";

export interface Basic{
    model:any,
    updateModel:any,
    findOptions:any,
}

export interface Options<T extends BaseEntity> {
    entityClass: ObjectType<T>,
    basic:Basic
}

export function entityTest<T extends BaseEntity>(options: Options<T>) {
    return () => {
        const {entityClass} = options;
        const {model,updateModel,findOptions} = options.basic;
        before(async () => {

        });
        beforeEach(() => {

        });
        it('增', async () => {
            let entity = await app.database.save(entityClass, {...model});
            assert.ok(!!entity);
        });
        it('查', async () => {
            //id 查询
            const entity = await app.database.findOne(options.entityClass, model.id);
            assert.deepEqual(entity, model);
            //条件查询
            const data = await app.database.find(entityClass, findOptions);
            assert.deepEqual(data[0], model);
        });
        it('改', async () => {
             await app.database.save(options.entityClass,{...updateModel});
            const entity = await app.database.findOne(options.entityClass, model.id);
            assert.deepEqual(entity, {...model,...updateModel});
        });
        it('删', async () => {
            await app.database.delete(options.entityClass, model.id);
            const entity = await app.database.findOne(options.entityClass, model.id);
            assert.ok(!entity);
        });
        afterEach(() => {

        });
        after(async () => {
        });
    };
}