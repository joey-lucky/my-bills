import {request} from '@utils/request';

export const assetApi = {
    groupByTypeList: function (params) {
        return request('/app/asset/group-by-type-list', params);
    },
};
export const billTypeListApi = {
    getList: function (params) {
        return request('/app/bill-type-list/get-list', params);
    },
};

export const editBillApi = {
    updateBill: function (params) {
        return request('/app/edit-bill/update-bill', params);
    },
    getBillList: function (params) {
        return request('/app/edit-bill/get-bill-list', params);
    },
    deleteBill: function (params) {
        return request('/app/edit-bill/delete-bill', params);
    },
};

export const billListApi = {
    getMonthStatList: function (params) {
        return request('/app/bill-list/get-month-stat-list', params);
    },

    getSumStatList: function (params) {
        return request('/app/bill-list/get-sum-stat-list', params);
    },

    getBillList: function (params) {
        return request('/app/bill-list/get-bill-list', params);
    },
    getUserListUrl: "/app/bill-list/get-user-list",
};

export const subBillListApi = {
    getBillPageData: function (params) {
        return request('/app/sub-bill-list/get-bill-page-data', params);
    },
};

export const baseBillEditApi = {
    getCardListUrl: "/app/base-bill-edit/get-card-list",
    getBillTypeListUrl: "/app/base-bill-edit/get-bill-type-list",
};

export const addBillApi = {
    getBillTemplateList: function (params) {
        return request('/app/add-bill/get-bill-template-list', params);
    },

    createBillTemplate: function (params) {
        return request('/app/add-bill/create-bill-template', params);
    },

    updateBillTemplate: function (params) {
        return request('/app/add-bill/update-bill-template', params);
    },

    createBill: function (params) {
        return request('/app/add-bill/create-bill', params);
    },
};

export const safeController = {
    login: (params) => {
        return request('/safe/login', params);
    },
};

