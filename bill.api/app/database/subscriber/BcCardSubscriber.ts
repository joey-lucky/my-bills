import {EventSubscriber} from "typeorm";
import BaseSubscriber from "../BaseSubscriber";
import {BcCard} from "../entity/BcCard";

@EventSubscriber()
export class BcCardSubscriber extends BaseSubscriber<BcCard> {
    afterLoad(entity: BcCard): Promise<any> | void{
        entity.userName = entity.user && entity.user.name;
        entity.cardTypeName = entity.cardType && entity.cardType.name;
    }
}
