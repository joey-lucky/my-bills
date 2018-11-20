import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Layout, Modal, Row, Table} from "antd";

// import {Ajax} from "../common/unit/ajax";

class AppState {

    /**
     * 成员变量
     * 1、强制：只对需要监听数据变化的变量加@observable前缀
     * 2、强制：成员变量必须包含默认值。
     */
    @observable data = [];

    /**
     * 方法
     * 1、强制：异步请求前缀为async
     * 2、强制：方法名规范，增加使用create,修改使用update,删除使用delete,获取使用get,加载使用load
     * 3、建议：不需要使用箭头函数
     * 4、建议：不直接调用组件或者组件内部的方法，比如：Modal。
     * 5、建议：数据加载前，先清空数据。
     */
    asyncLoadData() {
        this.data = [];
        Ajax.apiPost("/xxx/xxx/list", {ID: "xxxx"})
            .then((d) => {
                this.data = d.data || [];
                console.log(d.data || []);
            });
    }
}

@observer
export default class BasicList extends React.Component {
    static propTypes = {};

    /**
     * 路由直接指向页面，state是内部new的。
     */
    _appState = new AppState();
    _columns = [
        {
            title: "代码",
            dataIndex: "CODE",
            key: "CODE"
        },
        {
            title: "值",
            dataIndex: "VALUE",
            key: "VALUE"
        }];

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {
        Modal.success({
            title: "提示",
            content: "添加按钮被点击",
            okText: "确定"
        });
    };

    render() {
        const {data} = this._appState;
        return (
            <Layout>
                <Row style={{marginTop: 12}}>
                    <Button
                        style={{marginLeft: 12}}
                        type="primary"
                        onClick={this.onAddClick}
                    >新增</Button>
                </Row>

                <Table
                    rowKey={record => record.ID}
                    dataSource={data}
                    columns={this._columns}
                />
            </Layout>
        );
    }
}

/**
 * 模拟网络数据，实际无用
 */
const Ajax = {
    apiPost: () => new Promise((resolve) => {
        let data = [];
        let size = parseInt(Math.random() * 50 + 1, 10);
        for (let i = 0; i < size; i++) {
            data.push({
                CODE: 1000000 + i,
                VALUE: "名称" + (i + 1),
                UNIT: "单位" + (i + 1),
                ORDER_CODE: i
            });
        }
        let d = {data: data};
        setTimeout(() => {
            resolve(d);
        }, 800);
    })
};
