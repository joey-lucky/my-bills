import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {Connection, createConnection, getConnection, getCustomRepository, getRepository} from "typeorm";
// import {BdBill} from "../../../app/database/entity/BdBill";
// import {BcUser} from "../../../app/database/entity/BcUser";
import {BcCard} from "../../../app/database/entity/BcCard";
import {BdBill} from "../../../app/database/entity/BdBill";
import BdBillRepo from "../../../app/database/repositories/BdBillRepo";
import BcUserRepo from "../../../app/database/repositories/BcUserRepo";
import {BcUser} from "../../../app/database/entity/BcUser";
import BcCardRepo from "../../../app/database/repositories/BcCardRepo";

describe("test/app/database/DbManager.test.ts", () => {
    let ctx: Context;

    before(async () => {
        ctx = app.mockContext();

    });

    it('sayHi', async () => {
        await createConnection();
        let data =  await BdBill.find();
        console.log(data);
        return "sayHi";
    });
});
