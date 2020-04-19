import {getCurrFilePath} from "../../../utils";
import {BcUser} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";

const unique = "" + Date.now();
// @ts-ignore
let entity: BcUser = {
    id: "test",
    name: "test",
    loginName: unique,
    loginPassword: "test",
    pic: "test",
    bussWx: "test",
};
const updateModel = {id:entity.id, name: entity.name + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={loginName:unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BcUser, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BcUser, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BcUser, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BcUser, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BcUser, entity.id);
        });
    });
});
