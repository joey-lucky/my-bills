import {EntitySubscriberInterface, EventSubscriber} from "typeorm";
import {BdBill} from "../entity/BdBill";

@EventSubscriber()
export class BdBillSubscriber implements EntitySubscriberInterface<BdBill> {
    constructor() {
        console.log("BdBillSubscriber constructor");
    }

    afterLoad(entity: BdBill): void {
    }
}
