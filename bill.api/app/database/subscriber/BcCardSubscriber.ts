import {EventSubscriber} from "typeorm";
import BaseSubscriber from "../BaseSubscriber";
import {BcBillType} from "../entity/BcBillType";

@EventSubscriber()
export class BcCardSubscriber extends BaseSubscriber<BcBillType> {

}
