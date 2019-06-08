import {EventSubscriber, InsertEvent} from "typeorm";
import {BcBillType} from "../entity/BcBillType";
import BaseSubscriber from "../BaseSubscriber";

@EventSubscriber()
export class BcBillTypeSubscriber extends BaseSubscriber<BcBillType> {

}
