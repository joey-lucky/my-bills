import {Application, Context, Controller} from 'egg';

export default class extends Controller {
    public async list() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        ctx.body.data = await ctx.service.table.common.list(ctx.query);
    }

    public async create() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        await ctx.service.table.common.create(ctx.query);
        ctx.body.message = "保存成功";
    }

    public async update() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        await ctx.service.table.common.update(ctx.query);
        ctx.body.message = "更改成功";
    }

    public async delete() {
        let app: Application = this.app;
        let ctx: Context = this.ctx;
        await ctx.service.table.common.delete(ctx.query);
        ctx.body.message = "删除成功";
    }
}
