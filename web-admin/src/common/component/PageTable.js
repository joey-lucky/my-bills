import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Table} from "antd";
import {Ajax} from "../unit/ajax";

class AppState {

    /**
     * 表格数据源
     */
    @observable data = {};

    /**
     * 搜索条件
     */
    filterData = {};

    /**
     * 每页大小
     */
    pageSize = 30;

    /**
     * 接口地址
     */
    url = "";

    /**
     * 获取数据
     */
    loadData = (filterData) => {

        if (!this.url) {
            return;
        }

        /**
         * 如果有查询参数，则更新查询参数数据
         */
        if (filterData) {
            this.filterData = filterData;
        }

        /**
         * 附上pageSize数据，作为后台分页依据
         */
        this.filterData.pageSize = this.pageSize;
        Ajax.apiPost(this.url, this.filterData)
            .then((d) => {
                this.data = d;
            });
    };

    /**
     * 点击分页按钮时触发
     */
    loadDataPage = (pageIndex) => {
        this.filterData.pageIndex = pageIndex;
        this.loadData(this.filterData);
    }
}

@observer
export default class PageTable extends React.Component {
    static propTypes = {
        columns: PropTypes.any,
        rowKey: PropTypes.any,
        pageSize: PropTypes.any,
        actionURL: PropTypes.any,
        state: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    constructor(props) {
        super(props);

        let {columns, rowKey, pageSize, actionURL, state} = props;

        if (rowKey == null) {
            rowKey = record => record.ID;
        }

        state.url = actionURL;

        if (!isNaN(pageSize)) {
            state.pageSize = pageSize;
        }

        /**
         * url和pageSize设置好后，主动加载列表数据
         */
        state.loadData();

        this.state = {
            rowKey: rowKey,
            columns: columns
        };
    }

    /**
     * 翻页事件
     */
    onPageChange = (pageIndex, pageSize) => {
        this.props.state.loadDataPage(pageIndex);
    }

    render() {

        const data = this.props.state.data;

        /**
         * 在接口未返回数据之前，默认的总记录数
         */
        let recordCount = 30;

        /**
         * 更新总记录数
         */
        if (data && data.page_info) {
            recordCount = data.page_info.recordCount;
        }

        let defaultPagination = {
            size: "small",
            defaultPageSize: this.props.state.pageSize,
            defaultCurrent: 1,
            total: recordCount,
            onChange: this.onPageChange,
            showTotal: total => "共" + total + "条记录"
        };

        return (
            <Table
                {...this.state}
                dataSource={toJS(this.props.state.data.data)}
                pagination={defaultPagination}
            />
        );
    }
}
