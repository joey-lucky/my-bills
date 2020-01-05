import {Controller} from "egg";

export default class Safe extends Controller {
    public async login() {
        this.ctx.body.data = await this.ctx.service.safeService.login();
    }
}
