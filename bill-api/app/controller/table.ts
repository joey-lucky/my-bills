import {Controller} from 'egg';

export default class extends Controller {
    public async list() {
        const {ctx} = this;
        ctx.body = await ctx.service.table.list(ctx.query);
    }

    public async create() {
        const {ctx} = this;
        ctx.body = await ctx.service.table.create(ctx.query);
    }

    public async update() {
        const {ctx} = this;
        ctx.body = await ctx.service.table.update(ctx.query);
    }

    public async delete() {
        const {ctx} = this;
        ctx.body = await ctx.service.table.delete(ctx.query);
    }
}
