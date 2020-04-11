import {getCurrFilePath} from "../../../utils";
import {Basic, entityTest} from "./entityTest";
import {BdBill} from "../../../../app/database";

const unique = "" + Date.now();

// @ts-ignore
let entity: any = {
    id:"test",
    billDesc: unique,
    billTypeId:"test",
    userId:"test",
    cardId:"test",
    money:123,
    targetCardId:"test",
    dateTime:new Date(Number.parseInt(""+Date.now()/1000) * 1000),
};

const basic:Basic = {
    model:entity,
    updateModel:{id:entity.id, billTypeId: entity.billTypeId + "1"},
    findOptions:{billDesc:unique}
};

describe(getCurrFilePath(__filename), entityTest({
    entityClass:BdBill,
    basic,
}));
