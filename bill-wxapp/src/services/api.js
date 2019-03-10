import {request} from '@utils/request';

export const billApi = {
    list: (params = {}) => {
        return request('/wxapp/bill/list', params);
    },
    create: (data = {}) => {
        return request('/wxapp/bill/create', {data: JSON.stringify(data)});
    },
    update: (data = {}) => {
        return request('/wxapp/bill/update', {data: JSON.stringify(data)});
    },
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
    listGroupByUser: (values = {}) => {
        return request('/wxapp/card/list-group-by-user', values);
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

export const tableController = {
    list: (tableName, values = {}) => {
        return request('/wxapp/table/list', {tableName: tableName, data: JSON.stringify(values)});
    },
    add: (tableName, values = {}) => {
        return request('/wxapp/table/create', {tableName: tableName, data: JSON.stringify(values)});
    }
};
