import {getCurrFilePath} from "../../../utils";
import {Basic, entityTest} from "./entityTest";
import {BcUser} from "../../../../app/database";
const unique = "" + Date.now();
// @ts-ignore
let user: BcUser = {
    id: "test",
    name: "test",
    loginName:unique,
    loginPassword: "test",
    pic: "test",
    bussWx: "test",
};

const basic:Basic = {
    model:user,
    updateModel:{id:user.id, name: user.name + "1"},
    findOptions:{loginName:unique}
};

describe(getCurrFilePath(__filename), entityTest({
    entityClass:BcUser,
    basic,
}));
