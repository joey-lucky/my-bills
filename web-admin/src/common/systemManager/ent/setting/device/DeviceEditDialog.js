/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row, Select} from "antd";
import {autorun, computed, observable} from "mobx";
import moment from "moment";
import * as PropTypes from "prop-types";
import {Ajax} from "../../../../unit/ajax";
import {entListState} from "../EntManager";
import {FormDialog, FormDialogState} from "../../../../component/FormDialog";
import DomainSelect from "../../../../component/DomainSelect";

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

    @observable data = {};

    @computed
    get entId() {
        return entListState.ent.ID;
    }

    constructor() {
        super();
        autorun(() => {
            this.loadSiteList(this.entId);
        });
    }

    loadSiteList = (entId) => {
        Ajax.apiPost("/systemmanager/ent/setting/site/list", {ENT_ID: entId})
            .then((d) => {
                this.siteList = d.data || [];
                if (this.siteList.length > 0) {
                    this.data.SITE_ID = this.siteList[0].ID;
                }
            });
    };

    componentDidMount = () => {
        const entId = entListState.ent.ID;
        this.loadSiteList(entId);
    };
}

@observer
class DeviceEditDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        return values;
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
                        <FormItem label="设备名称">
                            {this.getFieldDecorator("NAME")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="设备型号"
                        >
                            {this.getFieldDecorator("MODEL")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="设备出厂编号"
                        >
                            {this.getFieldDecorator("MFE_NUMBER")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="环保认证编号"
                        >
                            {this.getFieldDecorator("AUT_NUMBER")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="生产厂商"
                        >
                            {this.getFieldDecorator("MFR")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="厂商联系人"
                        >
                            {this.getFieldDecorator("MFR_CONTACT")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="厂商电话"
                        >
                            {this.getFieldDecorator("MFR_TEL")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="许可编号"
                        >
                            {this.getFieldDecorator("MFE_LICENSE_NUMBER")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="设备类型"
                        >
                            {this.getFieldDecorator("DEVICE_TYPE")(
                                <DomainSelect
                                    dictTypeCode="DEVICE_TYPE"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    componentDidMount() {
        this.props.state.componentDidMount();
    }
}

export default Form.create()(DeviceEditDialog);
