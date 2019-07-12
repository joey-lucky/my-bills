import {request} from '@utils/request';

export const asset = {
    groupByTypeList: function (params) {
        return request('/wxapp/asset/group-by-type-list', params);
    },
};

export const billListApi = {
    getMonthStatList: function (params) {
        return request('/wxapp/bill-list/get-month-stat-list', params);
    },
    getBillList: function (params) {
        return request('/wxapp/bill-list/get-bill-list', params);
    },
    createBill: function (params) {
        return request('/wxapp/bill-list/create-bill', params);
    },
    updateBill: function (params) {
        return request('/wxapp/bill-list/update-bill', params);
    },
    deleteBill: function (params) {
        return request('/wxapp/bill-list/delete-bill', params);
    },
};


export const addBillApi = {
    getBillTemplateList: function (params) {
        return request('/wxapp/add-bill/get-bill-template-list', params);
    },

    getConsumerList: function (params) {
        return request('/wxapp/add-bill/get-consumer-list', params);
    },


    createBill: function (params) {
        return request('/wxapp/add-bill/create-bill', params);
    },
    getCardListUrl: "/wxapp/add-bill/get-card-list",
    getBillTypeListUrl: "/wxapp/add-bill/get-bill-type-list",

    test: function (params) {
        return request('/test.json', params);
    },
    billList: {
        getBillPageData: function (params) {
            return request('/wxapp/bill/bill-list/get-bill-page-data', params);
        },
        getUserInfo: function () {
            return request('/wxapp/bill/bill-list/get-user-info', {});
        },
        getBillEntity: function (id) {
            return request('/wxapp/bill/bill-list/get-bill-entity', {id});
        }
    },
    creditBillAdd: {
        createBill: function (params) {
            return request('/wxapp/bill/credit-bill-add/create-bill', params);
        },
        updateBill: function (params) {
            return request('/wxapp/bill/credit-bill-add/update-bill', params);
        },
        getCreditCardList: function () {
            return request('/wxapp/bill/credit-bill-add/get-credit-card-list', {});
        },
        getCashCardList: function () {
            return request('/wxapp/bill/credit-bill-add/get-cash-card-list', {});
        },
    },
    transferBillAdd: {
        createBill: function (params) {
            return request('/wxapp/bill/transfer-bill-add/create-bill', params);
        },
        updateBill: function (params) {
            return request('/wxapp/bill/transfer-bill-add/update-bill', params);
        },
        getTargetCardList: function () {
            return request('/wxapp/bill/transfer-bill-add/get-target-card-list', {});
        },
        getCashCardList: function () {
            return request('/wxapp/bill/transfer-bill-add/get-cash-card-list', {});
        },
        getBillTypeList: function () {
            return request('/wxapp/bill/transfer-bill-add/get-bill-type-list', {});
        },
    },
    incomeBillAdd: {
        getCardList: function () {
            return request('/wxapp/bill/income-bill-add/get-card-list', {});
        },
        getBillTypeList: function () {
            return request('/wxapp/bill/income-bill-add/get-bill-type-list', {});
        },
        createBill: function (params) {
            return request('/wxapp/bill/income-bill-add/create-bill', params);
        },
        updateBill: function (params) {
            return request('/wxapp/bill/income-bill-add/update-bill', params);
        },
    },
    consumeBillAdd: {
        getCardList: function () {
            return request('/wxapp/bill/consume-bill-add/get-card-list', {});
        },
        getBillTypeList: function () {
            return request('/wxapp/bill/consume-bill-add/get-bill-type-list', {});
        },
        createBill: function (params) {
            return request('/wxapp/bill/consume-bill-add/create-bill', params);
        },
        updateBill: function (params) {
            return request('/wxapp/bill/consume-bill-add/update-bill', params);
        },
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

