import {getCurrFilePath} from "../../../utils";
import {BdBill} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";

const unique = "" + Date.now();
// @ts-ignore
let entity: BdBill = {
    id:"test",
    billDesc: unique,
    billTypeId:"test",
    userId:"test",
    cardId:"test",
    money:123,
    targetCardId:"test",
    dateTime:"2019-01-01 00:00:00",
};

const updateModel = {id:entity.id, billTypeId: entity.billTypeId + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={billDesc: unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BdBill, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BdBill, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BdBill, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BdBill, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BdBill, entity.id);
        });
    });
});
