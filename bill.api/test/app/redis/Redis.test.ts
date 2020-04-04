import {getCurrFilePath} from "../../utils";
import {getManager} from "typeorm";
import {BdBillView} from "../../../app/database";
const {app, mock, assert} = require("egg-mock/bootstrap");

describe(getCurrFilePath(__filename), () => {
    before(async () => {

    });

    after(async () => {

    });

    it("set ", async () => {
        await app.redis.set("测试值", "测试值");
        await app.redis.set("测试值", {});
        let data = await getManager().find(BdBillView);
        console.log(data)
    });
});
