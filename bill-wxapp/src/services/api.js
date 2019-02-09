import {request} from '@utils/request';

export const billAdd = {
    create: (values = {}) => {
        return request('/wxapp/bill-add/create', {data: JSON.stringify(values)});
    }
};

export const billList={
    list: (values = {}) => {
        return request('/wxapp/bill-list/list', values);
    }
};

export const loginController = {
    login: (params) => {
        return request('/safe/login', params);
    },
};

export const tableController = {
    list: (tableName,values = {}) => {
        return request('/wxapp/table/list',  {tableName: tableName, data: JSON.stringify(values)});
    },
    add: (tableName,values = {}) => {
        return request('/wxapp/table/create',  {tableName: tableName, data: JSON.stringify(values)});
    }
};
