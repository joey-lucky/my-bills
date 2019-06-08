import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from "typeorm";
import {BdBill} from "../entity/BdBill";

@EventSubscriber()
export class BdBillSubscriber implements EntitySubscriberInterface<BdBill> {
    afterLoad(entity: BdBill): Promise<any> | void{
        entity.billTypeName = entity.billType && entity.billType.name;
        entity.userName = entity.user && entity.user.name;
        entity.cardName = entity.card && entity.card.name;
    }
}
