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

export async function queryTableData(tableName, values = {}) {
    return request('/table/list', {tableName: "bd_bill", data: JSON.stringify(values)});
}

export async function addTableData(tableName, values = {}) {
    return request('/table/create', {tableName: tableName, data: JSON.stringify(values)});
}

export async function queryLogin(params) {
    return request('/safe/login', params);
}

