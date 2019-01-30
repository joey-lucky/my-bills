import {Controller} from 'egg';

export default class BillList extends Controller {
    public async list() {
        const {app, ctx} = this;
        const {sqlExecutor} = app;
        const params = ctx.query;
        let rows = await sqlExecutor.select("bd_bill");
        rows = await ctx.service.translateTable.translate(rows);
        ctx.body = rows;
    }
}
