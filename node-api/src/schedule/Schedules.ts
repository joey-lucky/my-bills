import TableStructureCache from "./TableStructureCache";
// @ts-ignore
import * as schedule from "node-schedule";

export default class Schedules {
    static init() {
        setTimeout( () => {
            TableStructureCache.getInstance().run().then();
            schedule.scheduleJob('5 * * * * *',()=>{
                TableStructureCache.getInstance().run().then();
            });

        }, 1000);
    }
}
