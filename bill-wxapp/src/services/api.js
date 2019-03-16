import {request} from '@utils/request';

export const creditBillAdd = {
    createBill: function (params) {
        return request('/wxapp/credit-bill-add/create-bill', params);
    },
    updateBill: function (params) {
        return request('/wxapp/credit-bill-add/update-bill', params);
    },
    getCreditCardList: function () {
        return request('/wxapp/credit-bill-add/get-credit-card-list',{});
    },
    getCashCardList: function () {
        return request('/wxapp/credit-bill-add/get-cash-card-list', {});
    },
};

export const normalBillAdd = {
    getCardList: function () {
        return request('/wxapp/normal-bill-add/get-card-list', {});
    },
    getBillTypeList: function () {
        return request('/wxapp/normal-bill-add/get-bill-type-list', {});
    },
    createBill: function (params) {
        return request('/wxapp/normal-bill-add/create-bill', params);
    },
    updateBill: function (params) {
        return request('/wxapp/normal-bill-add/update-bill', params);
    },
};

export const billList = {
    getBillPageData: function (params) {
        return request('/wxapp/bill-list/get-bill-page-data',params);
    },
    getUserInfo: function () {
        return request('/wxapp/bill-list/get-user-info',{});
    },
};

export const tableController = {
    list: (tableName, values = {}) => {
        return request('/wxapp/table/list', {tableName: tableName, data: JSON.stringify(values)});
    },
    add: (tableName, values = {}) => {
        return request('/wxapp/table/create', {tableName: tableName, data: JSON.stringify(values)});
    },
    update: (tableName, values = {}) => {
        return request('/wxapp/table/update', {tableName: tableName, data: JSON.stringify(values)});
    }
};

export const statApi = {
    getStatGroupByMonth: (params = {}) => {
        return request('/wxapp/stat/get-stat-group-by-month', params);
    },
    getMonthStatDetail: (params = {}) => {
        return request('/wxapp/stat/get-month-stat-detail', params);
    },
};

export const cardApi = {
    list: (values = {}) => {
        return request('/wxapp/card/list', values);
    },
};

export const cardAsset = {
    list: (values = {}) => {
        return request('/wxapp/asset/list', values);
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

