import RestFulTest from "../RestFulTest";
import {BcUser} from "../../../../app/database";

const url = "/api/conf/users";
const restFulTest = new RestFulTest(url);
describe(url, () => {
    // @ts-ignore
    let user: BcUser = {
        id: "test",
        name: "test",
        loginName: "test",
        loginPassword: "test",
        pic: "test",
        bussWX: "test",
    };
    // @ts-ignore
    let createUser: BcUser = {...user, id: "test_create"};
    // @ts-ignore
    let deleteUser: BcUser = {...user, id: "test_delete"};

    before(async () => {
        await BcUser.create(user).save();
        await BcUser.create(deleteUser).save();
        return true;
    });

    after(async () => {
        await BcUser.delete(user.id);
        await BcUser.delete(createUser.id);
        await BcUser.delete(deleteUser.id);
        return true;
    });

    restFulTest.describeCreate(createUser);
    // restFulTest.describeDestroy(deleteUser.id);
    // restFulTest.describeUpdate(user.id,{name:"test1"});
    // restFulTest.describeShow(user.id);
    // restFulTest.describeIndex({});
});
