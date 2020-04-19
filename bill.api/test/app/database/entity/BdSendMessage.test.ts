import {getCurrFilePath} from "../../../utils";
import {BdSendMessage} from "../../../../app/database";
import {assertCreate, assertDelete, assertFind, assertFindOne, assertUpdate} from "./entityUtils";
import * as moment from "moment";

const unique = "" + Date.now();
// @ts-ignore
let entity: BdSendMessage = {
    id:"test",
    userId: "test",
    sendStatus: unique,
    msgContent: "test",
    errorCode: "test",
    sendTime: "2020-01-01 00:00:00",
    tokenId: "test",
}

const updateModel = {id:entity.id, msgContent: entity.msgContent + "1"};
const expectUpdateModel = {...entity, ...updateModel};
const uniqueFindOptions ={sendStatus: unique};//为了只返回一个model,方便校验

describe(getCurrFilePath(__filename), () => {
    describe("basic", () => {
        it("create", async () => {
            await assertCreate(BdSendMessage, entity);
        });
        it("findOne", async () => {
            await assertFindOne(BdSendMessage, entity.id,entity);
        });
        it("find", async () => {
            await assertFind(BdSendMessage, uniqueFindOptions,[entity]);
        });
        it("update", async () => {
            await assertUpdate(BdSendMessage, updateModel,expectUpdateModel);
        });
        it("update", async () => {
            await assertDelete(BdSendMessage, entity.id);
        });
    });
});
