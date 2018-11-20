import React from "react";
import {observer,} from "mobx-react";
import {observable, toJS} from "mobx";
import * as PropTypes from "prop-types";
import {Button, Col, Divider, Form, Input, Layout, Modal, Popconfirm, Row, Table} from "antd";
import * as styles from "./DemoManager.css";
import Ajax from "./Ajax";
import DemoDetailDialog from "./DemoDetailDialog";
import DemoCreateDialog from "./DemoCreateDialog";
import DemoUpdateDialog from "./DemoUpdateDialog";

/**
 * 最简单的版本
 * 1、继承React.Component的子类就是一个组件
 * 2、render方法，会return一个html，这个html就是组件在页面上的样子。
 *
 * 包名全小写
 * 组件文件名首字母大写的驼峰命名法
 * 组件类名首字母大写的驼峰命名法，必须和文件同名
 *
 */
// export default class DemoManager extends React.Component {
//     render() {
//         return (
//             <div>
//                 <button>新增</button>
//             </div>
//         );
//     }
// }

/**
 * 加一个点击事件
 *
 * 事件以on开头，并且使用箭头函数定义
 */
// export default class DemoManager extends React.Component {
//
//     onCreateClick=()=>{
//         alert("按钮被点击")
//     };
//
//     render() {
//         return (
//             <div>
//                 <button onClick={this.onCreateClick}>新增</button>
//             </div>
//         );
//     }
// }

/**
 * 替换为antd样式组件
 *
 */
// export default class DemoManager extends React.Component {
//
//     onCreateClick=()=>{
//         alert("按钮被点击")
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <div>
//                     <Button
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                 </div>
//             </Layout>
//         );
//     }
// }

/**
 * 添加css样式--然后手动添加 style样式
 * 注意css的文件名必须跟类名一样，这样方便管理
 *
 *
 */
// export default class DemoManager extends React.Component {
//
//     onCreateClick = () => {
//         alert("按钮被点击")
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{
//                             marginLeft: 12
//                         }}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                 </div>
//             </Layout>
//         );
//     }
// }

/**
 * 添加一个table数据,成员变量的格式
 * 私有变量以下划线开头
 */
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         }];
//
//     onCreateClick=()=>{
//         alert("按钮被点击")
//     };
//
//     render() {
//         const data = [
//             {ID:"adsaf-xasdf",CODE:"123456",VALUE: "测试一波"}
//         ];
//
//         return (
//             <Layout>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                 </div>
//                 <Table
//                     rowKey={record => record.ID}
//                     dataSource={data}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }

/**
 * 根据规范，数据相关的必须放到AppState中,
 *
 * 公共变量采用驼峰命名法
 */
// class AppState {
//     @observable data = [{ID: "adsaf-xasdf", CODE: "123456", VALUE: "测试一波"}];
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         }];
//     _appState = new AppState();
//
//     onCreateClick=()=>{
//         alert("按钮被点击")
//     };
//
//     render() {
//         // const data = [
//         //     {ID:"adsaf-xasdf",CODE:"123456",VALUE: "测试一波"}
//         // ];
//         return (
//             <Layout>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                 </div>
//                 <Table
//                     rowKey={record => record.ID}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }

/**
 * 引入网络请求，修改数据
 * 1、网络请求的逻辑，应放在AppState
 * 2、异步数据必须以async开头
 */
// class AppState {
//     @observable data = [];
//
//     asyncLoadData() {
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         }];
//     _appState = new AppState();
//
//     componentDidMount(){
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick=()=>{
//         alert("按钮被点击")
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                 </div>
//                 <Table
//                     rowKey={record => record.ID}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }

/**
 * 增加查询功能
 * 1、数据加载时，应该先清空数据
 */
// class AppState {
//     @observable data = [];
//
//     asyncLoadData() {
//         this.data = [];
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         }];
//     _appState = new AppState();
//
//     componentDidMount(){
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick=()=>{
//         alert("按钮被点击")
//     };
//
//     onSearchClick=()=>{
//         this._appState.asyncLoadData();
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onSearchClick}>查询</Button>
//                 </div>
//                 <Table
//                     rowKey={record => record.ID}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }

/**
 * 增加编辑、删除、详情按钮。
 * 1、注意都使用箭头函数
 * 2、点击事件写在生命周期下面
 */
