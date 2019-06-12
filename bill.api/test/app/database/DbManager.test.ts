import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getCustomRepository, getRepository} from "typeorm";
// import {BdBill} from "../../../app/database/entity/BdBill";
// import {BcUser} from "../../../app/database/entity/BcUser";
import BdBillRepo from "../../../app/database/repositories/BdBillRepo";

describe("test/app/database/DbManager.test.ts", () => {
    let ctx: Context;

    before(async () => {
        ctx = app.mockContext();

    });

    it('sayHi', async () => {
        await createConnection();
        let data = null;
        data = await getCustomRepository(BdBillRepo).find({loadEagerRelations: false})

        data = await getCustomRepository(BdBillRepo).getViewPageData({pageIndex: 1, pageSize: 5}, {});
        console.log(data);
        return "sayHi";
    });
});
