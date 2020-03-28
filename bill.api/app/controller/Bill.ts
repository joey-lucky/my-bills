import BaseRestFullController from "./BaseRestFullController";
import {RestFullService} from "../typings/rest";

export default class Bill extends BaseRestFullController {
    protected getService(): RestFullService {
        return this.service.bill;
    }
}