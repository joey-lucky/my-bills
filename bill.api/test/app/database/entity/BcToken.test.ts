import {getCurrFilePath} from "../../../utils";
import {BcToken} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";
import moment = require("moment");

const unique = "" + Date.now();

// @ts-ignore
let entity: BcToken = {
    id:"test",
    type: "test",
    agentId: 1,
    secret: unique,
    corpId: "test",
    accessToken: "test",
    expiresIn: "2019-01-01 00:00:00",
}

const updateModel = {id:entity.id, type: entity.type + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={secret:unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BcToken, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BcToken, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BcToken, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BcToken, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BcToken, entity.id);
        });
    });
});
