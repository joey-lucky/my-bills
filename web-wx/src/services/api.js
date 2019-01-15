import request from '@utils/request';

export async function queryTableData(tableName,values) {
  return request('/table/list', {tableName: "bd_bill",data:JSON.stringify(values)});
}

export async function addTableData(tableName,values) {
    return request('/table/create', {tableName: "bd_bill",data:JSON.stringify(values)});
}

export async function queryLogin(params) {
    return request('/safe/login', params);
}