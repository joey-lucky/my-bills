import {Controller} from "egg";

export default class Safe extends Controller {
    public async login() {
        let [user] = await this.ctx.service.safeService.login();
        this.ctx.body.data = [user];
        this.ctx.session = { user };
        this.ctx.rotateCsrfSecret();
    }
}
