import React from "react";
import * as PropTypes from "prop-types";
import {Table} from "antd";
import {useRemotePageDataState} from "./useRemotePageDataState";

export default function PageTable(props) {
    const {data, changeCurrent, pageSize, current, loading, total} = useRemotePageDataState(props);

    /*
    事件
     */
    const rowKey = (record) => {
        return record.ID || "";
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

PageTable.propTypes = {
    url: PropTypes.string.isRequired,
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
//
// export default class PageTable extends React.Component {
//     static propTypes = {
//         url: PropTypes.string.isRequired,
//         parse: PropTypes.func,
//         params: PropTypes.object,
//         pagination: PropTypes.shape({
//             pageSize: PropTypes.number,
//             defaultPageSize: PropTypes.number,
//             current: PropTypes.number
//         }),
//         columns: PropTypes.array.isRequired,
//         rowKey: PropTypes.any,
//         lastModifyDate: PropTypes.any,
//         className:PropTypes.string
//     };
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [],
//             current: this.getCurrent(props, 1),
//             pageSize: this.getPageSize(props, 15),
//             total: 0,
//             loading: false
//         };
//     }
//
//     componentDidMount() {
//         let {url = "", params = {}, parse} = this.props;
//         let {current, pageSize} = this.state;
//         this.asyncLoadData(url, params, parse, {current, pageSize});
//     }
//
//     componentWillReceiveProps(nextProps, nextContext) {
//         if (
//             !PropsUtils.isEqual(this.props, nextProps, "url") ||
//             !PropsUtils.isEqual(this.props, nextProps, "params") ||
//             !PropsUtils.isEqual(this.props, nextProps, "lastModifyDate") ||
//             !PropsUtils.isEqual(this.props.pagination, nextProps.pagination, "pageSize") ||
//             !PropsUtils.isEqual(this.props.pagination, nextProps.pagination, "current")
//         ) {
//             const {url = "", params = {}, parse} = nextProps;
//             let pageSize = nextProps.pagination.pageSize || this.state.pageSize;
//             let current = nextProps.pagination.current || this.state.current;
//             this.asyncLoadData(url, params, parse, {current: current, pageSize: pageSize});
//         }
//     }
//
//     reloadData = () => {
//         let {url = "", params = {}, parse} = this.props;
//         let {current, pageSize} = this.state;
//         this.asyncLoadData(url, params, parse, {current, pageSize});
//     };
//
//     getPageSize = (props, def) => {
//         let pageSize = def;
//         let {pagination} = props;
//         if (pagination && pagination.pageSize) {
//             pageSize = pagination.pageSize;
//         } else if (pagination && pagination.defaultPageSize) {
//             pageSize = pagination.defaultPageSize;
//         }
//         return pageSize;
//     };
//
//     getCurrent = (props, def) => {
//         let {pagination} = props;
//         let current = def;
//         if (pagination && pagination.current) {
//             current = pagination.current;
//         } else if (pagination && pagination.defaultCurrent) {
//             current = pagination.defaultCurrent;
//         }
//         return current;
//     };
//
//     asyncLoadData = (url = "", params = {}, parse, {current, pageSize}) => {
//         params.pageSize = pageSize;
//         params.pageIndex = current;
//         this.pageIndex = params.pageIndex;
//         if (url) {
//             this.setState({loading: true});
//             Ajax.apiPost(url, toJS(params))
//                 .then(
//                     (d) => {
//                         let data = d.data || [];
//                         if (parse) {
//                             data = data.map((item, index, array) => parse(item, index, array));
//                         }
//                         let total = data.length;
//                         if (d.page_info) {
//                             total = d.page_info.recordCount;
//                         }
//                         this.setState({
//                             data, total, current, pageSize, loading: false
//                         });
//                     },
//                     () => {
//                         this.setState({
//                             loading: false, data: []
//                         });
//                     }
//                 );
//         }
//     };
//
//     changeCurrent = (current, pageSize) => {
//         this.setState({current});
//         let {url = "", params = {}, parse} = this.props;
//         this.asyncLoadData(url, params, parse, {current, pageSize});
//     };
//
//     render() {
//         const {current, pageSize, data, total, loading} = this.state;
//         let {pagination = {}, rowKey = record => record.ID, ...props} = this.props;
//         pagination = {
//             pageSize: pageSize,
//             current: current,
//             size: "small",
//             showTotal: total => "共" + total + "条记录",
//             onChange: this.changeCurrent,
//             total: total,
//             ...pagination
//         };
//         return (
//             <Table
//                 {...props}
//                 loading={loading}
//                 rowKey={rowKey}
//                 dataSource={data}
//                 pagination={pagination}
//             />
//         );
//     }
// }
