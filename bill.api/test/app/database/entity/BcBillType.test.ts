import {getCurrFilePath} from "../../../utils";
import {BcBillType} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";

const unique = "" + Date.now();

// @ts-ignore
let entity: BcBillType = {
    id:"test",
    name: "test",
    parentId: "test",
    sort: 1,
    type: unique,
};

const updateModel = {id:entity.id, name: entity.name + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={type:unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BcBillType, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BcBillType, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BcBillType, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BcBillType, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BcBillType, entity.id);
        });
    });
});
