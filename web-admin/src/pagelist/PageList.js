import React from "react";
import {observer} from "mobx-react";
import {Layout} from "antd";
// import {Ajax} from "../common/unit/ajax";
import PageTable from "../common/component/PageTable1";

class AppState {

}

@observer
export default class PageList extends React.Component {
    static propTypes = {};

    _appState = new AppState();
    _columns = [
        {
            title: "企业编号",
            dataIndex: "ID",
            key: "ID"
        },
        {
            title: "企业名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "企业地址",
            dataIndex: "ADDRESS",
            key: "ADDRESS"
        }
    ];

    componentDidMount() {

    }

    /**
     * PageTable跟antd-Table的区别是
     * 1、由于PageTable只自动从网络加载数据，因此取消了props-dataSource
     * 2、组件的分页信息，以及翻页后的数据都是自动进行的，因此props-pagination仅作为默认的分页属性，仅在第一次加载时有效
     * 3、url和params，构成了获取网络数据的基础，apiPost是可选项，默认使用Ajax的数据获取
     */
    render() {
        return (
            <Layout>
                <PageTable
                    rowKey={record => record.ID}
                    columns={this._columns}
                    url="http://xx/xx/xx"
                    params={{ID: "xxxx"}}
                    pagination={{pageSize: 10}}
                    apiPost={Ajax.apiPost}
                />
            </Layout>
        );
    }
}

/**
 * 模拟网络数据，实际无用
 */
const Ajax = {
    apiPost: (url, params) => new Promise((resolve) => {
        let d = require("./ent-list.json");
        let pageInfo = d.page_info || {};
        pageInfo.pageIndex = params.pageIndex;
        pageInfo.pageSize = params.pageSize;
        setTimeout(() => {
            resolve(d);
        }, 800);
    })
};
