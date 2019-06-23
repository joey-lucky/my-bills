import {EntitySubscriberInterface, EventSubscriber} from "typeorm";
import {BcUser} from "../entity/BcUser";

@EventSubscriber()
export class BcUserSubscriber implements EntitySubscriberInterface<BcUser>{
    afterLoad(entity: BcUser):void{
        delete entity.loginPassword;
        delete entity.loginName;
    }
}
