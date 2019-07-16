import {request} from '@utils/request';

export const asset = {
    groupByTypeList: function (params) {
        return request('/wxapp/asset/group-by-type-list', params);
    },
};

export const editBillApi = {
    updateBill: function (params) {
        return request('/wxapp/pages/edit-bill/update-bill', params);
    },
    getBillList: function (params) {
        return request('/wxapp/pages/edit-bill/get-bill-list', params);
    },
    deleteBill: function (params) {
        return request('/wxapp/pages/edit-bill/delete-bill', params);
    },
};

export const billListApi = {
    getMonthStatList: function (params) {
        return request('/wxapp/pages/bill-list/get-month-stat-list', params);
    },

    getSumStatList: function (params) {
        return request('/wxapp/pages/bill-list/get-sum-stat-list', params);
    },

    getBillList: function (params) {
        return request('/wxapp/pages/bill-list/get-bill-list', params);
    },
};

export const subBillListApi = {
    getBillPageData: function (params) {
        return request('/wxapp/pages/sub-bill-list/get-bill-page-data', params);
    },
};

export const baseBillEditApi = {
    getCardListUrl: "/wxapp/pages/base-bill-edit/get-card-list",
    getBillTypeListUrl: "/wxapp/pages/base-bill-edit/get-bill-type-list",
};

export const addBillApi = {
    getBillTemplateList: function (params) {
        return request('/wxapp/pages/add-bill/get-bill-template-list', params);
    },

    createBillTemplate: function (params) {
        return request('/wxapp/pages/add-bill/create-bill-template', params);
    },

    updateBillTemplate: function (params) {
        return request('/wxapp/pages/add-bill/update-bill-template', params);
    },

    createBill: function (params) {
        return request('/wxapp/pages/add-bill/create-bill', params);
    },
};

export const tableController = {
    list: (tableName, values = {}) => {
        return request('/wxapp/table/list', {tableName: tableName, data: JSON.stringify(values)});
    },
    add: (tableName, values = {}) => {
        return request('/wxapp/table/create', {tableName: tableName, data: JSON.stringify(values)});
    },
};

export const safeController = {
    login: (params) => {
        return request('/wxapp/safe/login', params);
    },
    getUserInfo: () => {
        return request('/wxapp/safe/get-user-info');
    }
};

