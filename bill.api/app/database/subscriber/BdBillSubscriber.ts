import {EntitySubscriberInterface, EventSubscriber} from "typeorm";
import {BdBill} from "../entity/BdBill";

@EventSubscriber()
export class BdBillSubscriber implements EntitySubscriberInterface<BdBill> {
    afterLoad(entity: BdBill): void {
    }
}
