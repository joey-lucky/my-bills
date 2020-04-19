import * as React from "react";
import {Button, Col, Divider, Input, Popconfirm, Row, Table} from "antd";
import store from "./store";
import {dictDataAPI} from "@services";
import EditDialog from "./EditDialog";
import {observer} from "mobx-react";
import Assert from "@utils/Assert";
import {toJS} from "mobx";
import {SearchOutlined} from "@ant-design/icons";

@observer
export default class Data extends React.Component {
    _columns = [
        {
            title: "值",
            dataIndex: "value",
            key: "value"
        },
        {
            title: "编码",
            dataIndex: "code",
            key: "code"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <div>
                    <a href="javascript:" onClick={this.onUpdateClick(record)}>编辑</a>
                    <Divider type="vertical"/>
                    <a href="javascript:" onClick={this.onCreateChildClick(record)}>添加子项</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={this.onDeleteClick(record)} okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </div>
            )
        },
    ];
    _updateRef = React.createRef();
    _createRef = React.createRef();

    constructor(props) {
        super(props);
        const {typeCode} = props.match.params;
        Assert.hasText(typeCode,"typeCode is null");
        store.typeCode = typeCode;
    }

    componentDidMount() {
        store.loadData();
    }

    onDeleteClick = (record) => () => {
        store.asyncDeleteData(record);
    };

    onUpdateClick = (record) => () => {
        this._updateRef.current.show(record);
    };

    onCreateChildClick = (record) => () => {
        this._createRef.current.show({parentId:record.id});
    };

    onSearch = (value) => {
        store.keyword = value;
        store.loadData();
    };

    onCreateClick = () => {
        this._createRef.current.show({});
    };

    onCreateOrUpdateSuccess = ()=>{
        store.loadData();
    }

    render() {
        return (
            <div>
                <EditDialog
                    ref={this._createRef}
                    title={"新增用户"}
                    loadData={dictDataAPI.create}
                    onFinish={this.onCreateOrUpdateSuccess}
                    typeCode={store.typeCode}
                />
                <EditDialog
                    ref={this._updateRef}
                    title={"新增用户"}
                    loadData={dictDataAPI.update}
                    onFinish={this.onCreateOrUpdateSuccess}
                    typeCode={store.typeCode}
                />
                <Row style={{padding: 12}} gutter={12}>
                    <Col span={6}>
                        <Input.Search
                            onSearch={this.onSearch}
                            enterButton={<SearchOutlined/>}
                        />
                    </Col>
                    <Col span={4}>
                        <Button
                            type={"primary"}
                            onClick={this.onCreateClick}
                        >新增</Button>
                    </Col>
                </Row>
                <Table
                    rowKey={(record) => record.id || ""}
                    columns={this._columns}
                    dataSource={toJS(store.data)}
                />
            </div>
        );
    }
}