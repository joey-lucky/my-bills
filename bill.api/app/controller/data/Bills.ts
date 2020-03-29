import {RestFullService} from "../../typings/rest";
import BaseRestFulController from "../../BaseRestFulController";

export default class Bills extends BaseRestFulController {
    protected getService(): RestFullService {
        return this.service.table.bill;
    }
}