import {getCurrFilePath} from "../../../utils";
import {BcCardType} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";

const unique = "" + Date.now();
// @ts-ignore
let entity: BcCardType = {
    id:unique,
    name: "test",
};

const updateModel = {id:entity.id, name: entity.name + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={id:unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BcCardType, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BcCardType, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BcCardType, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BcCardType, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BcCardType, entity.id);
        });
    });
});
