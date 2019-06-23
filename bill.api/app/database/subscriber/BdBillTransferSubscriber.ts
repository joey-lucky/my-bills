import {EventSubscriber} from "typeorm";
import {BdBillTransfer} from "../entity/BdBillTransfer";
import BaseSubscriber from "../BaseSubscriber";

@EventSubscriber()
export class BdBillTransferSubscriber extends BaseSubscriber<BdBillTransfer> {
    afterLoad(entity: BdBillTransfer): Promise<any> | void{
    }
}
