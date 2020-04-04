import {getCurrFilePath} from "../../utils";
import {getManager} from "typeorm";
import {BcUser, BdBillView} from "../../../app/database";
const {app, mock, assert} = require("egg-mock/bootstrap");

describe(getCurrFilePath(__filename), () => {
    before(async () => {

    });

    after(async () => {

    });

    it("find user ", async () => {
        const {dbManager} = app;
        let data = await dbManager.find(BcUser);
        console.log(data);
    });
});
