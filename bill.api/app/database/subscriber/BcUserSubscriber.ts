import {EventSubscriber} from "typeorm";
import BaseSubscriber from "../BaseSubscriber";
import {BcUser} from "../entity/BcUser";

@EventSubscriber()
export class BcUserSubscriber extends BaseSubscriber<BcUser> {
    afterLoad(entity: BcUser):void{
        delete entity.loginPassword;
        delete entity.loginName;
    }
}
