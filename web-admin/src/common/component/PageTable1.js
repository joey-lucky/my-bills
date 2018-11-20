import React from "react";
import * as PropTypes from "prop-types";
import {Table} from "antd";
import {Ajax} from "../unit/ajax";

/**
 * 分页数据表格
 * table相关的props属性不变，详情请查看https://ant.design/components/table-cn/
 * 新增prop
 */
export default class PageTable extends React.Component {
    static propTypes = {
        pagination: PropTypes.any,
        url: PropTypes.any,
        params: PropTypes.any,
        apiPost: PropTypes.any
    };

    _defaultPagination = {
        current: 1,
        total: 0,
        pageSize: 15
    };

    constructor(props, context) {
        super(props, context);
        let {pagination = {}} = this.props;

        let mergePagination = {...this._defaultPagination, ...pagination};
        this.state = {
            dataSource: [],
            pagination: mergePagination
        };
        this.asyncLoadData(this.props, mergePagination);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {url: nextUrl = "", params: nextParams = {}, pagination: nextPagination = {}} = nextProps;
        const {url = "", params = {}, pagination = {}} = this.props;
        if (nextUrl !== url ||
            JSON.stringify(nextParams) !== JSON.stringify(params) ||
            JSON.stringify(nextPagination) !== JSON.stringify(pagination)) {
            let mergePagination = {...this._defaultPagination, ...nextPagination};
            this.asyncLoadData(nextProps, mergePagination);
        }
    }

    asyncLoadData = (props, pagination = {}) => {
        const {url, params = {}, apiPost = Ajax.apiPost} = props;
        let mergeParams = {
            ...params,
            pageIndex: pagination.current,
            pageSize: pagination.pageSize
        };
        if (url) {
            this.setState({
                dataSource: [],
                pagination: pagination
            });
            apiPost(url, mergeParams)
                .then((d) => {
                    let pageInfo = d.page_info || {};
                    let newPagination = {...pagination};
                    newPagination.current = pageInfo.pageIndex || 1;
                    newPagination.total = pageInfo.recordCount;
                    this.setState({
                        dataSource: d.data || [],
                        pagination: newPagination
                    });
                });
        }
    };

    onPageChange = (page, pageSize) => {
        let pagination = {...this.state.pagination};
        pagination.current = page;
        pagination.pageSize = pageSize;
        this.asyncLoadData(this.props, pagination);
        this.props.pagination && this.props.pagination.onChange && this.props.pagination.onChange(page, pageSize);
    };

    render() {
        const {dataSource, pagination, ...props} = this.props;
        console.log(this.state);
        return (
            <Table
                {...props}
                dataSource={this.state.dataSource}
                pagination={{
                    ...this.state.pagination,
                    onChange: this.onPageChange
                }}
            />
        );
    }
}
