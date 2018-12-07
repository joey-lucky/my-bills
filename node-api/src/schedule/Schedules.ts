import TableStructureCache from "./TableStructureCache";
// @ts-ignore
import * as schedule from "node-schedule";

export default class Schedules {
    static init() {
        setTimeout( async () => {
            await TableStructureCache.getInstance().run();
            schedule.scheduleJob('* 20 * * * *',async ()=>{
                await TableStructureCache.getInstance().run();
            });
        }, 1000);
    }
}
