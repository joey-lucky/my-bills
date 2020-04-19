import {getCurrFilePath} from "../../../utils";
import {BcCard} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";

const unique = "" + Date.now();
// @ts-ignore
let entity: BcCard = {
    id: "test",
    name: "test",
    balance: 1,
    userId: "test",
    cardTypeId: unique
};

const updateModel = {id:entity.id, name: entity.name + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={cardTypeId:unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BcCard, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BcCard, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BcCard, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BcCard, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BcCard, entity.id);
        });
    });
});
