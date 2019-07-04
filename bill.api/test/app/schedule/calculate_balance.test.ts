import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository, getRepository} from "typeorm";
import CalculateBalance from "../../../app/schedule/calculate_balance";
import {BcUser} from "../../../app/database/entity/BcUser";

describe("test/app/schedule/update_cache.test.ts", () => {
    let ctx: Context;
    let schedule: CalculateBalance;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({...options, logging: []});
        let userList =  await getRepository(BcUser).find();
        ctx.user =userList[0];
        schedule = new CalculateBalance(ctx);
    });
    after(async () => {
        await getConnection().close();
    });

    it("subscribe", async () => {
       await schedule.subscribe();
    });
});
