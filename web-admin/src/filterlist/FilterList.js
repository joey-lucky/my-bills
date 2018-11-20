import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Col, Form, Input, Layout, Row, Table} from "antd";
// import {Ajax} from "../common/unit/ajax";
import * as PropTypes from "prop-types";

class AppState {

    /**
     * 成员变量
     * 1、强制：只对需要监听数据变化的变量加@observable前缀
     * 2、强制：成员变量必须包含默认值。
     */
    @observable data = [];
    @observable filterData = {
        CODE: "",
        NAME: ""
    };

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
        const params = {
            CODE: this.filterData.CODE,
            NAME: this.filterData.NAME
        };
        Ajax.apiPost("/xxx/xxx/list", params)
            .then((d) => {
                this.data = d.data || [];
            });
    }
}

@Form.create()
@observer
export default class BasicList extends React.Component {
    static propTypes = {
        form: PropTypes.object.any
    };

    static newState() {
        return new AppState();
    }

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
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onSearchClick = () => {
        const {form} = this.props;
        this._appState.filterData = form.getFieldsValue();
        this._appState.asyncLoadData();
    };

    render() {
        const {data, filterData} = this._appState;
        const {form} = this.props;
        return (
            <Layout>
                <Row style={{marginTop: 12}}>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 12}}
                            wrapperCol={{span: 12}}
                            label="代码"
                        >
                            {
                                form.getFieldDecorator("CODE", {initialValue: filterData.CODE})(<Input/>)
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 12}}
                            wrapperCol={{span: 12}}
                            label="代码"
                        >
                            {
                                form.getFieldDecorator("NAME", {initialValue: filterData.NAME})(<Input/>)
                            }
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Button
                            style={{marginLeft: 12}}
                            type="primary"
                            onClick={this.onSearchClick}
                        >查询</Button>
                    </Col>
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
