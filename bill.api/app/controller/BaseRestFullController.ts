import BaseController from "./BaseController";
import {RestFullController, RestFullService} from "../typings/rest";
import Assert from "../utils/Assert";

export default abstract class BaseRestFullController extends BaseController implements RestFullController {
    protected abstract getService(): RestFullService ;

    //增
    public async create() {
        let body = this.ctx.request.body || {};
        let model = await this.getService().create(body);
        this.successData(model);
    }

    //增
    public async destroy() {
        let model = await this.getService().destroy(this.getUniqueId());
        this.successData([model]);
    }

    //改
    public async update() {
        let params = this.ctx.request.queryObjects;
        let data = await this.getService().update(this.getUniqueId(), params);
        this.successData(data);
    }

    //查单个
    public async show() {
        let model = await this.getService().show(this.getUniqueId());
        this.successData([model]);
    }

    //查多个
    public async index() {
        let params = this.ctx.request.query;
        let data = await this.getService().index(params);
        this.successData(data);
    }

    private getUniqueId(){
        const id = this.ctx.params.id;
        Assert.hasText(id, "id is null");
        return id;
    }

}
