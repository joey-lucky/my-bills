import {Controller,Application,Context} from 'egg';

export default class BillList extends Controller {
    public async list() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        const {sqlExecutor,tableRowHelper} = app;
        let sql = "select t.*\n" +
            "from bc_card t\n" +
            "order by length(t.name) asc, t.user_id asc";
        let data:any[] = await sqlExecutor.query(sql);
        for (let row of data) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bc_card", row);
        }
        ctx.body.data =data;
    }

    public async listGroupByUser() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        const {sqlExecutor,tableRowHelper} = app;
        let sql = "select t.*\n" +
            "from bc_card t\n" +
            "order by length(t.name) asc, t.user_id asc";
        let data:any[] = await sqlExecutor.query(sql);
        for (let row of data) {
            await tableRowHelper.translateId(row);
            await tableRowHelper.translateDateTime("bc_card", row);
        }
        //分组
        let map: Map<string, any[]> = new Map<string, any[]>();
        for (let row of data) {
            let userId = row["user_id"];
            let arrays = map.get(userId);
            if (!arrays) {
                arrays = [];
                map.set(userId, arrays);
            }
            arrays.push(row);
        }
        let result:any[] = [];
        for (let key of map.keys()) {
            let value:any = map.get(key);
            let firstValue = value[0];
            result.push({
                id:key,
                name:firstValue["user_name"],
                children:value,
            })
        }
        ctx.body.data =result;
    }
}
