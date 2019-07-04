import {app} from "egg-mock/bootstrap";
import {Context} from "egg";
import {createConnection, getConnection, getConnectionOptions, getCustomRepository, getRepository} from "typeorm";
import UpdateCache from "../../../app/schedule/update_cache";


describe("test/app/schedule/update_cache.test.ts", () => {
    let ctx: Context;
    let schedule: UpdateCache;

    before(async () => {
        ctx = app.mockContext();
        let options = await getConnectionOptions();
        await createConnection({...options, logging: []});
        schedule = new UpdateCache(ctx);
    });
    after(async () => {
        await getConnection().close();
    });

    describe("getViewPageData", () => {

    });
});
