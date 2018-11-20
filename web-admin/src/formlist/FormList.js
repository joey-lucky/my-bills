import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Divider, Layout, Modal, Popconfirm, Row, Table} from "antd";
import FormDetailDialog from "./FormDetailDialog";
import FormEditDialog from "./FormEditDialog";

// import {Ajax} from "../common/unit/ajax";

/**
 * State状态类
 * 内部只进行修改State数据的工作，涉及到组件的工作，尽量放到组件内部。
 * 强制：AppState不需要export
 */
class AppState {

    /**
     * 成员变量
     * 1、强制：只对需要监听数据变化的变量加@observable前缀
     * 2、强制：成员变量必须包含默认值。
     */
    @observable data = [];
    editState = FormEditDialog.newState();
    addState = FormEditDialog.newState();
    detailState = FormDetailDialog.newState();

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
        Ajax.apiPost("/xxx/xxx/list", {ENT_ID: "xxxx"})
            .then((d) => {
                this.data = d.data || [];
            });
    }

    asyncDelete(model) {
        return Ajax.apiPost("add", {ENT_ID: "xxxx"})
            .then(d => d.result_flag === "SUCCESS");
    }

    showAddDialog() {
        this.addState.data = {};
        this.addState.show();
    }

    showEditDialog(record) {
        this.editState.data = record;
        this.editState.show();
    }
}

/**
 * 组件
 * 只负责页面展示相关的修改
 * 建议：不要直接修改别的类内部的变量，比如this._appState.data=[]
 */
@observer
export default class FormList extends React.Component {

    /**
     * 强制：每个组件都必须包含propTypes
     */
    static propTypes = {};

    /**
     * 建议：如果是路由指向组件，可以不需要这个方法
     */
    static newState() {
        return new AppState();
    }

    /**
     * 强制：成员变量全部以下划线开头
     */
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
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onEditClick(text, record)}>详情</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onEditClick(text, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => this.onDeleteClick(text, record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            )
        }];
    _appState = new AppState();// 当前属于路由指向的组件，所以state是直接new的

    constructor(props, context) {
        super(props, context);
        this._count = 10;
    }

    /**
     * 建议：加载网络数据,写在此方法内
     */
    componentDidMount() {
        this._appState.asyncLoadData();
    }

    /**
     * 强制：点击事件都以on开头
     * 强制：点击事件使用箭头函数
     */
    onAddClick = () => {
        this._appState.showAddDialog();
    };

    onEditClick = (text, record) => {
        this._appState.showEditDialog(record);
    };

    /**
     * 建议：当组件需要监听网络请求返回结果是，可用如下方法解决。
     */
    onDeleteClick = (text, record) => {
        this._appState.asyncDelete(record)
            .then((success) => {
                if (success) {
                    Modal.success({
                        title: "提示",
                        content: "删除成功！",
                        okText: "确定"
                    });
                    this._appState.asyncLoadData();
                }
            });
    };

    // 编辑成功后重新加载数据
    onEditSuccess = () => {
        this._appState.asyncLoadData();
    };

    // 新增成功后重新加载数据
    onAddSuccess = () => {
        this._appState.asyncLoadData();
    };

    render() {

        /**
         * 建议：ES6特性，使用结构来获取变量
         */
        const {data, editState, addState, detailState} = this._appState;
        return (
            <Layout>
                <FormEditDialog
                    state={addState}
                    actionURL="/xxx/xxx/xxx/create"
                    dialogTitle="新增字典"
                    onSubmitSuccess={this.onAddSuccess}
                />

                <FormEditDialog
                    state={editState}
                    actionURL="/xxx/xxx/xxx/update"
                    dialogTitle="编辑字典"
                    onSubmitSuccess={this.onEditSuccess}
                />

                <FormDetailDialog
                    state={detailState}
                    dialogTitle="字典详情"
                />

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
            </Layout>
        );
    }
}

/**
 * 以下代码无视，仅为了无网络状态下的数据模拟
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
        let d = {
            data: data,
            result_flag: "SUCCESS"
        };
        setTimeout(() => {
            resolve(d);
        }, 500);
    })
};
