import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row, Select} from "antd";
import moment from "moment";
import * as PropTypes from "prop-types";
import {observable} from "mobx";
import {Ajax} from "@utils/ajax";
import {entListState} from "../EntManager";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import DomainSelect from "@components/DomainSelect";

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

    show() {
        super.show();
        entListState.ent && entListState.ent.ID && this.loadSiteData(entListState.ent.ID);
    }

    loadDeviceData = (siteId) => {
        Ajax.apiPost("/systemmanager/ent/setting/site/get-model", {ID: siteId})
            .then((d) => {
                this.deviceList = d.data[0].relationModelMap.BC_DEVICE || [];
                if (!this.data.DEVICE_ID && this.siteList.length > 0) {
                    this.data.DEVICE_ID = this.siteList[0].ID;
                }
            });
    };

    loadSiteData = (entId) => {
        Ajax.apiPost("/systemmanager/ent/setting/site/list", {ENT_ID: entId})
            .then((d) => {
                this.siteList = d.data || [];
                if (!this.data.SITE_ID && this.siteList.length > 0) {
                    this.data.SITE_ID = this.siteList[0].ID;
                }
                this.data.SITE_ID && this.loadDeviceData(this.data.SITE_ID);
            });
    };

    onSiteSelect = (value) => {
        this.loadDeviceData(value);
    };
}

@observer
class SitePollEditDialog extends FormDialog {
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
                            {this.getFieldDecorator("SITE_ID")(
                                <Select
                                    showSearch
                                    onSelect={appState.onSiteSelect}
                                >
                                    {
                                        appState.siteList.map((item, index) =>
                                            <Select.Option
                                                key={item.ID}
                                            >{item.NAME}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="所属设备">
                            {this.getFieldDecorator("DEVICE_ID")(
                                <Select
                                    showSearch
                                >
                                    {
                                        appState.deviceList.map((item, index) =>
                                            <Select.Option
                                                key={item.ID}
                                            >{item.NAME}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="参数"
                        >
                            {this.getFieldDecorator("POLL_CODE")(
                                <DomainSelect
                                    dictTypeCode="MONITOR_PARAM"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="单位"
                        >
                            {this.getFieldDecorator("PARAM_UNIT")(
                                <DomainSelect
                                    dictTypeCode="MONITOR_PARAM_UNIT"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="最小量程"
                        >
                            {this.getFieldDecorator("MIN_RANGE")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="最大量程"
                        >
                            {this.getFieldDecorator("MAX_RANGE")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="检出下限"
                        >
                            {this.getFieldDecorator("DETECTION_DOWN")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="检出上限"
                        >
                            {this.getFieldDecorator("DETECTION_UP")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="测试方法"
                        >
                            {this.getFieldDecorator("TEST_METHOD")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(SitePollEditDialog);
