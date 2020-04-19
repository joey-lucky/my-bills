import {getCurrFilePath} from "../../../utils";
import {BcBillTemplate} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";

const unique = "" + Date.now();
// @ts-ignore
let entity: BcBillTemplate = {
    id:"test",
    name: "test",
    billDesc: unique,
    billTypeId:"test",
    userId:"test",
    cardId:"test",
    targetCardId:"test",
};

const updateModel = {id:entity.id, billDesc: entity.billDesc + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={billDesc: unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BcBillTemplate, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BcBillTemplate, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BcBillTemplate, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BcBillTemplate, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BcBillTemplate, entity.id);
        });
    });
});
