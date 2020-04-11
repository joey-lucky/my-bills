import {getCurrFilePath} from "../../../utils";
import {Basic, entityTest} from "./entityTest";
import {BcBillTemplate} from "../../../../app/database";

const unique = "" + Date.now();
// @ts-ignore
let user: BcBillTemplate = {
    id:"test",
    name: "test",
    billDesc: unique,
    billTypeId:"test",
    userId:"test",
    cardId:"test",
    targetCardId:"test",
};

const basic:Basic = {
    model:user,
    updateModel:{id:user.id, name: user.name + "1"},
    findOptions:{billDesc:unique}
};

describe(getCurrFilePath(__filename), entityTest({
    entityClass:BcBillTemplate,
    basic,
}));
