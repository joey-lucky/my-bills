import {getCurrFilePath} from "../../utils";
import {EntityManager, getManager} from "typeorm";
import {BcBillType, BcUser, BdBill, BdBillView} from "../../../app/database";
const {app, mock, assert} = require("egg-mock/bootstrap");

describe(getCurrFilePath(__filename), () => {
    before(async () => {

    });

    after(async () => {

    });

    it("find user ", async () => {
        let data = await app.database.find(BcBillType);
        let treeData = app.database.buildTrees(data);
        console.log(treeData);
    });
});