// class AppState {
//     @observable data = [];
//
//     asyncLoadData() {
//         this.data=[];
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         },
//         {
//             title: "操作",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
//                     <Divider type="vertical"/>
//                     <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
//                     <Divider type="vertical"/>
//                     <Popconfirm
//                         title="确定要删除吗？"
//                         onConfirm={() => this.onDeleteClick(text, record)}
//                         okText="确定"
//                         cancelText="取消"
//                     >
//                         <a href="javascript:;">删除</a>
//                     </Popconfirm>
//                 </span>
//             )
//         }];
//     _appState = new AppState();
//
//     componentDidMount(){
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick=()=>{
//         alert("新增按钮")
//     };
//
//     onDetailClick=()=>{
//         alert("详情按钮")
//     };
//
//     onUpdateClick=()=>{
//         alert("编辑按钮")
//     };
//
//     onDeleteClick=()=>{
//         alert("删除按钮")
//     };
//
//     onSearchClick=()=>{
//         this._appState.asyncLoadData();
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onSearchClick}>查询</Button>
//                 </div>
//                 <Table
//                     rowKey={record => record.ID}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }

/**
 * 新增一个标题组件
 * 1、props是什么，怎么传递的
 * 2、propTypes的必要性
 */
class AppState {
    @observable data = [];

    asyncLoadData() {
        this.data=[];
        Ajax.apiPost("/xxx/xxx/list")
            .then((d) => {
                this.data = d.data || [];
            });
    }
}

