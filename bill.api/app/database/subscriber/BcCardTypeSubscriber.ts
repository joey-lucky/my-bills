import {EventSubscriber} from "typeorm";
import BaseSubscriber from "../BaseSubscriber";
import {BcBillType} from "../entity/BcBillType";

@EventSubscriber()
export class BcCardTypeSubscriber extends BaseSubscriber<BcBillType> {

}
