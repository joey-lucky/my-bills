import {getCurrFilePath} from "../../utils";
import {EntityManager, getManager} from "typeorm";
import {BcUser, BdBill, BdBillView} from "../../../app/database";
const {app, mock, assert} = require("egg-mock/bootstrap");

describe(getCurrFilePath(__filename), () => {
    before(async () => {

    });

    after(async () => {

    });

    it("find user ", async () => {
        const {dbManager} = app;
        let manager :EntityManager = dbManager.getTypeOrmManager();
        let data = await manager.createQueryBuilder(BdBill, "bill")
            .where("bill.card_id=:cardId and bill.user_id=:userId", {
                cardId:"01e18040-3f50-11e9-a47d-4780f08f37f1",
                userId:"f4cdb7d0-fad9-11e8-8407-97bac90597c3"
            }).getMany();
        console.log(data);
    });
});
