import {RestFullController, RestFullService} from "./typings/rest";
import Assert from "./utils/Assert";
import BaseController from "./BaseController";

export default abstract class BaseRestFulController extends BaseController implements RestFullController {

    protected abstract getService(): RestFullService ;

    //增
    public async create() {
        const body = this.ctx.request.body || {};
        const model = await this.getService().create(body);
        this.successData([model]);
    }

    //增
    public async destroy() {
        const model = await this.getService().destroy(this.getUniqueId());
        this.successData([model]);
    }

    //改
    public async update() {
        const params = this.ctx.request.queryObjects;
        const model = await this.getService().update(this.getUniqueId(), params);
        this.successData([model]);
    }

    //查单个
    public async show() {
        const model = await this.getService().show(this.getUniqueId());
        this.successData([model]);
    }

    //查多个
    public async index() {
        const params = this.ctx.request.query;
        const data = await this.getService().index(params);
        this.successData(data);
    }

    private getUniqueId(){
        const id = this.ctx.params.id;
        Assert.hasText(id, "id is null");
        return id;
    }

}
