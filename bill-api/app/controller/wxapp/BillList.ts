import {Controller} from 'egg';

export default class BillList extends Controller {
    public async list() {
        const {app, ctx} = this;
        const {sqlExecutor} = app;
        ctx.body = await sqlExecutor.select("bd_bill");
    }
}