@observer
export default class DemoManager extends React.Component {
    _columns = [
        {
            title: "CODE代码",
            dataIndex: "CODE",
            key: "CODE",
        },
        {
            title: "VALUE值",
            dataIndex: "VALUE",
            key: "VALUE"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
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
    _appState = new AppState();

    componentDidMount(){
        this._appState.asyncLoadData();
    }

    onCreateClick=()=>{
        alert("新增按钮")
    };

    onDetailClick=()=>{
        alert("详情按钮")
    };

    onUpdateClick=()=>{
        alert("编辑按钮")
    };

    onDeleteClick=()=>{
        alert("删除按钮")
    };

    onSearchClick=()=>{
        this._appState.asyncLoadData();
    };

    render() {
        return (
            <Layout>
                <MyTitle title="明天周五了"/>
                <div className={styles.addButton}>
                    <Button
                        style={{marginLeft:12}}
                        type="primary"
                        onClick={this.onCreateClick}>新增</Button>
                    <Button
                        style={{marginLeft:12}}
                        type="primary"
                        onClick={this.onSearchClick}>查询</Button>
                </div>
                <Table
                    rowKey={(record,index) => index}
                    dataSource={toJS(this._appState.data)}
                    columns={this._columns}
                />
            </Layout>
        );
    }
}

class MyTitle extends React.Component{
    // static propTypes = {
    //     title: PropTypes.string,
    // };

    render(){
        return (
            <div>
                <h1>{this.props.title}</h1>
            </div>
        );
    }
}

/**
 * 新增一个对话框组件
 * 1、对话框的state放在AppState中
 *
 */
// class AppState {
//     @observable data = [];
//     detailDialogState = DemoDetailDialog.newState();
//
//     asyncLoadData() {
//         this.data=[];
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
//
//     showDetailDialog(){
//         this.detailDialogState.show();
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         },
//         {
//             title: "操作",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
//                     <Divider type="vertical"/>
//                     <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
//                     <Divider type="vertical"/>
//                     <Popconfirm
//                         title="确定要删除吗？"
//                         onConfirm={() => this.onDeleteClick(text, record)}
//                         okText="确定"
//                         cancelText="取消"
//                     >
//                         <a href="javascript:;">删除</a>
//                     </Popconfirm>
//                 </span>
//             )
//         }];
//     _appState = new AppState();
//
//     componentDidMount(){
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick=()=>{
//         alert("新增按钮");
//     };
//
//     onDetailClick=()=>{
//         this._appState.showDetailDialog();
//     };
//
//     onUpdateClick=()=>{
//         alert("编辑按钮")
//     };
//
//     onDeleteClick=()=>{
//         alert("删除按钮")
//     };
//
//     onSearchClick=()=>{
//         this._appState.asyncLoadData();
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <DemoDetailDialog state={this._appState.detailDialogState}/>
//                 <MyTitle title="明天周五了"/>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onSearchClick}>查询</Button>
//                 </div>
//                 <Table
//                     rowKey={(record,index) => index}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }
//
// class MyTitle extends React.Component{
//     static propTypes = {
//         title: PropTypes.string,
//     };
//     render(){
//         return (
//             <div>
//                 <h1>{this.props.title}</h1>
//             </div>
//         );
//     }
// }


/**
 * 将详情传入到对话框
 */
// class AppState {
//     @observable data = [];
//     detailDialogState = DemoDetailDialog.newState();
//
//     asyncLoadData() {
//         this.data=[];
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
//
//     showDetailDialog(record){
//         this.detailDialogState.show(record);
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         },
//         {
//             title: "操作",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
//                     <Divider type="vertical"/>
//                     <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
//                     <Divider type="vertical"/>
//                     <Popconfirm
//                         title="确定要删除吗？"
//                         onConfirm={() => this.onDeleteClick(text, record)}
//                         okText="确定"
//                         cancelText="取消"
//                     >
//                         <a href="javascript:;">删除</a>
//                     </Popconfirm>
//                 </span>
//             )
//         }];
//     _appState = new AppState();
//
//     componentDidMount(){
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick=()=>{
//         alert("新增按钮")
//     };
//
//     onDetailClick=(text, record)=>{
//         this._appState.showDetailDialog(record);
//     };
//
//     onUpdateClick=()=>{
//         alert("编辑按钮")
//     };
//
//     onDeleteClick=()=>{
//         alert("删除按钮")
//     };
//
//     onSearchClick=()=>{
//         this._appState.asyncLoadData();
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <DemoDetailDialog state={this._appState.detailDialogState}/>
//                 <MyTitle title="明天周五了"/>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                     <Button
//                         style={{marginLeft:12}}
//                         type="primary"
//                         onClick={this.onSearchClick}>查询</Button>
//                 </div>
//                 <Table
//                     rowKey={(record,index) => index}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }
//
// class MyTitle extends React.Component{
//     static propTypes = {
//         title: PropTypes.string,
//     };
//     render(){
//         return (
//             <div>
//                 <h1>{this.props.title}</h1>
//             </div>
//         );
//     }
// }

/**
 * 增加一个新增对话框
 */
// class AppState {
//     @observable data = [];
//     detailDialogState = DemoDetailDialog.newState();
//     createDialogState = DemoCreateDialog.newState();
//
//     asyncLoadData() {
//         this.data = [];
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
//
//     showDetailDialog(record) {
//         this.detailDialogState.show(record);
//     }
//
//     showCreateDialog() {
//         this.createDialogState.show();
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         },
//         {
//             title: "操作",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
//                     <Divider type="vertical"/>
//                     <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
//                     <Divider type="vertical"/>
//                     <Popconfirm
//                         title="确定要删除吗？"
//                         onConfirm={() => this.onDeleteClick(text, record)}
//                         okText="确定"
//                         cancelText="取消"
//                     >
//                         <a href="javascript:;">删除</a>
//                     </Popconfirm>
//                 </span>
//             )
//         }];
//     _appState = new AppState();
//
//     componentDidMount() {
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick = () => {
//         this._appState.showCreateDialog();
//     };
//
//     onDetailClick = (text, record) => {
//         this._appState.showDetailDialog(record);
//     };
//
//     onUpdateClick = () => {
//         alert("编辑按钮")
//     };
//
//     onDeleteClick = () => {
//         alert("删除按钮")
//     };
//
//     onSearchClick = () => {
//         this._appState.asyncLoadData();
//     };
//
//     onCreateSuccess = () => {
//         this._appState.asyncLoadData();
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <DemoDetailDialog state={this._appState.detailDialogState}/>
//                 <DemoCreateDialog
//                     actionURL="/xxx/xxx/xxx/create"
//                     dialogTitle="编辑字典"
//                     state={this._appState.createDialogState}
//                     onSubmitSuccess={this.onCreateSuccess}/>
//                 <MyTitle title="明天周五了"/>
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft: 12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                     <Button
//                         style={{marginLeft: 12}}
//                         type="primary"
//                         onClick={this.onSearchClick}>查询</Button>
//                 </div>
//                 <Table
//                     rowKey={(record, index) => index}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }
//
// class MyTitle extends React.Component {
//     static propTypes = {
//         title: PropTypes.string,
//     };
//
//     render() {
//         return (
//             <div>
//                 <h1>{this.props.title}</h1>
//             </div>
//         );
//     }
// }


/**
 * 增加一个删除对话框，同时完善删除功能
 */
// class AppState {
//     @observable data = [];
//     detailDialogState = DemoDetailDialog.newState();
//     createDialogState = DemoCreateDialog.newState();
//     updateDialogState = DemoUpdateDialog.newState();
//
//     asyncLoadData() {
//         this.data = [];
//         Ajax.apiPost("/xxx/xxx/list")
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
//
//     asyncDeleteData(record) {
//         return Ajax.apiPost("/xxx/xxx/delete", record)
//             .then((d) => {
//                 this.data = d.data || [];
//                 return true;
//             });
//     }
//
//     showDetailDialog(record) {
//         this.detailDialogState.show(record);
//     }
//
//     showCreateDialog() {
//         this.createDialogState.show();
//     }
//
//     showUpdateDialog(record) {
//         this.updateDialogState.show(record);
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         },
//         {
//             title: "操作",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
//                     <Divider type="vertical"/>
//                     <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
//                     <Divider type="vertical"/>
//                     <Popconfirm
//                         title="确定要删除吗？"
//                         onConfirm={() => this.onDeleteClick(text, record)}
//                         okText="确定"
//                         cancelText="取消"
//                     >
//                         <a href="javascript:;">删除</a>
//                     </Popconfirm>
//                 </span>
//             )
//         }];
//     _appState = new AppState();
//
//     componentDidMount() {
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick = () => {
//         this._appState.showCreateDialog();
//     };
//
//     onDetailClick = (text, record) => {
//         this._appState.showDetailDialog(record);
//     };
//
//     onUpdateClick = (text, record) => {
//         this._appState.showUpdateDialog(record);
//     };
//
//     onDeleteClick = (text, record) => {
//         this._appState.asyncDeleteData(record)
//             .then((success) => {
//                 if (success) {
//                     Modal.success({
//                         title: "提示",
//                         content: "删除成功！",
//                         okText: "确定"
//                     });
//                     this._appState.asyncLoadData();
//                 }
//             });
//     };
//
//     onSearchClick = () => {
//         this._appState.asyncLoadData();
//     };
//
//     onCreateSuccess = () => {
//         this._appState.asyncLoadData();
//     };
//
//     onUpdateSuccess = () => {
//         this._appState.asyncLoadData();
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <DemoDetailDialog state={this._appState.detailDialogState}/>
//
//                 <DemoCreateDialog
//                     actionURL="/xxx/xxx/xxx/create"
//                     dialogTitle="编辑字典"
//                     state={this._appState.createDialogState}
//                     onSubmitSuccess={this.onCreateSuccess}/>
//
//                 <DemoUpdateDialog
//                     actionURL="/xxx/xxx/xxx/create"
//                     dialogTitle="编辑字典"
//                     state={this._appState.updateDialogState}
//                     onSubmitSuccess={this.onUpdateSuccess}/>
//
//                 <MyTitle title="明天周五了"/>
//
//                 <div className={styles.addButton}>
//                     <Button
//                         style={{marginLeft: 12}}
//                         type="primary"
//                         onClick={this.onCreateClick}>新增</Button>
//                     <Button
//                         style={{marginLeft: 12}}
//                         type="primary"
//                         onClick={this.onSearchClick}>查询</Button>
//                 </div>
//                 <Table
//                     rowKey={(record, index) => index}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }
//
// class MyTitle extends React.Component {
//     static propTypes = {
//         title: PropTypes.string,
//     };
//
//     render() {
//         return (
//             <div>
//                 <h1>{this.props.title}</h1>
//             </div>
//         );
//     }
// }


/**
 * 增加搜索功能
 * 内部代码顺序
 */
// class AppState {
//     @observable data = [];
//     filter = {CODE: "", VALUE: ""};
//     params = {CODE: "", VALUE: ""};
//     detailDialogState = DemoDetailDialog.newState();
//     createDialogState = DemoCreateDialog.newState();
//     updateDialogState = DemoUpdateDialog.newState();
//
//     asyncLoadData() {
//         this.data = [];
//         Ajax.apiPost("/xxx/xxx/list", this.params)
//             .then((d) => {
//                 this.data = d.data || [];
//             });
//     }
//
//     asyncDeleteData(record) {
//         return Ajax.apiPost("/xxx/xxx/delete", record)
//             .then((d) => {
//                 this.data = d.data || [];
//                 return true;
//             });
//     }
//
//     setFilter(filter) {
//         this.filter = filter;
//     }
//
//     setParams(params) {
//         this.params = params;
//     }
//
//     showDetailDialog(record) {
//         this.detailDialogState.show(record);
//     }
//
//     showCreateDialog() {
//         this.createDialogState.show();
//     }
//
//     showUpdateDialog(record) {
//         this.updateDialogState.show(record);
//     }
// }
//
// @observer
// export default class DemoManager extends React.Component {
//     _columns = [
//         {
//             title: "CODE代码",
//             dataIndex: "CODE",
//             key: "CODE",
//         },
//         {
//             title: "VALUE值",
//             dataIndex: "VALUE",
//             key: "VALUE"
//         },
//         {
//             title: "操作",
//             key: "action",
//             render: (text, record) => (
//                 <span>
//                     <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
//                     <Divider type="vertical"/>
//                     <a href="javascript:;" onClick={() => this.onUpdateClick(text, record)}>编辑</a>
//                     <Divider type="vertical"/>
//                     <Popconfirm
//                         title="确定要删除吗？"
//                         onConfirm={() => this.onDeleteClick(text, record)}
//                         okText="确定"
//                         cancelText="取消"
//                     >
//                         <a href="javascript:;">删除</a>
//                     </Popconfirm>
//                 </span>
//             )
//         }];
//     _appState = new AppState();
//
//     componentDidMount() {
//         this._appState.asyncLoadData();
//     }
//
//     onCreateClick = () => {
//         this._appState.showCreateDialog();
//     };
//
//     onDetailClick = (text, record) => {
//         this._appState.showDetailDialog(record);
//     };
//
//     onUpdateClick = (text, record) => {
//         this._appState.showUpdateDialog(record);
//     };
//
//     onDeleteClick = (text, record) => {
//         this._appState.asyncDeleteData(record)
//             .then((success) => {
//                 if (success) {
//                     Modal.success({
//                         title: "提示",
//                         content: "删除成功！",
//                         okText: "确定"
//                     });
//                     this._appState.asyncLoadData();
//                 }
//             });
//     };
//
//     onSearchClick = () => {
//         this._appState.setParams({...this._appState.filter});
//         this._appState.asyncLoadData();
//     };
//
//     onCreateSuccess = () => {
//         this._appState.asyncLoadData();
//     };
//
//     onUpdateSuccess = () => {
//         this._appState.asyncLoadData();
//     };
//
//     onFilterCodeChange = (event) => {
//         let filter = {...this._appState.filter};
//         filter.CODE = event.target.value;
//         this._appState.setFilter(filter);
//     };
//
//     onFilterValueChange = (event) => {
//         let filter = {...this._appState.filter};
//         filter.VALUE = event.target.value;
//         this._appState.setFilter(filter);
//     };
//
//     render() {
//         return (
//             <Layout>
//                 <DemoDetailDialog state={this._appState.detailDialogState}/>
//
//                 <DemoCreateDialog
//                     actionURL="/xxx/xxx/xxx/create"
//                     dialogTitle="编辑字典"
//                     state={this._appState.createDialogState}
//                     onSubmitSuccess={this.onCreateSuccess}/>
//
//                 <DemoUpdateDialog
//                     actionURL="/xxx/xxx/xxx/create"
//                     dialogTitle="编辑字典"
//                     state={this._appState.updateDialogState}
//                     onSubmitSuccess={this.onUpdateSuccess}/>
//
//                 <MyTitle title="明天周五了"/>
//
//                 <Form layout="inline" className={styles.addButton}>
//                     <Row>
//                         <Form.Item label="代码">
//                             <Input
//                                 onChange={this.onFilterCodeChange}/>
//                         </Form.Item>
//                         <Form.Item label="值">
//                             <Input
//                                 onChange={this.onFilterValueChange}/>
//                         </Form.Item>
//                         <Button
//                             style={{marginLeft: 12}}
//                             type="primary"
//                             onClick={this.onCreateClick}>新增</Button>
//
//                         <Button
//                             style={{marginLeft: 12}}
//                             type="primary"
//                             onClick={this.onSearchClick}>查询</Button>
//                     </Row>
//                 </Form>
//
//                 <Table
//                     rowKey={(record, index) => index}
//                     dataSource={toJS(this._appState.data)}
//                     columns={this._columns}
//                 />
//             </Layout>
//         );
//     }
// }
//
// class MyTitle extends React.Component {
//     static propTypes = {
//         title: PropTypes.string,
//     };
//
//     render() {
//         return (
//             <div>
//                 <h1>{this.props.title}</h1>
//             </div>
//         );
//     }
// }
