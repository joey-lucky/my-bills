import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions} from "typeorm";
import {initAllCache} from "../../../../app/database/cache";

describe("test/app/database/repositories/BdStatBillMRepo.test.ts", () => {
    let ctx: Context;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({
            ...options,
            // logging: []
        });
        // await initAllCache();
        // repo = getCustomRepository(BdStatBillMRepo);
    });
    after(async () => {
        await getConnection().close();
    });
    describe("generateOneMonth", () => {
        it('month date change', async () => {
            let data = await ctx.service.table.bdBillService.getList({
                dateTime:["2019-12-01 00:00:00", "2019-12-31 23:59:59"],
            });
            console.log(JSON.stringify(data))
        });
    });
});
