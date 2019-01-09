import {Service} from 'egg';

export default class extends Service {
    public async list(params) {
        const {app,ctx} = this;
        let tableName = params["tableName"];
        let rows = await app.mysql.select(tableName);
        rows = await ctx.service.translateTable.translate(rows);
        return rows;
    }


    public async create(params) {

    }

    public async update(params) {

    }

    public async delete(params) {

    }
}

