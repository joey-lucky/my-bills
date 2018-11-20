import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import * as PropTypes from "prop-types";
import {observable} from "mobx";
import moment from "moment";
import {FormDialog, FormDialogState} from "../../../../component/FormDialog";

// 默认左右两边的form item
const FormItem = ({label = "", children, labelCol = {span: 8}, wrapperCol = {span: 16}}) => (
    <Form.Item
        label={label}
        style={{width: "100%"}}
        colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
    >
        {children}
    </Form.Item>
);
FormItem.propTypes = {
    label: PropTypes.any,
    children: PropTypes.any,
    labelCol: PropTypes.any,
    wrapperCol: PropTypes.any
};
class AppState extends FormDialogState {
    @observable siteList = [];
    @observable deviceList = [];

    @observable data = {};
}

@observer
class SitePollDetailDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        if (id === "CREATETIME") {
            options.initialValue = moment(appState.data.COMMISSIONING_DATE);
        } else {
            options.initialValue = appState.data[id];
        }
        return this.props.form.getFieldDecorator(id, options);
    };

    renderForm() {
        const appState = this.props.state;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="所属站点">
                            {appState.data.SITE_ID_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="所属设备">
                            {appState.data.DEVICE_ID_DESC}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="参数"
                        >
                            {appState.data.POLL_CODE_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="单位"
                        >
                            {appState.data.PARAM_UNIT_DESC}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="最小量程"
                        >
                            {appState.data.MIN_RANGE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="最大量程"
                        >
                            {appState.data.MAX_RANGE}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="检出下限"
                        >
                            {appState.data.DETECTION_DOWN}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="检出上限"
                        >
                            {appState.data.DETECTION_UP}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="测试方法"
                        >
                            {appState.data.TEST_METHOD}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(SitePollDetailDialog);
