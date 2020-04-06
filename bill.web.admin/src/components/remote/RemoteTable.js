import React from "react";
import * as PropTypes from "prop-types";
import {Table} from "antd";
import {useRemotePageDataState} from "./useRemotePageDataState";

export default function RemoteTable(props) {
    const {data, changeCurrent, pageSize, current, loading, total} = useRemotePageDataState(props);

    /*
    事件
     */
    const rowKey = (record) => {
        return record.id || "";
    };

    const onPaginationChange = (current,pageSize) => {
        changeCurrent(current);
    };

    /*
    数据处理
     */
    const pagination = {
        ...(props.pagination || {}),
        pageSize: pageSize,
        current: current,
        size: "small",
        showTotal: total => "共" + total + "条记录",
        onChange: onPaginationChange,
        total: total,
    };

    return (
        <Table
            {...props}
            loading={loading}
            rowKey={rowKey}
            dataSource={data}
            pagination={pagination}
        />
    );
}

RemoteTable.propTypes = {
    loadData: PropTypes.func,
    parse: PropTypes.func,
    params: PropTypes.object,
    pagination: PropTypes.shape({
        pageSize: PropTypes.number,
        defaultPageSize: PropTypes.number,
        current: PropTypes.number
    }),
    columns: PropTypes.array.isRequired,
    rowKey: PropTypes.any,
    lastModifyDate: PropTypes.any,
    className:PropTypes.string
};
