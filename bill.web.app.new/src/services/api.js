import {request} from '@utils/request';
import {userAPI} from "./index";

export const assetApi = {
    groupByTypeList: function (params) {
        return request('/app/asset/group-by-type-list', params);
    },
};

export const billListApi = {
    getUserListUrl: userAPI.url,
};

export const baseBillEditApi = {
    getCardListUrl: "/app/base-bill-edit/get-card-list",
    getBillTypeListUrl: "/app/base-bill-edit/get-bill-type-list",
};



