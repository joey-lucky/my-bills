import * as React from "react";
import PropTypes from "prop-types";
import {Col, Divider, Form, Row, Table} from "antd";
import {toJS} from "mobx";
import ModelUtils from "@utils/ModelUtils";
import DetailUtils from "./DetailUtils";

export default class SuppliesDetail extends React.Component {
    static propTypes = {
        data: PropTypes.any
    };

    static parseDeviceData(data) {
        let modelList = ModelUtils.getRelationModel(data[0], "BD_OP_JOB_SUPPLIES_DEVICE");
        let modelListMap = {};
        modelList.forEach((item) => {
            let itemParentValue = item.DEVICE_ID_DESC;
            if (!modelListMap[itemParentValue]) {
                modelListMap[itemParentValue] = [];
            }
            modelListMap[itemParentValue].push(item);
        });
        let result = [];
        Object.keys(modelListMap).forEach((deviceName) => {
            let list = modelListMap[deviceName];
            list[0].rowSpan = list.length;
            result.push(...list);
        });
        return result;
    }

    static parseItemData(data) {
        let modelList = ModelUtils.getRelationModel(data[0], "BD_OP_JOB_SUPPLIES_ITEM");
        let modelListMap = {};
        modelList.forEach((item) => {
            let deviceName = item.DEVICE_ID_DESC;
            if (!modelListMap[deviceName]) {
                modelListMap[deviceName] = [];
            }
            modelListMap[deviceName].push(item);
        });
        let result = [];
        Object.keys(modelListMap).forEach((deviceName) => {
            let list = modelListMap[deviceName];
            list[0].rowSpan = list.length;
            result.push(...list);
        });
        return result;
    }

    _deviceColumns = [
        {
            title: "仪表",
            dataIndex: "DEVICE_ID_DESC",
            key: "DEVICE_ID_DESC",
            render: (value, row, index) => ({
                children: value || row.ITEM_CODE_PARENT_ID_DESC,
                props: {
                    rowSpan: row.rowSpan || 0
                }
            })
        }, {
            title: "备件耗材项",
            dataIndex: "ITEM_CODE_DESC",
            key: "ITEM_CODE_DESC"
        }];

    constructor(props = {data: [{}]}, context) {
        super(props, context);
        this.state = {
            deviceDataSource: []
        };
    }

    componentDidMount() {
        this.setStateByProp(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            this.setStateByProp(nextProps);
        }
    }

    setStateByProp(props) {
        let data = toJS(props.data);
        let deviceList = SuppliesDetail.parseDeviceData(data);
        let itemList = SuppliesDetail.parseItemData(data);
        this.setState({
            deviceDataSource: [...deviceList, ...itemList]
        });
    }

    render() {
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true
        };
        const detail = this.props.data[0] || {};
        return (
            <React.Fragment>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...layout}
                            label="更换原因"
                        >
                            {detail.REPLACE_REASON_CODE_DESC}
                        </Form.Item>
                    </Col>
                </Row>
                <Divider type="horizontal"/>
                <Row>
                    <Table
                        {...DetailUtils.getTableLayout({title: "更换明细"})}
                        style={{width: "80%"}}
                        rowKey={record => record.ID}
                        dataSource={this.state.deviceDataSource}
                        columns={this._deviceColumns}
                    />
                </Row>
            </React.Fragment>
        );
    }
}
