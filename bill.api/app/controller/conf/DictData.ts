import {RestFullService} from "../../typings/rest";
import BaseRestFulController from "../../BaseRestFulController";

export default class extends BaseRestFulController {
    protected getService(): RestFullService {
        return this.service.conf.dictData;
    }
}